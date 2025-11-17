(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Bmad-Method/apps/web/app/owners/OwnerAccessContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OwnerAccessProvider",
    ()=>OwnerAccessProvider,
    "useOwnerAccess",
    ()=>useOwnerAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const STORAGE_KEY = 'bmad-owner-token';
const DEFAULT_OWNER_ID = Number(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_OWNER_ID ?? '1');
const EXPECTED_TOKEN = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_OWNER_TOKEN ?? 'demo-owner-token';
const OwnerAccessContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function OwnerAccessProvider({ children }) {
    _s();
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('checking');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OwnerAccessProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                setToken(stored);
                setStatus('authenticated');
            } else {
                setStatus('unauthenticated');
            }
        }
    }["OwnerAccessProvider.useEffect"], []);
    const authenticate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OwnerAccessProvider.useCallback[authenticate]": (code)=>{
            if (code.trim() === EXPECTED_TOKEN) {
                if ("TURBOPACK compile-time truthy", 1) {
                    window.sessionStorage.setItem(STORAGE_KEY, code.trim());
                }
                setToken(code.trim());
                setStatus('authenticated');
                return true;
            }
            setStatus('unauthenticated');
            return false;
        }
    }["OwnerAccessProvider.useCallback[authenticate]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OwnerAccessProvider.useCallback[logout]": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                window.sessionStorage.removeItem(STORAGE_KEY);
            }
            setToken(null);
            setStatus('unauthenticated');
        }
    }["OwnerAccessProvider.useCallback[logout]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OwnerAccessProvider.useMemo[value]": ()=>({
                ownerId: DEFAULT_OWNER_ID,
                token,
                status,
                authenticate,
                logout
            })
    }["OwnerAccessProvider.useMemo[value]"], [
        token,
        status,
        authenticate,
        logout
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OwnerAccessContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/OwnerAccessContext.tsx",
        lineNumber: 71,
        columnNumber: 10
    }, this);
}
_s(OwnerAccessProvider, "VaR2fQgpRgWU+tKYd8Y7bryiVQY=");
_c = OwnerAccessProvider;
function useOwnerAccess() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(OwnerAccessContext);
    if (!context) {
        throw new Error('useOwnerAccess must be used within OwnerAccessProvider');
    }
    return context;
}
_s1(useOwnerAccess, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "OwnerAccessProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OwnersLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$app$2f$owners$2f$OwnerAccessContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/app/owners/OwnerAccessContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const NAV_ITEMS = [
    {
        href: '/owners',
        label: 'Overview'
    },
    {
        href: '/owners/propriedades',
        label: 'Propriedades'
    },
    {
        href: '/owners/faturas',
        label: 'Faturas'
    },
    {
        href: '/owners/relatorios',
        label: 'Relatórios'
    }
];
function OwnersLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$app$2f$owners$2f$OwnerAccessContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OwnerAccessProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OwnersGuard, {
            children: children
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = OwnersLayout;
function OwnersGuard({ children }) {
    _s();
    const { status, authenticate, logout, ownerId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$app$2f$owners$2f$OwnerAccessContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOwnerAccess"])();
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    if (status === 'checking') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "owners-gate",
            role: "status",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Validando sessão segura do proprietário…"
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this);
    }
    const handleSubmit = (event)=>{
        event.preventDefault();
        const success = authenticate(code);
        if (!success) {
            setError('Código inválido. Confirme as credenciais enviadas pelo gestor de operações.');
        } else {
            setError(null);
        }
    };
    if (status !== 'authenticated') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "owners-gate",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "owners-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "Portal do Proprietário"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Introduza o código de acesso fornecido pela equipa Bmad Method."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "owners-form",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "owner-code",
                                children: "Código de acesso"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "owner-code",
                                name: "owner-code",
                                type: "password",
                                autoComplete: "one-time-code",
                                value: code,
                                onChange: (event)=>setCode(event.target.value),
                                "data-testid": "owner-access-code"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "owners-error",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                                lineNumber: 63,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                children: "Entrar"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OwnersShell, {
        ownerId: ownerId,
        logout: logout,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
        lineNumber: 71,
        columnNumber: 10
    }, this);
}
_s(OwnersGuard, "SislmR2gVEdlOU5NJguE4V11mGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$app$2f$owners$2f$OwnerAccessContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOwnerAccess"]
    ];
});
_c1 = OwnersGuard;
function OwnersShell({ children, ownerId, logout }) {
    _s1();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const navItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OwnersShell.useMemo[navItems]": ()=>NAV_ITEMS.map({
                "OwnersShell.useMemo[navItems]": (item)=>({
                        ...item,
                        active: pathname === item.href || pathname.startsWith(`${item.href}/`)
                    })
            }["OwnersShell.useMemo[navItems]"])
    }["OwnersShell.useMemo[navItems]"], [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-756dabd6d8f6be9f" + " " + "owners-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-756dabd6d8f6be9f" + " " + "owners-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-756dabd6d8f6be9f",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-756dabd6d8f6be9f" + " " + "owners-subtitle",
                                children: [
                                    "Área reservada · Proprietário #",
                                    ownerId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-756dabd6d8f6be9f",
                                children: "Painel de resultados e documentação"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-756dabd6d8f6be9f",
                                children: "Acompanhe receita consolidada, métricas operacionais e atualize informações críticas com proteção reforçada."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: logout,
                        className: "jsx-756dabd6d8f6be9f" + " " + "owners-logout",
                        children: "Terminar sessão"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Secções do portal",
                className: "jsx-756dabd6d8f6be9f" + " " + "owners-nav",
                children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        "aria-current": item.active ? 'page' : undefined,
                        children: item.label
                    }, item.href, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                "data-testid": "owner-content",
                className: "jsx-756dabd6d8f6be9f" + " " + "owners-content",
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "756dabd6d8f6be9f",
                children: ".owners-gate.jsx-756dabd6d8f6be9f{min-height:70vh;padding:var(--space-6);place-items:center;display:grid}.owners-card.jsx-756dabd6d8f6be9f{background:var(--color-neutral-0);border-radius:var(--radius-lg);padding:var(--space-6);gap:var(--space-4);max-width:420px;box-shadow:var(--shadow-card);display:grid}.owners-form.jsx-756dabd6d8f6be9f{gap:var(--space-3);display:grid}input.jsx-756dabd6d8f6be9f{border-radius:var(--radius-sm);padding:var(--space-3)var(--space-4);border:1px solid #2563eb33;font-size:1rem}button.jsx-756dabd6d8f6be9f{border-radius:var(--radius-sm);padding:var(--space-3)var(--space-4);background:var(--color-deep-blue);color:#fff;cursor:pointer;border:none;font-weight:600}.owners-error.jsx-756dabd6d8f6be9f{color:var(--color-coral);margin:0}.owners-shell.jsx-756dabd6d8f6be9f{gap:var(--space-5);display:grid}.owners-header.jsx-756dabd6d8f6be9f{justify-content:space-between;align-items:flex-start;gap:var(--space-5);color:#fff;padding:var(--space-5);border-radius:var(--radius-lg);box-shadow:var(--shadow-card);background:linear-gradient(135deg,#2563ebf2,#0ea5e9d9);display:flex}.owners-subtitle.jsx-756dabd6d8f6be9f{margin:0 0 var(--space-2)0;letter-spacing:.08em;text-transform:uppercase;font-weight:600}.owners-logout.jsx-756dabd6d8f6be9f{background:var(--tint-neutral-soft);align-self:flex-start}.owners-nav.jsx-756dabd6d8f6be9f{gap:var(--space-3);background:var(--color-neutral-0);padding:var(--space-3)var(--space-4);border-radius:var(--radius-md);box-shadow:var(--shadow-card);flex-wrap:wrap;display:flex}.owners-nav.jsx-756dabd6d8f6be9f a.jsx-756dabd6d8f6be9f{padding:var(--space-2)var(--space-4);border-radius:var(--radius-sm);color:var(--color-deep-blue);background:var(--tint-primary-soft);font-weight:500}.owners-nav.jsx-756dabd6d8f6be9f a[aria-current=page].jsx-756dabd6d8f6be9f{background:var(--color-deep-blue);color:#fff}.owners-content.jsx-756dabd6d8f6be9f{gap:var(--space-5);display:grid}@media (width<=960px){.owners-header.jsx-756dabd6d8f6be9f{flex-direction:column;align-items:flex-start}.owners-nav.jsx-756dabd6d8f6be9f{flex-direction:column}}@media (width<=640px){.owners-card.jsx-756dabd6d8f6be9f{padding:var(--space-5)}.owners-header.jsx-756dabd6d8f6be9f{padding:var(--space-4)}.owners-nav.jsx-756dabd6d8f6be9f{padding:var(--space-3)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/owners/layout.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s1(OwnersShell, "V6ks+HRzgS/8ydsYYCAzzbk+Cf0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c2 = OwnersShell;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "OwnersLayout");
__turbopack_context__.k.register(_c1, "OwnersGuard");
__turbopack_context__.k.register(_c2, "OwnersShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Bmad-Method_apps_web_app_owners_ea388673._.js.map