import base64
import hashlib
import hmac
import json

from services.core.api.webhooks import verify_webhook_signature


def test_verify_webhook_signature_stripe_valid() -> None:
    secret = "whsec_test"
    timestamp = "1670000000"
    raw_payload = json.dumps({"id": "evt_test", "type": "payment_intent.succeeded"})
    signed_payload = f"{timestamp}.{raw_payload}"
    signature = hmac.new(
        secret.encode("utf-8"), signed_payload.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    header = f"t={timestamp},v1={signature}"

    assert verify_webhook_signature(
        "stripe",
        secret,
        raw_payload.encode("utf-8"),
        raw_payload,
        json.loads(raw_payload),
        header,
    )


def test_verify_webhook_signature_stripe_invalid_signature() -> None:
    secret = "whsec_test"
    timestamp = "1670000000"
    raw_payload = json.dumps({"id": "evt_test", "type": "payment_intent.succeeded"})
    header = f"t={timestamp},v1={'0'*64}"

    assert not verify_webhook_signature(
        "stripe",
        secret,
        raw_payload.encode("utf-8"),
        raw_payload,
        json.loads(raw_payload),
        header,
    )


def test_verify_webhook_signature_adyen_valid() -> None:
    secret_key = base64.b64encode(b"supersecret").decode("utf-8")
    payload = {
        "notificationItems": [
            {
                "NotificationRequestItem": {
                    "pspReference": "testRef",
                    "originalReference": "origRef",
                    "merchantAccountCode": "TestMerchant",
                    "merchantReference": "Order123",
                    "amount": {"value": 12300, "currency": "EUR"},
                    "eventCode": "CAPTURE",
                    "success": "true",
                }
            }
        ]
    }
    notification = payload["notificationItems"][0]["NotificationRequestItem"]
    signing_string = ":".join(
        [
            notification.get("pspReference", ""),
            notification.get("originalReference", ""),
            notification.get("merchantAccountCode", ""),
            notification.get("merchantReference", ""),
            str(notification.get("amount", {}).get("value", "")),
            notification.get("amount", {}).get("currency", ""),
            notification.get("eventCode", ""),
            notification.get("success", ""),
        ]
    )
    expected_signature = base64.b64encode(
        hmac.new(
            base64.b64decode(secret_key),
            signing_string.encode("utf-8"),
            hashlib.sha256,
        ).digest()
    ).decode("utf-8")

    raw_payload = json.dumps(payload)

    assert verify_webhook_signature(
        "adyen",
        secret_key,
        raw_payload.encode("utf-8"),
        raw_payload,
        payload,
        expected_signature,
    )


def test_verify_webhook_signature_adyen_invalid_signature() -> None:
    secret_key = base64.b64encode(b"supersecret").decode("utf-8")
    payload = {
        "notificationItems": [
            {
                "NotificationRequestItem": {
                    "pspReference": "testRef",
                    "originalReference": "origRef",
                    "merchantAccountCode": "TestMerchant",
                    "merchantReference": "Order123",
                    "amount": {"value": 12300, "currency": "EUR"},
                    "eventCode": "CAPTURE",
                    "success": "true",
                }
            }
        ]
    }
    raw_payload = json.dumps(payload)

    assert not verify_webhook_signature(
        "adyen",
        secret_key,
        raw_payload.encode("utf-8"),
        raw_payload,
        payload,
        "invalid",
    )
