(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
const accentStyles = {
    success: 'var(--color-success)',
    warning: 'var(--color-calm-gold)',
    critical: 'var(--color-coral)',
    info: 'var(--color-soft-aqua)'
};
function Card({ title, description, accent, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        "data-accent": accent ?? 'none',
        className: "jsx-87d2891ee0ce56f" + " " + "card",
        children: [
            (title || description) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-87d2891ee0ce56f",
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "jsx-87d2891ee0ce56f",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx",
                        lineNumber: 23,
                        columnNumber: 21
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-87d2891ee0ce56f" + " " + "card-description",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx",
                        lineNumber: 24,
                        columnNumber: 27
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-87d2891ee0ce56f",
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "87d2891ee0ce56f",
                children: `.card.jsx-87d2891ee0ce56f{background:var(--color-neutral-0);border-radius:var(--radius-md);padding:var(--space-5);box-shadow:var(--shadow-card);border:1px solid var(--app-border-subtle);gap:var(--space-5);display:grid;position:relative}.card.jsx-87d2891ee0ce56f:before{content:"";border-radius:calc(var(--radius-md) - 1px);pointer-events:none;border:1px solid #0000;position:absolute;inset:0}.card[data-accent=success].jsx-87d2891ee0ce56f:before{border-top-color:${accentStyles.success}}.card[data-accent=warning].jsx-87d2891ee0ce56f:before{border-top-color:${accentStyles.warning}}.card[data-accent=critical].jsx-87d2891ee0ce56f:before{border-top-color:${accentStyles.critical}}.card[data-accent=info].jsx-87d2891ee0ce56f:before{border-top-color:${accentStyles.info}}header.jsx-87d2891ee0ce56f h3.jsx-87d2891ee0ce56f{color:var(--color-neutral-3);letter-spacing:-.01em;margin:0;font-size:1.125rem}.card-description.jsx-87d2891ee0ce56f{margin:var(--space-2)0 0;color:var(--color-neutral-2);line-height:1.5}@media (width<=768px){.card.jsx-87d2891ee0ce56f{padding:var(--space-4)}}`
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "completeRecovery",
    ()=>completeRecovery,
    "initiateRecovery",
    ()=>initiateRecovery,
    "login",
    ()=>login,
    "verifyMfa",
    ()=>verifyMfa
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
;
const CORE_API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000") ?? 'http://localhost:8000';
async function login(payload) {
    const url = new URL('/auth/login', CORE_API_BASE_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const body = await safeReadJson(response);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to authenticate', response.status, body);
    }
    const dto = await response.json();
    return mapLogin(dto);
}
async function verifyMfa(payload) {
    const url = new URL('/auth/mfa/verify', CORE_API_BASE_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_id: payload.sessionId,
            code: payload.code,
            method: payload.method ?? 'totp'
        })
    });
    if (!response.ok) {
        const body = await safeReadJson(response);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to verify MFA', response.status, body);
    }
    const dto = await response.json();
    return mapLogin(dto);
}
async function initiateRecovery(email) {
    const url = new URL('/auth/recovery/initiate', CORE_API_BASE_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        })
    });
    if (!response.ok) {
        const body = await safeReadJson(response);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to initiate recovery', response.status, body);
    }
    const dto = await response.json();
    return {
        email: dto.email,
        issuedAt: dto.issued_at,
        recoveryCodes: dto.recovery_codes
    };
}
async function completeRecovery(payload) {
    const url = new URL('/auth/recovery/complete', CORE_API_BASE_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: payload.email,
            code: payload.code
        })
    });
    if (!response.ok) {
        const body = await safeReadJson(response);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to complete recovery', response.status, body);
    }
    const dto = await response.json();
    return mapLogin(dto);
}
function mapLogin(dto) {
    return {
        sessionId: dto.session_id,
        agentId: dto.agent_id,
        mfaRequired: dto.mfa_required,
        expiresAt: dto.expires_at,
        sessionTimeoutSeconds: dto.session_timeout_seconds,
        recoveryCodesRemaining: dto.recovery_codes_remaining
    };
}
async function safeReadJson(response) {
    try {
        return await response.json();
    } catch (error) {
        return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function LoginPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])('auth.login');
    async function handleSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const email = String(form.get('email') ?? '').trim();
        const password = String(form.get('password') ?? '');
        if (!email || !password) {
            setError(t('errors.missingCredentials'));
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])({
                email,
                password
            });
            setResult(response);
            if (response.mfaRequired) {
                router.push(`/mfa?sessionId=${encodeURIComponent(response.sessionId)}`);
            }
        } catch (apiError) {
            if (apiError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
                const detail = apiError.body?.detail;
                if (typeof detail === 'string') {
                    setError(detail);
                } else if (detail && typeof detail === 'object' && 'message' in detail) {
                    setError(String(detail.message));
                } else {
                    setError(t('errors.coreFailure'));
                }
            } else {
                setError(t('errors.unexpected'));
            }
            setResult(null);
        } finally{
            setIsSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        title: t('cardTitle'),
        description: t('cardDescription'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                noValidate: true,
                className: "jsx-167b0a82681e7cbd" + " " + "auth-form",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "jsx-167b0a82681e7cbd" + " " + "field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-167b0a82681e7cbd",
                                children: t('labels.email')
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                name: "email",
                                autoComplete: "username",
                                required: true,
                                className: "jsx-167b0a82681e7cbd"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "jsx-167b0a82681e7cbd" + " " + "field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-167b0a82681e7cbd",
                                children: t('labels.password')
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                name: "password",
                                autoComplete: "current-password",
                                required: true,
                                className: "jsx-167b0a82681e7cbd"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "jsx-167b0a82681e7cbd" + " " + "feedback error",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    result && !result.mfaRequired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-167b0a82681e7cbd" + " " + "feedback success",
                        children: t('success.sessionStarted', {
                            agentId: result.agentId,
                            minutes: Math.round(result.sessionTimeoutSeconds / 60)
                        })
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isSubmitting,
                        className: "jsx-167b0a82681e7cbd" + " " + "primary",
                        children: isSubmitting ? t('actions.submitting') : t('actions.submit')
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-167b0a82681e7cbd" + " " + "aux",
                        children: [
                            t('links.recoverPrompt'),
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/recover",
                                children: t('links.recoverCta')
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "167b0a82681e7cbd",
                children: ".auth-form.jsx-167b0a82681e7cbd{gap:var(--space-4);display:grid}.field.jsx-167b0a82681e7cbd{gap:var(--space-2);display:grid}input.jsx-167b0a82681e7cbd{border:1px solid var(--color-neutral-5);border-radius:var(--radius-sm);padding:var(--space-2)var(--space-3);font-size:1rem}.primary.jsx-167b0a82681e7cbd{background:var(--color-deep-blue);color:#fff;padding:var(--space-3);border-radius:var(--radius-sm);cursor:pointer;border:none;font-weight:600}.primary.jsx-167b0a82681e7cbd:disabled{opacity:.6;cursor:not-allowed}.feedback.jsx-167b0a82681e7cbd{margin:0;font-size:.95rem}.feedback.error.jsx-167b0a82681e7cbd{color:#b00020}.feedback.success.jsx-167b0a82681e7cbd{color:var(--color-success,#0f7b6c)}.aux.jsx-167b0a82681e7cbd{color:var(--color-neutral-9);margin:0;font-size:.9rem}.aux.jsx-167b0a82681e7cbd a.jsx-167b0a82681e7cbd{color:var(--color-deep-blue);font-weight:600}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/(auth)/login/page.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "4bmhQIJXPV/GZWV5ZzLAydc5I/8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Bmad-Method_apps_web_d99c0473._.js.map