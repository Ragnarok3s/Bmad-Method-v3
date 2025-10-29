from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
import threading
import uuid
from typing import Dict, List, Optional

from ..domain.schemas import (
    OwnerDocumentUploadResponse,
    OwnerIncidentReport,
    OwnerInvoiceRead,
    OwnerMetricsRead,
    OwnerNotificationRead,
    OwnerOverviewRead,
    OwnerPayoutPreferencesRead,
    OwnerPayoutPreferencesUpdate,
    OwnerPropertySummaryRead,
    OwnerReportRead,
)
from ..events import EventBus, Notification, NotificationCenter, WebhookDispatcher
from ..storage import SecureDocumentStorage, StoredDocument


@dataclass
class ManualVerificationTask:
    id: str
    owner_id: int
    document_id: str
    document_type: str
    status: str
    submitted_at: datetime


class ManualVerificationQueue:
    def __init__(self) -> None:
        self._items: Dict[str, ManualVerificationTask] = {}
        self._order: List[str] = []
        self._lock = threading.Lock()

    def enqueue(self, owner_id: int, document_id: str, document_type: str) -> ManualVerificationTask:
        task = ManualVerificationTask(
            id=str(uuid.uuid4()),
            owner_id=owner_id,
            document_id=document_id,
            document_type=document_type,
            status="pending",
            submitted_at=datetime.now(timezone.utc),
        )
        with self._lock:
            self._items[task.id] = task
            self._order.append(task.id)
        return task

    def count_pending(self, owner_id: int | None = None) -> int:
        with self._lock:
            items = list(self._items.values())
        if owner_id is None:
            return sum(1 for item in items if item.status == "pending")
        return sum(1 for item in items if item.status == "pending" and item.owner_id == owner_id)

    def list_pending(self, owner_id: int | None = None) -> List[ManualVerificationTask]:
        with self._lock:
            ordered = [self._items[item_id] for item_id in self._order if self._items[item_id].status == "pending"]
        if owner_id is None:
            return ordered
        return [task for task in ordered if task.owner_id == owner_id]


@dataclass
class OwnerRecord:
    id: int
    name: str
    email: str
    phone: str
    token: str
    metrics: OwnerMetricsRead
    payout_preferences: OwnerPayoutPreferencesRead
    properties: List[OwnerPropertySummaryRead]
    invoices: List[OwnerInvoiceRead]
    reports: List[OwnerReportRead]
    last_payout_at: datetime | None
    documents: List[StoredDocument] = field(default_factory=list)


