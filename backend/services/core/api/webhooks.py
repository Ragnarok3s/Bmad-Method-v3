"""Helpers para validação de webhooks de pagamento."""

from __future__ import annotations

import base64
import binascii
import hashlib
import hmac
from typing import Any


def _parse_signature_header(signature: str) -> dict[str, str]:
    parts: dict[str, str] = {}
    for part in signature.split(","):
        if "=" not in part:
            continue
        key, value = part.split("=", 1)
        key = key.strip().lower()
        value = value.strip()
        if key and value:
            parts[key] = value
    return parts


def _extract_signature_value(signature: str | None) -> str | None:
    if not signature:
        return None
    value = signature.strip()
    if not value:
        return None
    parts = _parse_signature_header(value)
    for key in ("v1", "signature", "sig"):
        candidate = parts.get(key)
        if candidate:
            return candidate
    return value


def _verify_stripe_signature(
    secret: str, raw_payload: str, signature: str, signature_value: str
) -> bool:
    parts = _parse_signature_header(signature)
    timestamp = parts.get("t")
    if not timestamp:
        return False
    signed_payload = f"{timestamp}.{raw_payload}"
    digest = hmac.new(
        secret.encode("utf-8"), signed_payload.encode("utf-8"), hashlib.sha256
    )
    expected_hex = digest.hexdigest()
    return hmac.compare_digest(expected_hex, signature_value)


def _normalize_adyen_component(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value)


def _verify_adyen_signature(
    secret: str, payload: dict[str, Any], signature_value: str
) -> bool:
    items = payload.get("notificationItems")
    notification: dict[str, Any] | None = None
    if isinstance(items, list) and items:
        candidate = items[0]
        if isinstance(candidate, dict) and candidate.get("NotificationRequestItem"):
            inner = candidate.get("NotificationRequestItem")
            if isinstance(inner, dict):
                notification = inner
        elif isinstance(candidate, dict):
            notification = candidate
    elif isinstance(payload, dict):
        notification = payload
    if not notification:
        return False
    amount = notification.get("amount")
    if isinstance(amount, dict):
        amount_value = amount.get("value", "")
        amount_currency = amount.get("currency", "")
    else:
        amount_value = ""
        amount_currency = ""
    merchant_account = notification.get("merchantAccountCode") or notification.get(
        "merchantAccount"
    )
    components = [
        notification.get("pspReference", ""),
        notification.get("originalReference", ""),
        merchant_account or "",
        notification.get("merchantReference", ""),
        amount_value,
        amount_currency,
        notification.get("eventCode", ""),
        notification.get("success", ""),
    ]
    signing_components = [
        _normalize_adyen_component(component) for component in components
    ]
    if not any(signing_components):
        return False
    try:
        key = base64.b64decode(secret, validate=True)
    except (binascii.Error, ValueError):
        key = secret.encode("utf-8")
    message = ":".join(signing_components)
    digest = hmac.new(key, message.encode("utf-8"), hashlib.sha256).digest()
    expected_signature = base64.b64encode(digest).decode("utf-8")
    return hmac.compare_digest(expected_signature, signature_value)


def verify_webhook_signature(
    provider: str,
    secret: str,
    raw_payload_bytes: bytes,
    raw_payload: str,
    payload: dict[str, Any],
    signature: str | None,
) -> bool:
    signature_value = _extract_signature_value(signature)
    if not signature_value:
        return False
    provider_key = provider.strip().lower()
    if provider_key == "stripe" and signature:
        return _verify_stripe_signature(secret, raw_payload, signature, signature_value)
    if provider_key == "adyen":
        if _verify_adyen_signature(secret, payload, signature_value):
            return True
    digest = hmac.new(secret.encode("utf-8"), raw_payload_bytes, hashlib.sha256)
    expected_hex = digest.hexdigest()
    if hmac.compare_digest(expected_hex, signature_value):
        return True
    try:
        expected_bytes = digest.digest()
        provided_bytes = base64.b64decode(signature_value, validate=True)
    except (binascii.Error, ValueError):
        return False
    return hmac.compare_digest(expected_bytes, provided_bytes)


__all__ = ["verify_webhook_signature"]
