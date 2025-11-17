"""Serviços de autenticação com MFA e recuperação."""
from __future__ import annotations

import base64
import binascii
import hashlib
import hmac
import json
import secrets
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Iterable

from fastapi import status
from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from ..domain.models import Agent, AgentCredential, AuthSession, AuditLog
from ..observability import record_audit_event, record_critical_alert


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _pad_base32(secret: str) -> str:
    padding = (-len(secret)) % 8
    if padding:
        secret = secret + "=" * padding
    return secret


class AuthenticationError(Exception):
    """Erro controlado para fluxos de autenticação."""

    def __init__(self, status_code: int, detail: str | dict[str, Any]) -> None:
        super().__init__(str(detail))
        self.status_code = status_code
        self.detail = detail


@dataclass(slots=True)
class EnrollmentResult:
    agent: Agent
    mfa_secret: str
    recovery_codes: list[str]


@dataclass(slots=True)
class LoginResult:
    session: AuthSession
    mfa_required: bool
    recovery_codes_remaining: int


class AuthenticationService:
    """Gere autenticação por password com MFA e recuperação."""

    def __init__(
        self,
        session: Session,
        *,
        session_timeout: timedelta | None = None,
        max_attempts: int = 5,
        lockout_window: timedelta | None = None,
    ) -> None:
        self.session = session
        self._session_timeout = session_timeout or timedelta(minutes=30)
        self._max_attempts = max_attempts
        self._lockout_window = lockout_window or timedelta(minutes=15)

    # region enrolment -------------------------------------------------
    def enroll_agent(
        self,
        agent: Agent,
        password: str,
        *,
        mfa_secret: str | None = None,
        recovery_codes: Iterable[str] | None = None,
    ) -> EnrollmentResult:
        if not password:
            raise ValueError("password cannot be empty")

        credential = self._get_or_create_credentials(agent)
        secret = mfa_secret or self.generate_mfa_secret()
        codes = list(recovery_codes or self.generate_recovery_codes())
        credential.password_hash = self._hash_password(password)
        credential.mfa_secret = secret
        credential.mfa_enrolled = True
        credential.recovery_codes = [self._hash_recovery_code(code) for code in codes]
        credential.failed_attempts = 0
        credential.locked_until = None
        credential.updated_at = _utcnow()
        self.session.add(credential)
        self._persist_audit(
            "auth_mfa_enrolled",
            agent_id=agent.id,
            detail={"recovery_codes": len(codes)},
        )
        return EnrollmentResult(agent=agent, mfa_secret=secret, recovery_codes=codes)

    # endregion --------------------------------------------------------

    # region login -----------------------------------------------------
    def initiate_login(
        self,
        email: str,
        password: str,
        *,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> LoginResult:
        agent = self._lookup_agent(email)
        credential = agent.credentials
        if credential is None:
            self._persist_audit(
                "auth_login_failure",
                agent_id=None,
                detail={"email": email, "reason": "missing_credentials"},
                severity="warning",
            )
            raise AuthenticationError(status.HTTP_401_UNAUTHORIZED, "Credenciais inválidas")

        now = _utcnow()
        if credential.locked_until and _ensure_utc(credential.locked_until) > now:
            self._persist_audit(
                "auth_login_blocked",
                agent_id=agent.id,
                detail={"email": email, "locked_until": credential.locked_until.isoformat()},
                severity="warning",
            )
            raise AuthenticationError(
                status.HTTP_423_LOCKED,
                {
                    "message": "Conta temporariamente bloqueada",
                    "locked_until": credential.locked_until.isoformat(),
                },
            )

        if not self._verify_password(password, credential.password_hash):
            credential.failed_attempts += 1
            detail = {
                "email": email,
                "attempts": credential.failed_attempts,
                "max": self._max_attempts,
            }
            if credential.failed_attempts >= self._max_attempts:
                credential.locked_until = now + self._lockout_window
                record_critical_alert(
                    "auth.account_locked",
                    "Conta bloqueada por tentativas inválidas",
                    context={"agent_id": str(agent.id), "email": agent.email},
                )
                detail["locked_until"] = credential.locked_until.isoformat()
            self.session.add(credential)
            self._persist_audit(
                "auth_login_failure",
                agent_id=agent.id,
                detail=detail,
                severity="warning",
            )
            raise AuthenticationError(status.HTTP_401_UNAUTHORIZED, "Credenciais inválidas")

        credential.failed_attempts = 0
        credential.locked_until = None
        self.session.add(credential)

        auth_session = self._create_session(
            agent,
            ip_address=ip_address,
            user_agent=user_agent,
            mfa_verified=not credential.mfa_enrolled,
            method="password",
        )
        recovery_remaining = len(credential.recovery_codes)

        if credential.mfa_enrolled:
            self._persist_audit(
                "auth_login_challenge",
                agent_id=agent.id,
                detail={"email": agent.email, "mfa_required": True},
            )
        else:
            credential.last_login_at = now
            self.session.add(credential)
            self._persist_audit(
                "auth_login_success",
                agent_id=agent.id,
                detail={"email": agent.email, "method": "password"},
            )

        return LoginResult(
            session=auth_session,
            mfa_required=credential.mfa_enrolled,
            recovery_codes_remaining=recovery_remaining,
        )

    def verify_mfa(self, session_id: str, code: str, *, method: str = "totp") -> AuthSession:
        session_obj = self.session.get(AuthSession, session_id)
        if not session_obj or session_obj.revoked_at is not None:
            raise AuthenticationError(status.HTTP_404_NOT_FOUND, "Sessão não encontrada")

        now = _utcnow()
        expires_at = _ensure_utc(session_obj.expires_at)
        if expires_at <= now:
            self._persist_audit(
                "auth_session_expired",
                agent_id=session_obj.agent_id,
                detail={"session_id": session_id},
                severity="warning",
            )
            raise AuthenticationError(status.HTTP_401_UNAUTHORIZED, "Sessão expirada")

        credential = session_obj.agent.credentials
        if credential is None or not credential.mfa_enrolled:
            raise AuthenticationError(status.HTTP_400_BAD_REQUEST, "MFA não configurado")

        verified = False
        if method == "totp":
            if credential.mfa_secret is None:
                raise AuthenticationError(status.HTTP_400_BAD_REQUEST, "Segredo MFA ausente")
            verified = self.verify_totp(credential.mfa_secret, code)
        elif method == "recovery":
            verified = self._consume_recovery_code(credential, code)
        else:
            raise AuthenticationError(status.HTTP_400_BAD_REQUEST, "Método MFA inválido")

        if not verified:
            self._persist_audit(
                "auth_mfa_failed",
                agent_id=session_obj.agent_id,
                detail={"session_id": session_id, "method": method},
                severity="warning",
            )
            raise AuthenticationError(status.HTTP_401_UNAUTHORIZED, "Código inválido")

        session_obj.mfa_verified_at = now
        session_obj.last_active_at = now
        credential.last_login_at = now
        self.session.add_all([session_obj, credential])
        self._persist_audit(
            "auth_login_success",
            agent_id=session_obj.agent_id,
            detail={"method": method},
        )
        return session_obj

    # endregion --------------------------------------------------------

    # region recovery --------------------------------------------------
    def initiate_recovery(self, email: str) -> list[str]:
        agent = self._lookup_agent(email)
        credential = self._get_or_create_credentials(agent)
        codes = self.generate_recovery_codes()
        credential.recovery_codes = [self._hash_recovery_code(code) for code in codes]
        credential.updated_at = _utcnow()
        self.session.add(credential)
        record_critical_alert(
            "auth.recovery_codes_issued",
            "Novos códigos de recuperação emitidos",
            context={"agent_id": str(agent.id), "email": agent.email},
            severity="high",
        )
        self._persist_audit(
            "auth_recovery_issued",
            agent_id=agent.id,
            detail={"codes": len(codes)},
        )
        return codes

    def complete_recovery(
        self,
        email: str,
        code: str,
        *,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> AuthSession:
        agent = self._lookup_agent(email)
        credential = agent.credentials
        if credential is None:
            raise AuthenticationError(status.HTTP_401_UNAUTHORIZED, "Recuperação indisponível")
        if not self._consume_recovery_code(credential, code):
            self._persist_audit(
                "auth_recovery_failed",
                agent_id=agent.id,
                detail={"email": email},
                severity="warning",
            )
            raise AuthenticationError(status.HTTP_401_UNAUTHORIZED, "Código inválido")
        auth_session = self._create_session(
            agent,
            ip_address=ip_address,
            user_agent=user_agent,
            mfa_verified=True,
            method="recovery",
        )
        credential.last_login_at = _utcnow()
        self.session.add(credential)
        self._persist_audit(
            "auth_recovery_completed",
            agent_id=agent.id,
            detail={"session_id": auth_session.id},
        )
        return auth_session

    # endregion --------------------------------------------------------

    # region helpers ---------------------------------------------------
    def _lookup_agent(self, email: str) -> Agent:
        query: Select[Agent] = select(Agent).where(Agent.email == email)
        agent = self.session.execute(query).scalar_one_or_none()
        if agent is None:
            self._persist_audit(
                "auth_login_failure",
                agent_id=None,
                detail={"email": email, "reason": "unknown_agent"},
                severity="warning",
            )
            raise AuthenticationError(status.HTTP_401_UNAUTHORIZED, "Credenciais inválidas")
        return agent

    def _get_or_create_credentials(self, agent: Agent) -> AgentCredential:
        credential = agent.credentials
        if credential is None:
            credential = AgentCredential(agent_id=agent.id, password_hash="")
            credential.recovery_codes = []
            self.session.add(credential)
        return credential

    def _create_session(
        self,
        agent: Agent,
        *,
        ip_address: str | None,
        user_agent: str | None,
        mfa_verified: bool,
        method: str,
    ) -> AuthSession:
        now = _utcnow()
        expires_at = now + self._session_timeout
        session_id = secrets.token_urlsafe(32)
        auth_session = AuthSession(
            id=session_id,
            agent_id=agent.id,
            created_at=now,
            last_active_at=now,
            expires_at=expires_at,
            mfa_verified_at=now if mfa_verified else None,
            ip_address=ip_address,
            user_agent=user_agent[:160] if user_agent else None,
        )
        auth_session.agent = agent
        self.session.add(auth_session)
        self._persist_audit(
            "auth_session_created",
            agent_id=agent.id,
            detail={"session_id": session_id, "method": method, "expires_at": expires_at.isoformat()},
        )
        return auth_session

    def _persist_audit(
        self,
        action: str,
        *,
        agent_id: int | None,
        detail: dict[str, object],
        severity: str = "info",
    ) -> None:
        record_audit_event(action, actor_id=agent_id, detail=detail, severity=severity)
        payload = AuditLog(
            action=action,
            agent_id=agent_id,
            detail=json.dumps(detail),
            created_at=_utcnow(),
        )
        self.session.add(payload)

    @staticmethod
    def _hash_password(password: str, salt: bytes | None = None) -> str:
        salt = salt or secrets.token_bytes(16)
        derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
        return f"{base64.b64encode(salt).decode()}:{base64.b64encode(derived).decode()}"

    @staticmethod
    def _verify_password(password: str, stored_hash: str) -> bool:
        if ":" not in stored_hash:
            return False
        salt_b64, hash_b64 = stored_hash.split(":", 1)
        try:
            salt = base64.b64decode(salt_b64)
            expected = base64.b64decode(hash_b64)
        except (ValueError, binascii.Error):
            return False
        comparison = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
        return hmac.compare_digest(comparison, expected)

    @staticmethod
    def _hash_recovery_code(code: str) -> str:
        return hashlib.sha256(code.encode("utf-8")).hexdigest()

    def _consume_recovery_code(self, credential: AgentCredential, code: str) -> bool:
        hashed = self._hash_recovery_code(code)
        codes = credential.recovery_codes
        for idx, stored in enumerate(codes):
            if hmac.compare_digest(hashed, stored):
                del codes[idx]
                credential.recovery_codes = codes
                self.session.add(credential)
                return True
        return False

    # endregion --------------------------------------------------------

    # region utilities -------------------------------------------------
    @staticmethod
    def generate_mfa_secret(length: int = 20) -> str:
        return base64.b32encode(secrets.token_bytes(length)).decode("utf-8").rstrip("=")

    @staticmethod
    def generate_recovery_codes(count: int = 8) -> list[str]:
        codes: list[str] = []
        for _ in range(count):
            value = secrets.token_hex(5).upper()
            codes.append(f"{value[:5]}-{value[5:]}")
        return codes

    @staticmethod
    def calculate_totp(secret: str, timestamp: datetime | None = None, interval: int = 30, digits: int = 6) -> str:
        timestamp = timestamp or _utcnow()
        key = base64.b32decode(_pad_base32(secret), casefold=True)
        counter = int(timestamp.timestamp() // interval)
        msg = counter.to_bytes(8, "big")
        hmac_digest = hmac.new(key, msg, hashlib.sha1).digest()
        offset = hmac_digest[-1] & 0x0F
        binary = int.from_bytes(hmac_digest[offset : offset + 4], "big") & 0x7FFFFFFF
        code = str(binary % (10**digits))
        return code.zfill(digits)

    def verify_totp(self, secret: str, code: str, *, interval: int = 30, digits: int = 6) -> bool:
        code = code.strip()
        if len(code) != digits:
            return False
        timestamp = _utcnow()
        for offset in (-1, 0, 1):
            comparison_time = timestamp + timedelta(seconds=offset * interval)
            if hmac.compare_digest(
                self.calculate_totp(secret, timestamp=comparison_time, interval=interval, digits=digits),
                code,
            ):
                return True
        return False

    # endregion --------------------------------------------------------

    @property
    def session_timeout_seconds(self) -> int:
        return int(self._session_timeout.total_seconds())


__all__ = [
    "AuthenticationError",
    "AuthenticationService",
    "EnrollmentResult",
    "LoginResult",
]
