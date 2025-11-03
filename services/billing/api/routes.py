"""REST handlers exposing the payment gateway facade."""

from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException, Request, status

from services.payments import CardData, PaymentGatewayService

from .dependencies import get_gateway_service
from .errors import GatewayOperationError, map_exception
from .schemas import (
    AuthorizationRequest,
    AuthorizationResponse,
    CaptureRequest,
    CaptureResponse,
    ReconciliationQuery,
    ReconciliationRecordResponse,
    ReconciliationResponse,
    RefundRequest,
    RefundResponse,
    TokenizeRequest,
    TokenizedCardResponse,
    WebhookResponse,
)

router = APIRouter(prefix="/billing", tags=["billing"])


@router.post("/tokenize", response_model=TokenizedCardResponse, status_code=status.HTTP_201_CREATED)
def tokenize_card(
    payload: TokenizeRequest,
    service: PaymentGatewayService = Depends(get_gateway_service),
) -> TokenizedCardResponse:
    try:
        card = CardData(
            pan=payload.card.pan,
            expiry_month=payload.card.expiry_month,
            expiry_year=payload.card.expiry_year,
            cvv=payload.card.cvv,
            holder_name=payload.card.holder_name,
        )
        stored = service.tokenize(
            card,
            gateway=payload.gateway,
            customer_reference=payload.customer_reference,
            metadata=dict(payload.metadata or {}),
        )
    except Exception as exc:  # pragma: no cover - defensive guard
        raise map_exception(exc) from exc
    return TokenizedCardResponse.model_validate(stored)


@router.post("/authorizations", response_model=AuthorizationResponse)
def authorize_payment(
    payload: AuthorizationRequest,
    service: PaymentGatewayService = Depends(get_gateway_service),
) -> AuthorizationResponse:
    try:
        result = service.preauthorize(
            payload.token_reference,
            gateway=payload.gateway,
            amount=payload.amount,
            currency=payload.currency,
            capture=payload.capture,
            idempotency_key=payload.idempotency_key,
            metadata=dict(payload.metadata or {}),
        )
    except Exception as exc:
        raise map_exception(exc) from exc
    return AuthorizationResponse(
        authorization_id=result.authorization_id,
        status=result.status,
        amount=result.amount,
        currency=result.currency,
        capture_pending=result.capture_pending,
        gateway_reference=result.gateway_reference,
        created_at=result.created_at,
        metadata=result.metadata,
    )


@router.post("/captures", response_model=CaptureResponse)
def capture_payment(
    payload: CaptureRequest,
    service: PaymentGatewayService = Depends(get_gateway_service),
) -> CaptureResponse:
    try:
        result = service.capture(
            payload.authorization_id,
            gateway=payload.gateway,
            amount=payload.amount,
            metadata=dict(payload.metadata or {}),
        )
    except Exception as exc:
        raise map_exception(exc) from exc
    return CaptureResponse(
        capture_id=result.capture_id,
        authorization_id=result.authorization_id,
        amount=result.amount,
        currency=result.currency,
        status=result.status,
        processed_at=result.processed_at,
        metadata=result.metadata,
    )


@router.post("/refunds", response_model=RefundResponse)
def refund_capture(
    payload: RefundRequest,
    service: PaymentGatewayService = Depends(get_gateway_service),
) -> RefundResponse:
    try:
        result = service.refund(
            payload.capture_id,
            gateway=payload.gateway,
            amount=payload.amount,
            metadata=dict(payload.metadata or {}),
        )
    except Exception as exc:
        raise map_exception(exc) from exc
    return RefundResponse(
        refund_id=result.refund_id,
        capture_id=result.capture_id,
        authorization_id=result.authorization_id,
        amount=result.amount,
        currency=result.currency,
        status=result.status,
        processed_at=result.processed_at,
        metadata=result.metadata,
    )


@router.get("/reconciliation", response_model=ReconciliationResponse)
def reconcile(
    query: ReconciliationQuery = Depends(),
    service: PaymentGatewayService = Depends(get_gateway_service),
) -> ReconciliationResponse:
    try:
        summary = service.reconcile(gateway=query.gateway, settlement_date=query.settlement_date)
    except Exception as exc:
        raise map_exception(exc) from exc
    return ReconciliationResponse(
        gateway=summary.gateway,
        date=summary.date,
        gross_volume=summary.gross_volume,
        net_volume=summary.net_volume,
        total_fees=summary.total_fees,
        generated_at=summary.generated_at,
        records=[
            ReconciliationRecordResponse(
                authorization_id=record.authorization_id,
                capture_id=record.capture_id,
                settlement_amount=record.settlement_amount,
                settlement_currency=record.settlement_currency,
                settlement_date=record.settlement_date,
                status=record.status,
                fee_amount=record.fee_amount,
                metadata=record.metadata,
            )
            for record in summary.records
        ],
    )


@router.post("/webhooks/{gateway}", response_model=WebhookResponse)
async def receive_webhook(
    gateway: str,
    request: Request,
    service: PaymentGatewayService = Depends(get_gateway_service),
) -> WebhookResponse:
    try:
        raw_body = await request.body()
        try:
            payload = await request.json()
        except json.JSONDecodeError:
            payload = {}
        event = service.webhooks.dispatch(
            gateway,
            payload,
            dict(request.headers),
            raw_body=raw_body,
        )
    except Exception as exc:
        if isinstance(exc, HTTPException):  # pragma: no cover - passthrough
            raise
        raise map_exception(GatewayOperationError(str(exc))) from exc
    return WebhookResponse(
        gateway=event.gateway,
        event_type=event.event_type,
        signature_valid=event.signature_valid,
        received_at=event.received_at,
        payload=event.payload,
    )