class OwnerService:
    def __init__(
        self,
        event_bus: Optional[EventBus] = None,
        storage: Optional[SecureDocumentStorage] = None,
        verification_queue: Optional[ManualVerificationQueue] = None,
        notifications: Optional[NotificationCenter] = None,
        webhooks: Optional[WebhookDispatcher] = None,
    ) -> None:
        self.event_bus = event_bus or EventBus()
        self.storage = storage or SecureDocumentStorage()
        self.verification_queue = verification_queue or ManualVerificationQueue()
        self.notifications = notifications or NotificationCenter(self.event_bus)
        if notifications is None:
            self.notifications.bind(self.event_bus)
        self.webhooks = webhooks or WebhookDispatcher(self.event_bus)
        if webhooks is None:
            self.webhooks.bind(self.event_bus)
        self._lock = threading.Lock()
        self._owners: Dict[int, OwnerRecord] = {}
        self._bootstrap()

    def _bootstrap(self) -> None:
        now = datetime.now(timezone.utc)
        metrics = OwnerMetricsRead(
            occupancy_rate=0.82,
            revenue_mtd=48500.0,
            average_daily_rate=128.0,
            incident_count=2,
            guest_satisfaction=4.6,
            pending_invoices=1,
            properties_active=4,
        )
        payout = OwnerPayoutPreferencesRead(
            method="bank_transfer",
            beneficiary_name="Helena Pereira",
            bank_account_last4="1234",
            currency="EUR",
            payout_threshold=1500.0,
            schedule="monthly",
            updated_at=now - timedelta(days=7),
            manual_review_required=False,
        )
        properties = [
            OwnerPropertySummaryRead(
                property_id=101,
                property_name="Lisboa Downtown Boutique",
                occupancy_rate=0.87,
                revenue_mtd=18200.0,
                adr=142.0,
                last_incident_at=now - timedelta(days=3),
                issues_open=1,
            ),
            OwnerPropertySummaryRead(
                property_id=102,
                property_name="Porto Riverside Lofts",
                occupancy_rate=0.78,
                revenue_mtd=15840.0,
                adr=135.0,
                last_incident_at=None,
                issues_open=0,
            ),
            OwnerPropertySummaryRead(
                property_id=103,
                property_name="Coimbra Business Suites",
                occupancy_rate=0.69,
                revenue_mtd=9000.0,
                adr=118.0,
                last_incident_at=now - timedelta(days=10),
                issues_open=2,
            ),
        ]
        invoices = [
            OwnerInvoiceRead(
                invoice_id="INV-2024-05-001",
                property_name="Lisboa Downtown Boutique",
                due_date=now - timedelta(days=3),
                amount_due=4200.35,
                currency="EUR",
                status="overdue",
            ),
            OwnerInvoiceRead(
                invoice_id="INV-2024-05-014",
                property_name="Porto Riverside Lofts",
                due_date=now + timedelta(days=5),
                amount_due=3890.15,
                currency="EUR",
                status="pending",
            ),
            OwnerInvoiceRead(
                invoice_id="INV-2024-04-021",
                property_name="Coimbra Business Suites",
                due_date=now - timedelta(days=20),
                amount_due=4100.0,
                currency="EUR",
                status="paid",
            ),
        ]
        reports = [
            OwnerReportRead(
                report_id="RPT-occupancy-2024-04",
                title="Resumo de ocupação",
                period="Abr 2024",
                url="https://reports.bmad.example/occupancy-202404.pdf",
                generated_at=now - timedelta(days=2),
                format="pdf",
            ),
            OwnerReportRead(
                report_id="RPT-revenue-2024-Q1",
                title="Receita consolidada Q1",
                period="Q1 2024",
                url="https://reports.bmad.example/revenue-q1-2024.xlsx",
                generated_at=now - timedelta(days=20),
                format="xlsx",
            ),
        ]
        record = OwnerRecord(
            id=1,
            name="Helena Pereira",
            email="helena.pereira@example.com",
            phone="(+351) 912 345 678",
            token="demo-owner-token",
            metrics=metrics,
            payout_preferences=payout,
            properties=properties,
            invoices=invoices,
            reports=reports,
            last_payout_at=now - timedelta(days=15),
        )
        self._owners[record.id] = record
        # Pre-seed manual verification queue and notifications
        self.verification_queue.enqueue(record.id, "initial-kyc", "identity")
        self.notifications.add(
            Notification(
                id=str(uuid.uuid4()),
                owner_id=record.id,
                title="Portal ativado",
                message="Bem-vindo ao painel do proprietário. Documentos pendentes de revisão.",
                category="info",
                created_at=now - timedelta(days=1),
                read=False,
            )
        )

    def validate_token(self, owner_id: int, token: str) -> bool:
        owner = self._owners.get(owner_id)
        if not owner:
            return False
        return owner.token == token

    def get_overview(self, owner_id: int) -> OwnerOverviewRead:
        owner = self._require_owner(owner_id)
        pending = self.verification_queue.count_pending(owner_id)
        unread = self.notifications.unread_count(owner_id)
        documents_submitted = len(owner.documents)
        compliance = "pending" if pending else "clear"
        return OwnerOverviewRead(
            owner_id=owner.id,
            owner_name=owner.name,
            email=owner.email,
            phone=owner.phone,
            metrics=owner.metrics,
            payout_preferences=owner.payout_preferences,
            pending_verifications=pending,
            unread_notifications=unread,
            last_payout_at=owner.last_payout_at,
            compliance_status=compliance,
            documents_submitted=documents_submitted,
        )

    def list_properties(self, owner_id: int) -> List[OwnerPropertySummaryRead]:
        owner = self._require_owner(owner_id)
        return list(owner.properties)

    def list_invoices(self, owner_id: int) -> List[OwnerInvoiceRead]:
        owner = self._require_owner(owner_id)
        return list(owner.invoices)

    def list_reports(self, owner_id: int) -> List[OwnerReportRead]:
        owner = self._require_owner(owner_id)
        return list(owner.reports)

    def list_notifications(self, owner_id: int) -> List[OwnerNotificationRead]:
        items = self.notifications.list(owner_id)
        return [
            OwnerNotificationRead(
                id=item.id,
                title=item.title,
                message=item.message,
                category=item.category,
                created_at=item.created_at,
                read=item.read,
            )
            for item in items
        ]

    def update_payout_preferences(self, owner_id: int, payload: OwnerPayoutPreferencesUpdate) -> OwnerPayoutPreferencesRead:
        owner = self._require_owner(owner_id)
        requires_manual = payload.method != owner.payout_preferences.method
        updated = OwnerPayoutPreferencesRead(
            method=payload.method,
            beneficiary_name=payload.beneficiary_name,
            bank_account_last4=payload.bank_account_last4,
            currency=payload.currency,
            payout_threshold=payload.payout_threshold,
            schedule=payload.schedule,
            updated_at=datetime.now(timezone.utc),
            manual_review_required=requires_manual,
        )
        with self._lock:
            owner.payout_preferences = updated
        self.event_bus.publish(
            "owner.payout_preferences.updated",
            {"owner_id": owner_id, "method": payload.method},
        )
        if requires_manual:
            self.verification_queue.enqueue(owner_id, "payout-update", "payout_preferences")
        return updated

    def submit_document(
        self,
        owner_id: int,
        filename: str,
        stream,
        content_type: str | None = None,
        document_type: str = "kyc",
    ) -> OwnerDocumentUploadResponse:
        owner = self._require_owner(owner_id)
        stored = self.storage.save(owner_id, filename, stream, content_type)
        with self._lock:
            owner.documents.append(stored)
        task = self.verification_queue.enqueue(owner_id, stored.id, document_type)
        self.event_bus.publish(
            "owner.kyc.submitted",
            {
                "owner_id": owner_id,
                "document_id": stored.id,
                "document_type": document_type,
                "queue_id": task.id,
            },
        )
        return OwnerDocumentUploadResponse(
            document_id=stored.id,
            status="queued",
            manual_review_id=task.id,
        )

    def report_incident(self, owner_id: int, payload: OwnerIncidentReport) -> None:
        self._require_owner(owner_id)
        self.event_bus.publish(
            "owner.incident.reported",
            {
                "owner_id": owner_id,
                "incident": payload.incident,
                "severity": payload.severity,
                "reported_by": payload.reported_by,
            },
        )

    def record_payment(self, owner_id: int, amount: float, reference: str) -> None:
        self._require_owner(owner_id)
        self.event_bus.publish(
            "owner.payment.processed",
            {"owner_id": owner_id, "amount": amount, "reference": reference},
        )

    def _require_owner(self, owner_id: int) -> OwnerRecord:
        owner = self._owners.get(owner_id)
        if not owner:
            raise KeyError(f"Owner {owner_id} not found")
        return owner


__all__ = [
    "ManualVerificationQueue",
    "ManualVerificationTask",
    "OwnerService",
]
