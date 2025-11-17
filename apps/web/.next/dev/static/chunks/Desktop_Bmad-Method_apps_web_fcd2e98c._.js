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
"[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SectionHeader",
    ()=>SectionHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
function SectionHeader({ children, subtitle, actions }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "jsx-cacc4c14b55483ca" + " " + "section-header",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-cacc4c14b55483ca",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "jsx-cacc4c14b55483ca",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-cacc4c14b55483ca",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx",
                        lineNumber: 15,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-cacc4c14b55483ca" + " " + "section-actions",
                children: actions
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx",
                lineNumber: 17,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "cacc4c14b55483ca",
                children: ".section-header.jsx-cacc4c14b55483ca{gap:var(--space-3);flex-wrap:wrap;justify-content:space-between;align-items:flex-end;display:flex}h2.jsx-cacc4c14b55483ca{color:var(--color-neutral-3);letter-spacing:-.01em;margin:0;font-size:1.5rem}p.jsx-cacc4c14b55483ca{margin:var(--space-2)0 0;color:var(--color-neutral-2);line-height:1.5}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = SectionHeader;
var _c;
__turbopack_context__.k.register(_c, "SectionHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/ui/StatusBadge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
const variantStyles = {
    success: {
        background: 'rgba(16, 185, 129, 0.14)',
        color: '#047857',
        icon: '●',
        border: 'rgba(16, 185, 129, 0.28)'
    },
    warning: {
        background: 'rgba(245, 158, 11, 0.16)',
        color: '#92400e',
        icon: '●',
        border: 'rgba(245, 158, 11, 0.32)'
    },
    critical: {
        background: 'rgba(239, 68, 68, 0.16)',
        color: '#b91c1c',
        icon: '●',
        border: 'rgba(239, 68, 68, 0.32)'
    },
    info: {
        background: 'rgba(37, 99, 235, 0.16)',
        color: '#1d4ed8',
        icon: '●',
        border: 'rgba(37, 99, 235, 0.32)'
    },
    neutral: {
        background: 'rgba(100, 116, 139, 0.14)',
        color: '#475569',
        icon: '●',
        border: 'rgba(100, 116, 139, 0.24)'
    }
};
function StatusBadge({ children, variant = 'neutral', tooltip }) {
    const { background, color, icon, border } = variantStyles[variant];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-variant": variant,
        title: tooltip ?? undefined,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
            [
                "cece7fff37992c53",
                [
                    background,
                    color,
                    border
                ]
            ]
        ]) + " " + "status-badge",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                    [
                        "cece7fff37992c53",
                        [
                            background,
                            color,
                            border
                        ]
                    ]
                ]) + " " + "status-badge__icon",
                children: icon
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/StatusBadge.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                    [
                        "cece7fff37992c53",
                        [
                            background,
                            color,
                            border
                        ]
                    ]
                ]) + " " + "status-badge__text",
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/StatusBadge.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "cece7fff37992c53",
                dynamic: [
                    background,
                    color,
                    border
                ],
                children: `.status-badge.__jsx-style-dynamic-selector{justify-content:flex-start;align-items:center;gap:var(--space-2);padding:0 var(--space-3);border-radius:var(--radius-xs);background:${background};min-height:28px;color:${color};border:1px solid ${border};font-size:.8125rem;font-weight:600;display:inline-flex}.status-badge__icon.__jsx-style-dynamic-selector{font-size:.625rem;line-height:1}.status-badge__text.__jsx-style-dynamic-selector{line-height:1.2}`
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/ui/StatusBadge.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = StatusBadge;
var _c;
__turbopack_context__.k.register(_c, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/layout/ResponsiveGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResponsiveGrid",
    ()=>ResponsiveGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
function ResponsiveGrid({ children, columns = 3 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
            [
                "83fd8f11bcddf027",
                [
                    columns
                ]
            ]
        ]) + " " + "responsive-grid",
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "83fd8f11bcddf027",
                dynamic: [
                    columns
                ],
                children: `.responsive-grid.__jsx-style-dynamic-selector{gap:var(--space-4);grid-template-columns:repeat(${columns},minmax(0,1fr));display:grid}@media (width<=1200px){.responsive-grid.__jsx-style-dynamic-selector{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (width<=768px){.responsive-grid.__jsx-style-dynamic-selector{grid-template-columns:minmax(0,1fr)}}`
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/ResponsiveGrid.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = ResponsiveGrid;
var _c;
__turbopack_context__.k.register(_c, "ResponsiveGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlaOverview",
    ()=>SlaOverview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/layout/ResponsiveGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/StatusBadge.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const STATUS_VARIANT = {
    on_track: 'success',
    at_risk: 'warning',
    breached: 'critical'
};
const STATUS_LABEL = {
    on_track: 'No prazo',
    at_risk: 'Em risco',
    breached: 'Violado'
};
const STATUS_MESSAGES = {
    on_track: 'Dentro dos parâmetros acordados.',
    at_risk: 'Acima da meta. Monitorizar e alinhar com o parceiro.',
    breached: 'Violação registada. Acionar plano de contingência.'
};
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short'
});
function resolveAudioContext() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const typedWindow = window;
    return typedWindow.AudioContext ?? typedWindow.webkitAudioContext ?? null;
}
function SlaOverview({ slas, context = 'home' }) {
    _s();
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const breachedIdsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SlaOverview.useEffect": ()=>{
            const breachedIds = new Set(slas.filter({
                "SlaOverview.useEffect": (sla)=>sla.status === 'breached'
            }["SlaOverview.useEffect"]).map({
                "SlaOverview.useEffect": (sla)=>sla.id
            }["SlaOverview.useEffect"]));
            const hasNewBreach = [
                ...breachedIds
            ].some({
                "SlaOverview.useEffect.hasNewBreach": (id)=>!breachedIdsRef.current.has(id)
            }["SlaOverview.useEffect.hasNewBreach"]);
            breachedIdsRef.current = breachedIds;
            if (!hasNewBreach || breachedIds.size === 0) {
                return;
            }
            const AudioCtor = resolveAudioContext();
            if (!AudioCtor) {
                return;
            }
            if (!audioContextRef.current) {
                try {
                    audioContextRef.current = new AudioCtor();
                } catch (error) {
                    return;
                }
            }
            const contextInstance = audioContextRef.current;
            if (!contextInstance) {
                return;
            }
            if (contextInstance.state === 'suspended') {
                void contextInstance.resume().catch({
                    "SlaOverview.useEffect": ()=>undefined
                }["SlaOverview.useEffect"]);
            }
            const oscillator = contextInstance.createOscillator();
            const gain = contextInstance.createGain();
            oscillator.type = 'triangle';
            oscillator.frequency.value = 880;
            gain.gain.value = 0.08;
            oscillator.connect(gain);
            gain.connect(contextInstance.destination);
            oscillator.start();
            oscillator.stop(contextInstance.currentTime + 0.35);
        }
    }["SlaOverview.useEffect"], [
        slas
    ]);
    const alertMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SlaOverview.useMemo[alertMessage]": ()=>{
            const breached = slas.filter({
                "SlaOverview.useMemo[alertMessage].breached": (sla)=>sla.status === 'breached'
            }["SlaOverview.useMemo[alertMessage].breached"]);
            if (!breached.length) {
                return null;
            }
            const partners = breached.map({
                "SlaOverview.useMemo[alertMessage].partners": (item)=>item.partner.name
            }["SlaOverview.useMemo[alertMessage].partners"]).join(', ');
            if (context === 'housekeeping') {
                return `Atenção: ${partners} com violações de SLA a impactar housekeeping.`;
            }
            return `Alertas ativos para ${partners}.`; // default for home
        }
    }["SlaOverview.useMemo[alertMessage]"], [
        context,
        slas
    ]);
    if (slas.length === 0) {
        return null;
    }
    const columns = Math.min(3, Math.max(1, slas.length));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-live": "polite",
        className: "jsx-eb567a702210e6b6" + " " + "sla-overview",
        children: [
            alertMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "alert",
                className: "jsx-eb567a702210e6b6" + " " + "sla-overview__alert",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                        variant: "critical",
                        children: "Violação de SLA"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-eb567a702210e6b6",
                        children: alertMessage
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveGrid"], {
                columns: columns,
                children: slas.map((sla)=>{
                    const lastViolation = sla.lastViolationAt ? DATE_TIME_FORMATTER.format(new Date(sla.lastViolationAt)) : 'Sem registo';
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: `${sla.partner.name} · ${sla.metricLabel}`,
                        description: `Meta ${sla.targetMinutes} min · Revisado ${DATE_TIME_FORMATTER.format(new Date(sla.updatedAt))}`,
                        accent: STATUS_VARIANT[sla.status],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-eb567a702210e6b6" + " " + "sla-overview__status",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                        variant: STATUS_VARIANT[sla.status],
                                        children: STATUS_LABEL[sla.status]
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-eb567a702210e6b6",
                                        children: STATUS_MESSAGES[sla.status]
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                className: "jsx-eb567a702210e6b6" + " " + "sla-overview__metrics",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-eb567a702210e6b6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: "Atual"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 145,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: formatMinutes(sla.currentMinutes)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 146,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                        lineNumber: 144,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-eb567a702210e6b6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: "Limite alerta"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 149,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: formatMinutes(sla.warningMinutes)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 150,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-eb567a702210e6b6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: "Violação"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 153,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: formatMinutes(sla.breachMinutes)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 154,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                        lineNumber: 152,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-eb567a702210e6b6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: "Última violação"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 157,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "jsx-eb567a702210e6b6",
                                                children: lastViolation
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                                lineNumber: 158,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                        lineNumber: 156,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `${sla.partner.slug}-${sla.metric}`, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                        lineNumber: 133,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "eb567a702210e6b6",
                children: ".sla-overview.jsx-eb567a702210e6b6{gap:var(--space-4);display:grid}.sla-overview__alert.jsx-eb567a702210e6b6{align-items:center;gap:var(--space-3);padding:var(--space-3)var(--space-4);border-radius:var(--radius-sm);color:var(--color-coral);background:#ef63511f;font-weight:600;display:inline-flex}.sla-overview__status.jsx-eb567a702210e6b6{gap:var(--space-2);color:var(--color-neutral-2);flex-direction:column;font-weight:500;display:flex}.sla-overview__metrics.jsx-eb567a702210e6b6{gap:var(--space-3);grid-template-columns:repeat(2,minmax(0,1fr));margin:0;display:grid}.sla-overview__metrics.jsx-eb567a702210e6b6 div.jsx-eb567a702210e6b6{gap:var(--space-1);display:grid}.sla-overview__metrics.jsx-eb567a702210e6b6 dt.jsx-eb567a702210e6b6{text-transform:uppercase;letter-spacing:.05em;color:var(--color-neutral-2);margin:0;font-size:.75rem}.sla-overview__metrics.jsx-eb567a702210e6b6 dd.jsx-eb567a702210e6b6{color:var(--color-deep-blue);margin:0;font-size:1rem;font-weight:600}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
_s(SlaOverview, "yckGiIXwiuesOA3lJhMxH9jze4k=");
_c = SlaOverview;
function formatMinutes(value) {
    if (value === null || value === undefined) {
        return 'Sem dados';
    }
    return `${value} min`;
}
var _c;
__turbopack_context__.k.register(_c, "SlaOverview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TourLauncher",
    ()=>TourLauncher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function TourLauncher() {
    _s();
    const { tours, startTour, hasCompleted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGuidedTour"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])() ?? '';
    const [selectedTourId, setSelectedTourId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const availableTours = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TourLauncher.useMemo[availableTours]": ()=>{
            return tours.filter({
                "TourLauncher.useMemo[availableTours]": (tour)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tourMatchesPath"])(tour.route, pathname)
            }["TourLauncher.useMemo[availableTours]"]);
        }
    }["TourLauncher.useMemo[availableTours]"], [
        pathname,
        tours
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TourLauncher.useEffect": ()=>{
            if (availableTours.length === 0) {
                setSelectedTourId('');
                return;
            }
            if (!selectedTourId || !availableTours.some({
                "TourLauncher.useEffect": (tour)=>tour.id === selectedTourId
            }["TourLauncher.useEffect"])) {
                setSelectedTourId(availableTours[0]?.id ?? '');
            }
        }
    }["TourLauncher.useEffect"], [
        availableTours,
        selectedTourId
    ]);
    if (availableTours.length === 0 || !selectedTourId) {
        return null;
    }
    const activeTour = availableTours.find((tour)=>tour.id === selectedTourId) ?? availableTours[0];
    const completed = hasCompleted(activeTour.id);
    const statusMessage = completed ? 'Concluído — pode rever os passos principais' : 'Duração média ~3 minutos';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-completed": completed ? 'true' : 'false',
        className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-1b8d96e8fc2f8777",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher__eyebrow",
                                children: "Tour guiado"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "jsx-1b8d96e8fc2f8777",
                                children: activeTour.title
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            activeTour.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher__description",
                                children: activeTour.description
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-completed": completed ? 'true' : 'false',
                                className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher__status",
                                children: statusMessage
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher__actions",
                        children: [
                            availableTours.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher__select",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-1b8d96e8fc2f8777" + " " + "sr-only",
                                        children: "Selecionar tour disponível"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: activeTour.id,
                                        onChange: (event)=>setSelectedTourId(event.target.value),
                                        "aria-label": "Selecionar tour da página",
                                        className: "jsx-1b8d96e8fc2f8777",
                                        children: availableTours.map((tour)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: tour.id,
                                                className: "jsx-1b8d96e8fc2f8777",
                                                children: [
                                                    tour.title,
                                                    hasCompleted(tour.id) ? ' · concluído' : ''
                                                ]
                                            }, tour.id, true, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                                lineNumber: 58,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>startTour(activeTour.id),
                                "aria-label": completed ? 'Rever tour guiado da página' : 'Iniciar tour guiado da página',
                                className: "jsx-1b8d96e8fc2f8777" + " " + "tour-launcher__cta",
                                children: completed ? 'Rever tour' : 'Iniciar tour'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "1b8d96e8fc2f8777",
                children: '.tour-launcher.jsx-1b8d96e8fc2f8777{padding:var(--space-4)var(--space-5);border-radius:var(--radius-md);background:var(--color-neutral-0);box-shadow:var(--shadow-card);border:1px solid #94a3b847;max-width:420px;display:grid;position:relative}.tour-launcher.jsx-1b8d96e8fc2f8777:before{content:"";top:var(--space-4);bottom:var(--space-4);border-radius:var(--radius-xs);background:var(--color-deep-blue);width:4px;position:absolute;left:0}.tour-launcher[data-completed=true].jsx-1b8d96e8fc2f8777:before{background:var(--color-soft-aqua)}.tour-launcher__body.jsx-1b8d96e8fc2f8777{justify-content:space-between;align-items:center;gap:var(--space-4);flex-wrap:wrap;display:flex}.tour-launcher__eyebrow.jsx-1b8d96e8fc2f8777{text-transform:uppercase;letter-spacing:.08em;color:var(--color-neutral-2);margin:0;font-size:.75rem}strong.jsx-1b8d96e8fc2f8777{color:var(--color-neutral-3);font-size:1.1rem;display:block}.tour-launcher__description.jsx-1b8d96e8fc2f8777{color:var(--color-neutral-2);margin-top:.35rem;font-size:.9rem;display:block}.tour-launcher__status.jsx-1b8d96e8fc2f8777{align-items:center;gap:var(--space-1);margin-top:var(--space-2);text-transform:uppercase;letter-spacing:.06em;color:var(--color-neutral-2);font-size:.75rem;font-weight:600;display:inline-flex}.tour-launcher__status[data-completed=true].jsx-1b8d96e8fc2f8777{color:var(--color-soft-aqua)}.tour-launcher__actions.jsx-1b8d96e8fc2f8777{align-items:center;gap:var(--space-3);display:inline-flex}.tour-launcher__select.jsx-1b8d96e8fc2f8777{border-radius:var(--radius-sm);padding:0 var(--space-2);background:#2563eb1a;align-items:center;display:inline-flex}.tour-launcher__select.jsx-1b8d96e8fc2f8777 select.jsx-1b8d96e8fc2f8777{color:var(--color-deep-blue);padding:var(--space-1)var(--space-2);cursor:pointer;background:0 0;border:none;font-weight:600}.tour-launcher__select.jsx-1b8d96e8fc2f8777 select.jsx-1b8d96e8fc2f8777:focus-visible{outline:2px solid var(--color-soft-aqua);outline-offset:2px}.tour-launcher__cta.jsx-1b8d96e8fc2f8777{border-radius:var(--radius-sm);background:var(--color-deep-blue);color:#fff;padding:var(--space-2)var(--space-4);cursor:pointer;border:1px solid #0000;font-weight:600;transition:background .2s,border .2s,color .2s,box-shadow .2s;box-shadow:0 12px 25px #2563eb33}.tour-launcher__cta.jsx-1b8d96e8fc2f8777:hover,.tour-launcher__cta.jsx-1b8d96e8fc2f8777:focus-visible{background:#1d4ed8}.tour-launcher[data-completed=true].jsx-1b8d96e8fc2f8777 .tour-launcher__cta.jsx-1b8d96e8fc2f8777{color:var(--color-deep-blue);box-shadow:none;background:#0ea5e929;border-color:#0ea5e952}.tour-launcher[data-completed=true].jsx-1b8d96e8fc2f8777 .tour-launcher__cta.jsx-1b8d96e8fc2f8777:hover,.tour-launcher[data-completed=true].jsx-1b8d96e8fc2f8777 .tour-launcher__cta.jsx-1b8d96e8fc2f8777:focus-visible{background:#0ea5e942}@media (width<=768px){.tour-launcher.jsx-1b8d96e8fc2f8777{max-width:100%}.tour-launcher__body.jsx-1b8d96e8fc2f8777{flex-direction:column;align-items:stretch}.tour-launcher__actions.jsx-1b8d96e8fc2f8777{justify-content:space-between}.tour-launcher__cta.jsx-1b8d96e8fc2f8777{text-align:center;width:100%}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(TourLauncher, "5IpLVAg0cKV+uAAz19G+eIMRcAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGuidedTour"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = TourLauncher;
var _c;
__turbopack_context__.k.register(_c, "TourLauncher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/__mocks__/partners.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "partnerSlasFixture",
    ()=>partnerSlasFixture
]);
const partnerSlasFixture = [
    {
        id: 1,
        metric: 'pickup_time',
        metricLabel: 'Recolha de lavandaria',
        targetMinutes: 120,
        warningMinutes: 150,
        breachMinutes: 180,
        currentMinutes: 164,
        status: 'at_risk',
        lastViolationAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        updatedAt: new Date().toISOString(),
        partner: {
            id: 31,
            name: 'Lavandaria Atlântica',
            slug: 'lavandaria-atlantica',
            category: 'logistica'
        }
    },
    {
        id: 2,
        metric: 'maintenance_response',
        metricLabel: 'Resposta de manutenção',
        targetMinutes: 90,
        warningMinutes: 110,
        breachMinutes: 140,
        currentMinutes: 86,
        status: 'on_track',
        lastViolationAt: null,
        updatedAt: new Date().toISOString(),
        partner: {
            id: 17,
            name: 'Manutenção Express',
            slug: 'manutencao-express',
            category: 'servicos'
        }
    },
    {
        id: 3,
        metric: 'inventory_restock',
        metricLabel: 'Reposição de amenities',
        targetMinutes: 60,
        warningMinutes: 75,
        breachMinutes: 90,
        currentMinutes: 104,
        status: 'breached',
        lastViolationAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        updatedAt: new Date().toISOString(),
        partner: {
            id: 48,
            name: 'SupplyOne',
            slug: 'supplyone',
            category: 'fornecedor'
        }
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/partners.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPartnerSlas",
    ()=>getPartnerSlas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$_$5f$mocks_$5f2f$partners$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/__mocks__/partners.ts [app-client] (ecmascript)");
;
;
const CORE_API_BASE_URL_ENV = ("TURBOPACK compile-time value", "http://localhost:8000");
const CORE_API_CONFIGURED = Boolean(CORE_API_BASE_URL_ENV?.trim());
const CORE_API_BASE_URL = CORE_API_BASE_URL_ENV && CORE_API_BASE_URL_ENV.trim().length > 0 ? CORE_API_BASE_URL_ENV : 'http://localhost:8000';
function mapPartnerSummary(dto) {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        category: dto.category
    };
}
function mapPartnerSla(dto) {
    return {
        id: dto.id,
        metric: dto.metric,
        metricLabel: dto.metric_label,
        targetMinutes: dto.target_minutes,
        warningMinutes: dto.warning_minutes,
        breachMinutes: dto.breach_minutes,
        currentMinutes: dto.current_minutes,
        status: dto.status,
        lastViolationAt: dto.last_violation_at,
        updatedAt: dto.updated_at,
        partner: mapPartnerSummary(dto.partner)
    };
}
async function getPartnerSlas(options = {}) {
    if (!CORE_API_CONFIGURED) {
        return {
            status: 'degraded',
            data: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$_$5f$mocks_$5f2f$partners$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["partnerSlasFixture"],
            message: 'Sem URL configurada para o Core API. A mostrar SLAs de referência até restabelecer a ligação.'
        };
    }
    const url = new URL('/partners/slas', CORE_API_BASE_URL);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            },
            signal: options.signal,
            cache: 'no-store'
        });
        if (!response.ok) {
            const body = await safeReadJson(response);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to load partner SLAs', response.status, body);
        }
        const payload = await response.json();
        return {
            status: 'live',
            data: payload.map(mapPartnerSla)
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
            throw error;
        }
        return {
            status: 'degraded',
            data: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$_$5f$mocks_$5f2f$partners$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["partnerSlasFixture"],
            message: 'Não foi possível contactar o Core API. A mostrar SLAs de exemplo até à reconexão.'
        };
    }
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
"[project]/Desktop/Bmad-Method/apps/web/services/api/__mocks__/dashboard.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dashboardMetricsFixture",
    ()=>dashboardMetricsFixture
]);
const dashboardMetricsFixture = {
    occupancy: {
        date: new Date().toISOString().slice(0, 10),
        occupiedUnits: 128,
        totalUnits: 160,
        occupancyRate: 0.8
    },
    nps: {
        score: 62,
        totalResponses: 184,
        trend7d: 4.2
    },
    sla: {
        total: 48,
        onTrack: 33,
        atRisk: 9,
        breached: 6,
        worstOffenders: [
            'Lavandaria Atlântica',
            'Manutenção Express'
        ]
    },
    operational: {
        criticalAlerts: {
            total: 7,
            blocked: 2,
            overdue: 3,
            examples: [
                {
                    taskId: 9034,
                    propertyId: 18,
                    status: 'blocked',
                    scheduledDate: new Date(Date.now() - 1000 * 60 * 45).toISOString()
                },
                {
                    taskId: 9012,
                    propertyId: 24,
                    status: 'pending',
                    scheduledDate: new Date(Date.now() - 1000 * 60 * 90).toISOString()
                },
                {
                    taskId: 8999,
                    propertyId: 7,
                    status: 'in_progress',
                    scheduledDate: new Date(Date.now() - 1000 * 60 * 120).toISOString()
                }
            ]
        },
        playbookAdoption: {
            periodStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
            periodEnd: new Date().toISOString(),
            totalExecutions: 92,
            completed: 81,
            adoptionRate: 0.64,
            activeProperties: 28
        },
        housekeepingCompletionRate: {
            name: 'Execução de Housekeeping',
            value: 87,
            unit: '%',
            status: 'Última atualização sincronizada via rede móvel'
        },
        otaSyncBacklog: {
            name: 'Pendências OTA',
            value: 14,
            unit: 'reservas',
            status: 'Integração expediu lote às 06h32'
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/dashboard.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDashboardMetrics",
    ()=>getDashboardMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$_$5f$mocks_$5f2f$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/__mocks__/dashboard.ts [app-client] (ecmascript)");
;
;
const CORE_API_BASE_URL_ENV = ("TURBOPACK compile-time value", "http://localhost:8000");
const CORE_API_CONFIGURED = Boolean(CORE_API_BASE_URL_ENV?.trim());
const CORE_API_BASE_URL = CORE_API_BASE_URL_ENV && CORE_API_BASE_URL_ENV.trim().length > 0 ? CORE_API_BASE_URL_ENV : 'http://localhost:8000';
function mapOccupancy(dto) {
    return {
        date: dto.date,
        occupiedUnits: dto.occupied_units,
        totalUnits: dto.total_units,
        occupancyRate: dto.occupancy_rate
    };
}
function mapCriticalAlerts(dto) {
    return {
        total: dto.total,
        blocked: dto.blocked,
        overdue: dto.overdue,
        examples: dto.examples.map((example)=>({
                taskId: example.task_id,
                propertyId: example.property_id,
                status: example.status,
                scheduledDate: example.scheduled_date
            }))
    };
}
function mapPlaybookAdoption(dto) {
    return {
        periodStart: dto.period_start,
        periodEnd: dto.period_end,
        totalExecutions: dto.total_executions,
        completed: dto.completed,
        adoptionRate: dto.adoption_rate,
        activeProperties: dto.active_properties
    };
}
function mapNps(dto) {
    return {
        score: dto.score,
        totalResponses: dto.total_responses,
        trend7d: dto.trend_7d
    };
}
function mapSla(dto) {
    return {
        total: dto.total,
        onTrack: dto.on_track,
        atRisk: dto.at_risk,
        breached: dto.breached,
        worstOffenders: dto.worst_offenders
    };
}
function mapOperational(dto) {
    return {
        criticalAlerts: mapCriticalAlerts(dto.critical_alerts),
        playbookAdoption: mapPlaybookAdoption(dto.playbook_adoption),
        housekeepingCompletionRate: {
            name: dto.housekeeping_completion_rate.name,
            value: dto.housekeeping_completion_rate.value,
            unit: dto.housekeeping_completion_rate.unit,
            status: dto.housekeeping_completion_rate.status
        },
        otaSyncBacklog: {
            name: dto.ota_sync_backlog.name,
            value: dto.ota_sync_backlog.value,
            unit: dto.ota_sync_backlog.unit,
            status: dto.ota_sync_backlog.status
        }
    };
}
async function getDashboardMetrics(options = {}) {
    if (!CORE_API_CONFIGURED) {
        return {
            status: 'degraded',
            data: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$_$5f$mocks_$5f2f$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dashboardMetricsFixture"],
            message: 'Sem URL configurada para o Core API. A mostrar métricas de referência até que a ligação seja reativada.'
        };
    }
    const url = new URL('/metrics/overview', CORE_API_BASE_URL);
    if (options.targetDate) {
        url.searchParams.set('target_date', options.targetDate);
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            },
            signal: options.signal,
            cache: 'no-store'
        });
        if (!response.ok) {
            const body = await safeReadJson(response);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to load dashboard metrics', response.status, body);
        }
        const payload = await response.json();
        return {
            status: 'live',
            data: {
                occupancy: mapOccupancy(payload.occupancy),
                nps: mapNps(payload.nps),
                sla: mapSla(payload.sla),
                operational: mapOperational(payload.operational)
            }
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
            throw error;
        }
        return {
            status: 'degraded',
            data: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$_$5f$mocks_$5f2f$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dashboardMetricsFixture"],
            message: 'Não foi possível contactar o Core API. A mostrar métricas de exemplo enquanto a ligação é restabelecida.'
        };
    }
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
"[project]/Desktop/Bmad-Method/apps/web/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/api/build/esm/metrics-api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/api/build/esm/trace-api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/StatusBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$slas$2f$SlaOverview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourLauncher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourLauncher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$partners$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/partners.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/dashboard.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
const numberFormatter = new Intl.NumberFormat('pt-PT');
const percentFormatter = new Intl.NumberFormat('pt-PT', {
    style: 'percent',
    maximumFractionDigits: 0
});
const trendFormatter = new Intl.NumberFormat('pt-PT', {
    signDisplay: 'always',
    maximumFractionDigits: 1
});
const decimalFormatter = new Intl.NumberFormat('pt-PT', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
});
const ALERT_DATE_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
});
const meter = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["metrics"].getMeter('bmad.web.dashboard');
const fetchCounter = meter.createCounter('bmad_web_dashboard_metrics_fetch_total', {
    description: 'Total de atualizações dos cards principais do dashboard'
});
const occupancyHistogram = meter.createHistogram('bmad_web_dashboard_occupancy_rate', {
    description: 'Distribuição da taxa de ocupação exibida para os gestores'
});
const alertsHistogram = meter.createHistogram('bmad_web_dashboard_alerts_total', {
    description: 'Distribuição do número de alertas críticos apresentados'
});
const adoptionHistogram = meter.createHistogram('bmad_web_dashboard_playbook_adoption_rate', {
    description: 'Distribuição da taxa de adoção de playbooks no dashboard'
});
const tracer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trace"].getTracer('bmad.web.dashboard');
const priorities = [
    {
        title: 'Checklist Housekeeping Sprint 1',
        description: 'Sincronizar revisão de quartos VIP e validar inventário de amenities.',
        status: 'Em progresso',
        statusVariant: 'warning'
    },
    {
        title: 'Revisão SLAs de parceiros',
        description: 'Confirmar janelas de recolha com lavanderia e manutenção preventiva.',
        status: 'Atenção',
        statusVariant: 'critical'
    },
    {
        title: 'Formação tour guiado',
        description: 'Realizar sessão com equipa de operações e recolher feedback do onboarding.',
        status: 'Agendado',
        statusVariant: 'info'
    }
];
function getOccupancyVariant(rate) {
    if (rate >= 0.8) {
        return 'success';
    }
    if (rate <= 0.55) {
        return 'critical';
    }
    return 'warning';
}
function getPlaybookVariant(rate) {
    if (rate >= 0.6) {
        return 'success';
    }
    if (rate <= 0.3) {
        return 'critical';
    }
    return 'info';
}
function formatOperationalMetric(metric) {
    const unit = metric.unit?.trim() ?? '';
    if (!unit) {
        return decimalFormatter.format(metric.value);
    }
    if (unit === '%') {
        return `${decimalFormatter.format(metric.value)}%`;
    }
    return `${decimalFormatter.format(metric.value)} ${unit}`;
}
function formatHousekeepingStatus(status) {
    return status.split('_').map((segment)=>segment.charAt(0).toUpperCase() + segment.slice(1)).join(' ');
}
function buildKpiCards(state) {
    if (state.status === 'loading') {
        const message = 'Carregando métricas do core...';
        const tooltip = 'A sincronizar dados com o Core API.';
        return [
            {
                key: 'occupancy',
                label: 'Taxa de ocupação',
                state: 'loading',
                description: 'Aguarde enquanto sincronizamos as reservas.',
                variant: 'info',
                message,
                tooltip,
                testId: 'kpi-occupancy'
            },
            {
                key: 'alerts',
                label: 'Alertas críticos',
                state: 'loading',
                description: 'Monitorizando tarefas de housekeeping e SLAs.',
                variant: 'info',
                message,
                tooltip,
                testId: 'kpi-alerts'
            },
            {
                key: 'playbooks',
                label: 'Playbooks ativos',
                state: 'loading',
                description: 'Atualizando sinalizações de execução.',
                variant: 'info',
                message,
                tooltip,
                testId: 'kpi-playbooks'
            }
        ];
    }
    if (state.status === 'error') {
        const message = state.error ?? 'Não foi possível carregar as métricas do dashboard.';
        const tooltip = 'Erro temporário ao contactar o Core API. Tente novamente ou verifique as integrações.';
        return [
            {
                key: 'occupancy',
                label: 'Taxa de ocupação',
                state: 'error',
                description: 'Contacte o time de plataforma caso o erro persista.',
                variant: 'critical',
                message,
                tooltip,
                annotation: 'Erro temporário',
                annotationVariant: 'critical',
                annotationTooltip: tooltip,
                testId: 'kpi-occupancy'
            },
            {
                key: 'alerts',
                label: 'Alertas críticos',
                state: 'error',
                description: 'Contacte o time de plataforma caso o erro persista.',
                variant: 'critical',
                message,
                tooltip,
                annotation: 'Erro temporário',
                annotationVariant: 'critical',
                annotationTooltip: tooltip,
                testId: 'kpi-alerts'
            },
            {
                key: 'playbooks',
                label: 'Playbooks ativos',
                state: 'error',
                description: 'Contacte o time de plataforma caso o erro persista.',
                variant: 'critical',
                message,
                tooltip,
                annotation: 'Erro temporário',
                annotationVariant: 'critical',
                annotationTooltip: tooltip,
                testId: 'kpi-playbooks'
            }
        ];
    }
    if (state.status === 'empty' || !state.data) {
        const tooltip = state.guidance ?? 'Configuração inicial: cadastre propriedades e conecte integrações para desbloquear insights.';
        return [
            {
                key: 'occupancy',
                label: 'Taxa de ocupação',
                state: 'empty',
                description: 'Cadastre propriedades e reservas para acompanhar a taxa.',
                variant: 'warning',
                message: 'Sem inventário cadastrado.',
                tooltip,
                annotation: 'Configuração inicial',
                annotationVariant: 'info',
                annotationTooltip: tooltip,
                testId: 'kpi-occupancy'
            },
            {
                key: 'alerts',
                label: 'Alertas críticos',
                state: 'empty',
                description: 'Processos operacionais dentro dos parâmetros definidos.',
                variant: 'success',
                message: 'Sem alertas críticos no período.',
                tooltip,
                annotation: 'Configuração inicial',
                annotationVariant: 'info',
                annotationTooltip: tooltip,
                testId: 'kpi-alerts'
            },
            {
                key: 'playbooks',
                label: 'Playbooks ativos',
                state: 'empty',
                description: 'Execute um playbook para medir a adoção da equipa.',
                variant: 'info',
                message: 'Nenhuma execução registrada nos últimos 7 dias.',
                tooltip,
                annotation: 'Configuração inicial',
                annotationVariant: 'info',
                annotationTooltip: tooltip,
                testId: 'kpi-playbooks'
            }
        ];
    }
    const data = state.data;
    const occupancyVariant = getOccupancyVariant(data.occupancy.occupancyRate);
    const alertsVariant = data.operational.criticalAlerts.total > 0 ? 'critical' : 'success';
    const playbooksVariant = getPlaybookVariant(data.operational.playbookAdoption.adoptionRate);
    const readyCards = [
        {
            key: 'occupancy',
            label: 'Taxa de ocupação',
            state: 'ready',
            value: percentFormatter.format(data.occupancy.occupancyRate),
            description: `${data.occupancy.occupiedUnits} de ${data.occupancy.totalUnits} unidades ocupadas`,
            variant: occupancyVariant,
            testId: 'kpi-occupancy'
        },
        {
            key: 'alerts',
            label: 'Alertas críticos',
            state: 'ready',
            value: numberFormatter.format(data.operational.criticalAlerts.total),
            description: `${data.operational.criticalAlerts.blocked} bloqueios · ${data.operational.criticalAlerts.overdue} atrasos`,
            variant: alertsVariant,
            testId: 'kpi-alerts'
        },
        {
            key: 'playbooks',
            label: 'Playbooks ativos',
            state: 'ready',
            value: percentFormatter.format(data.operational.playbookAdoption.adoptionRate),
            description: `${data.operational.playbookAdoption.totalExecutions} execuções registradas nos últimos 7 dias`,
            variant: playbooksVariant,
            testId: 'kpi-playbooks'
        }
    ];
    if (state.experience === 'offline') {
        const annotationTooltip = state.guidance ?? 'Sem ligação com o Core API. Dados de referência exibidos até a reconexão.';
        return readyCards.map((card)=>({
                ...card,
                annotation: 'Modo offline',
                annotationVariant: 'warning',
                annotationTooltip
            }));
    }
    return readyCards;
}
function useDashboardMetrics() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: 'loading',
        data: null,
        error: null,
        experience: null,
        guidance: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDashboardMetrics.useEffect": ()=>{
            let active = true;
            const controller = new AbortController();
            const span = tracer.startSpan('dashboard.metrics.fetch', {
                attributes: {
                    endpoint: '/metrics/overview'
                }
            });
            let spanEnded = false;
            const endSpan = {
                "useDashboardMetrics.useEffect.endSpan": (status)=>{
                    if (spanEnded) {
                        return;
                    }
                    span.setAttribute('dashboard.metrics.status', status);
                    spanEnded = true;
                    span.end();
                }
            }["useDashboardMetrics.useEffect.endSpan"];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDashboardMetrics"])({
                signal: controller.signal
            }).then({
                "useDashboardMetrics.useEffect": (result)=>{
                    if (!active) {
                        return;
                    }
                    const data = result.data;
                    const isEmpty = data.occupancy.totalUnits === 0 && data.operational.criticalAlerts.total === 0 && data.operational.playbookAdoption.totalExecutions === 0;
                    const experience = result.status === 'degraded' ? 'offline' : isEmpty ? 'initial' : 'live';
                    const status = isEmpty ? 'empty' : 'success';
                    const guidance = result.status === 'degraded' ? result.message : isEmpty ? 'Conclua a configuração inicial para começar a acompanhar as métricas.' : null;
                    setState({
                        status,
                        data,
                        error: null,
                        experience,
                        guidance
                    });
                    fetchCounter.add(1, {
                        endpoint: '/metrics/overview',
                        status: result.status === 'degraded' ? 'degraded' : 'success'
                    });
                    occupancyHistogram.record(data.occupancy.occupancyRate * 100, {
                        window: 'daily'
                    });
                    alertsHistogram.record(data.operational.criticalAlerts.total, {
                        window: 'rolling'
                    });
                    adoptionHistogram.record(data.operational.playbookAdoption.adoptionRate * 100, {
                        window: '7d'
                    });
                    endSpan(result.status === 'degraded' ? 'degraded' : 'success');
                }
            }["useDashboardMetrics.useEffect"]).catch({
                "useDashboardMetrics.useEffect": (error)=>{
                    if (!active) {
                        return;
                    }
                    if (error instanceof Error && error.name === 'AbortError') {
                        endSpan('aborted');
                        return;
                    }
                    const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"] ? error.status >= 500 ? 'Serviço de métricas indisponível. Tente novamente em instantes.' : 'Não foi possível carregar as métricas do dashboard.' : 'Ocorreu um erro inesperado ao carregar as métricas do dashboard.';
                    if (error instanceof Error) {
                        span.recordException(error);
                    }
                    fetchCounter.add(1, {
                        endpoint: '/metrics/overview',
                        status: 'error'
                    });
                    setState({
                        status: 'error',
                        data: null,
                        error: message,
                        experience: null,
                        guidance: 'Verifique as credenciais do Core API nas configurações e tente novamente.'
                    });
                    endSpan('error');
                }
            }["useDashboardMetrics.useEffect"]);
            return ({
                "useDashboardMetrics.useEffect": ()=>{
                    active = false;
                    controller.abort();
                    endSpan('aborted');
                }
            })["useDashboardMetrics.useEffect"];
        }
    }["useDashboardMetrics.useEffect"], []);
    return state;
}
_s(useDashboardMetrics, "nx+fx6SUBHQ3tJjzyCVZMzWEePo=");
function usePartnerSlas() {
    _s1();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: 'loading',
        data: [],
        message: null,
        mode: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePartnerSlas.useEffect": ()=>{
            let active = true;
            const controller = new AbortController();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$partners$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPartnerSlas"])({
                signal: controller.signal
            }).then({
                "usePartnerSlas.useEffect": (result)=>{
                    if (!active) {
                        return;
                    }
                    const items = result.data;
                    const hasData = items.length > 0;
                    if (!hasData) {
                        setState({
                            status: 'empty',
                            data: [],
                            message: result.status === 'degraded' ? result.message : 'Sem dados de SLA disponíveis.',
                            mode: 'initial'
                        });
                        return;
                    }
                    setState({
                        status: 'success',
                        data: items,
                        message: result.status === 'degraded' ? result.message : null,
                        mode: result.status === 'degraded' ? 'offline' : 'live'
                    });
                }
            }["usePartnerSlas.useEffect"]).catch({
                "usePartnerSlas.useEffect": (error)=>{
                    if (!active) {
                        return;
                    }
                    if (error instanceof Error && error.name === 'AbortError') {
                        return;
                    }
                    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
                        const message = error.status >= 500 ? 'Serviço de SLAs indisponível. Tente novamente em instantes.' : 'Não foi possível carregar os SLAs dos parceiros.';
                        setState({
                            status: 'error',
                            data: [],
                            message,
                            mode: null
                        });
                        return;
                    }
                    setState({
                        status: 'error',
                        data: [],
                        message: 'Ocorreu um erro inesperado ao carregar os SLAs.',
                        mode: null
                    });
                }
            }["usePartnerSlas.useEffect"]);
            return ({
                "usePartnerSlas.useEffect": ()=>{
                    active = false;
                    controller.abort();
                }
            })["usePartnerSlas.useEffect"];
        }
    }["usePartnerSlas.useEffect"], []);
    return state;
}
_s1(usePartnerSlas, "xG8jqJCdA0+3VaA6Muz36e8fVz0=");
function DashboardHero({ metricsState, kpis }) {
    const data = metricsState.data;
    const stats = data ? [
        {
            label: 'Unidades ativas',
            value: numberFormatter.format(data.occupancy.totalUnits),
            hint: `${numberFormatter.format(data.occupancy.occupiedUnits)} ocupadas hoje`
        },
        {
            label: 'Propriedades com playbooks',
            value: numberFormatter.format(data.operational.playbookAdoption.activeProperties),
            hint: `${numberFormatter.format(data.operational.playbookAdoption.totalExecutions)} execuções nos últimos 7 dias`
        },
        {
            label: 'Pontuação NPS',
            value: numberFormatter.format(data.nps.score),
            hint: data.nps.trend7d === null ? `${numberFormatter.format(data.nps.totalResponses)} respostas · tendência estável` : `${numberFormatter.format(data.nps.totalResponses)} respostas · ${trendFormatter.format(data.nps.trend7d)} pts vs 7 dias`
        }
    ] : [
        {
            label: 'Estado da operação',
            value: metricsState.status === 'loading' ? 'A sincronizar…' : metricsState.status === 'error' ? 'Erro temporário' : metricsState.experience === 'offline' ? 'Modo offline' : '—',
            hint: metricsState.guidance ?? (metricsState.status === 'error' ? metricsState.error ?? 'Não foi possível carregar os dados.' : 'Cadastre propriedades e execuções para desbloquear insights.')
        }
    ];
    const renderKpiContent = (kpi)=>{
        let body;
        if (kpi.state === 'ready') {
            body = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                className: "dashboard-hero__kpi-value",
                "data-testid": `${kpi.testId}-value`,
                children: kpi.value
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 566,
                columnNumber: 9
            }, this);
        } else {
            const suffix = kpi.state === 'loading' ? 'loading' : kpi.state === 'empty' ? 'empty' : 'error';
            body = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "dashboard-hero__kpi-message",
                "data-testid": `${kpi.testId}-${suffix}`,
                title: kpi.tooltip ?? undefined,
                children: kpi.message
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 573,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "dashboard-hero__kpi-inner",
            children: [
                body,
                kpi.annotation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `dashboard-hero__kpi-annotation dashboard-hero__kpi-annotation--${kpi.annotationVariant ?? 'info'}`,
                    "data-testid": `${kpi.testId}-annotation`,
                    title: kpi.annotationTooltip ?? kpi.tooltip ?? undefined,
                    children: kpi.annotation
                }, void 0, false, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                    lineNumber: 587,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
            lineNumber: 584,
            columnNumber: 7
        }, this);
    };
    const showStatusBanner = metricsState.status === 'loading' || metricsState.status === 'error' || metricsState.experience === 'offline' || metricsState.experience === 'initial' && metricsState.status === 'empty';
    const shouldShowRecoveryCta = metricsState.status === 'error' || metricsState.experience === 'offline';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__content",
                children: [
                    showStatusBanner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-testid": "dashboard-status-banner",
                        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__status-banner",
                        children: [
                            metricsState.status === 'loading' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                variant: "info",
                                tooltip: "A sincronizar dados em tempo real.",
                                children: "A sincronizar…"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 614,
                                columnNumber: 15
                            }, this),
                            metricsState.status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                variant: "critical",
                                tooltip: metricsState.error ?? 'Erro temporário ao contactar o Core API. Tente novamente em instantes.',
                                children: "Erro temporário"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 619,
                                columnNumber: 15
                            }, this),
                            metricsState.experience === 'offline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                variant: "warning",
                                tooltip: metricsState.guidance ?? 'Sem ligação com o Core API. A mostrar dados de referência.',
                                children: "Modo offline"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 629,
                                columnNumber: 15
                            }, this),
                            metricsState.experience === 'initial' && metricsState.status === 'empty' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                variant: "info",
                                tooltip: metricsState.guidance ?? 'Finalize a configuração inicial para desbloquear métricas.',
                                children: "Configuração inicial"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 639,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 612,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__tag",
                        children: "Alojamentos locais · Porto"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 650,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "jsx-bda3f165a0fa653f",
                        children: "Coordene operações e hóspedes num único painel"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 651,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-bda3f165a0fa653f",
                        children: "Priorize equipas de campo, sincronize reservas e mantenha proprietários atualizados com insights em tempo real."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 652,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__action dashboard-hero__action--primary",
                                children: "Criar reserva"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 656,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__action dashboard-hero__action--secondary",
                                children: "Abrir calendário"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 659,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 655,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__stats",
                        children: stats.map((stat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__stat",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "jsx-bda3f165a0fa653f",
                                        children: stat.label
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 666,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "jsx-bda3f165a0fa653f",
                                        children: stat.value
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 667,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-bda3f165a0fa653f",
                                        children: stat.hint
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 668,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, stat.label, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 665,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 663,
                        columnNumber: 9
                    }, this),
                    shouldShowRecoveryCta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-testid": "dashboard-recovery-cta",
                        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__recovery",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "jsx-bda3f165a0fa653f",
                                children: "Reconectar ao Core"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 674,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-bda3f165a0fa653f",
                                children: metricsState.guidance ?? 'Siga os passos abaixo para restabelecer a sincronização com o Core API.'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 675,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                className: "jsx-bda3f165a0fa653f",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "jsx-bda3f165a0fa653f",
                                        children: [
                                            "Aceda a ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/settings/integrations",
                                                className: "jsx-bda3f165a0fa653f",
                                                children: "Configurações > Integrações"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                lineNumber: 678,
                                                columnNumber: 25
                                            }, this),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 677,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "jsx-bda3f165a0fa653f",
                                        children: "Valide as credenciais e tokens do Core API."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 680,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "jsx-bda3f165a0fa653f",
                                        children: "Guarde as alterações e atualize este painel."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 681,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 676,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 673,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 610,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__kpis",
                        children: kpis.map((kpi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                "data-variant": kpi.variant,
                                "data-state": kpi.state,
                                className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__kpi",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-bda3f165a0fa653f" + " " + "dashboard-hero__kpi-label",
                                        children: kpi.label
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 695,
                                        columnNumber: 15
                                    }, this),
                                    renderKpiContent(kpi),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-bda3f165a0fa653f",
                                        children: kpi.description
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 697,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, kpi.key, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 689,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 687,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourLauncher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TourLauncher"], {}, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 701,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 686,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "bda3f165a0fa653f",
                children: ".dashboard-hero.jsx-bda3f165a0fa653f{gap:var(--space-6);padding:var(--space-6);border-radius:var(--radius-md);box-shadow:var(--shadow-card);background:linear-gradient(135deg,#f8fafcf0,#2563eb1f);border:1px solid #94a3b83d;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);display:grid}.dashboard-hero__content.jsx-bda3f165a0fa653f{gap:var(--space-4);display:grid}.dashboard-hero__status-banner.jsx-bda3f165a0fa653f{align-items:center;gap:var(--space-3);flex-wrap:wrap;display:inline-flex}.dashboard-hero__tag.jsx-bda3f165a0fa653f{text-transform:uppercase;letter-spacing:.12em;color:var(--color-neutral-2);font-size:.75rem;font-weight:600}h1.jsx-bda3f165a0fa653f{color:var(--color-deep-blue);margin:0;font-size:2rem}p.jsx-bda3f165a0fa653f{color:var(--color-neutral-2);max-width:40ch;margin:0}.dashboard-hero__actions.jsx-bda3f165a0fa653f{gap:var(--space-3);flex-wrap:wrap;display:flex}.dashboard-hero__action.jsx-bda3f165a0fa653f{border-radius:var(--radius-sm);padding:var(--space-2)var(--space-4);cursor:pointer;border:1px solid #0000;font-weight:600;transition:background .2s,color .2s,border .2s}.dashboard-hero__action--primary.jsx-bda3f165a0fa653f{background:var(--color-deep-blue);color:#fff}.dashboard-hero__action--primary.jsx-bda3f165a0fa653f:hover,.dashboard-hero__action--primary.jsx-bda3f165a0fa653f:focus-visible{background:#1d4ed8}.dashboard-hero__action--secondary.jsx-bda3f165a0fa653f{color:var(--color-deep-blue);background:#0ea5e924;border-color:#0ea5e952}.dashboard-hero__action--secondary.jsx-bda3f165a0fa653f:hover,.dashboard-hero__action--secondary.jsx-bda3f165a0fa653f:focus-visible{background:#0ea5e938}.dashboard-hero__stats.jsx-bda3f165a0fa653f{gap:var(--space-4);grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin:0;display:grid}.dashboard-hero__stat.jsx-bda3f165a0fa653f{gap:var(--space-1);display:grid}.dashboard-hero__stat.jsx-bda3f165a0fa653f dt.jsx-bda3f165a0fa653f{letter-spacing:.08em;text-transform:uppercase;color:var(--color-neutral-2);font-size:.75rem}.dashboard-hero__stat.jsx-bda3f165a0fa653f dd.jsx-bda3f165a0fa653f{color:var(--color-deep-blue);margin:0;font-size:1.5rem;font-weight:700}.dashboard-hero__stat.jsx-bda3f165a0fa653f span.jsx-bda3f165a0fa653f{color:var(--color-neutral-2);font-size:.85rem}.dashboard-hero__recovery.jsx-bda3f165a0fa653f{margin-top:var(--space-5);padding:var(--space-4);border-radius:var(--radius-sm);border:1px dashed var(--tint-primary-strong);background:var(--app-surface-overlay);gap:var(--space-3);display:grid}.dashboard-hero__recovery.jsx-bda3f165a0fa653f strong.jsx-bda3f165a0fa653f{color:var(--color-deep-blue);font-size:1rem}.dashboard-hero__recovery.jsx-bda3f165a0fa653f p.jsx-bda3f165a0fa653f{color:var(--color-neutral-2);margin:0;font-size:.95rem}.dashboard-hero__recovery.jsx-bda3f165a0fa653f ol.jsx-bda3f165a0fa653f{padding-left:var(--space-5);gap:var(--space-2);color:var(--color-neutral-2);margin:0;display:grid}.dashboard-hero__recovery.jsx-bda3f165a0fa653f a.jsx-bda3f165a0fa653f{color:var(--color-deep-blue);font-weight:600;text-decoration:underline}.dashboard-hero__panel.jsx-bda3f165a0fa653f{gap:var(--space-4);align-content:start;display:grid}.dashboard-hero__kpis.jsx-bda3f165a0fa653f{gap:var(--space-4);display:grid}.dashboard-hero__kpi.jsx-bda3f165a0fa653f{gap:var(--space-2);padding:var(--space-4);border-radius:var(--radius-md);background:var(--color-neutral-0);box-shadow:var(--shadow-card);border-top:4px solid var(--color-deep-blue);display:grid}.dashboard-hero__kpi[data-variant=success].jsx-bda3f165a0fa653f{border-top-color:var(--color-soft-aqua)}.dashboard-hero__kpi[data-variant=warning].jsx-bda3f165a0fa653f{border-top-color:var(--color-calm-gold)}.dashboard-hero__kpi[data-variant=critical].jsx-bda3f165a0fa653f{border-top-color:var(--color-coral)}.dashboard-hero__kpi-label.jsx-bda3f165a0fa653f{color:var(--color-neutral-2);text-transform:uppercase;letter-spacing:.06em;font-size:.75rem;font-weight:600}.dashboard-hero__kpi-inner.jsx-bda3f165a0fa653f{gap:var(--space-2);flex-direction:column;display:flex}.dashboard-hero__kpi-value.jsx-bda3f165a0fa653f{color:var(--color-deep-blue);font-size:2rem;font-weight:700}.dashboard-hero__kpi-message.jsx-bda3f165a0fa653f{color:var(--color-neutral-2);font-size:.95rem}.dashboard-hero__kpi-annotation.jsx-bda3f165a0fa653f{letter-spacing:.08em;text-transform:uppercase;font-size:.7rem;font-weight:700}.dashboard-hero__kpi-annotation--info.jsx-bda3f165a0fa653f{color:var(--color-neutral-2)}.dashboard-hero__kpi-annotation--warning.jsx-bda3f165a0fa653f{color:var(--color-amber-600,#b45309)}.dashboard-hero__kpi-annotation--critical.jsx-bda3f165a0fa653f{color:var(--color-coral)}.dashboard-hero__kpi-annotation--success.jsx-bda3f165a0fa653f{color:var(--color-emerald-600,#047857)}.dashboard-hero__kpi.jsx-bda3f165a0fa653f p.jsx-bda3f165a0fa653f{color:var(--color-neutral-2);margin:0;font-size:.9rem}@media (width<=1200px){.dashboard-hero.jsx-bda3f165a0fa653f{grid-template-columns:minmax(0,1fr)}}@media (width<=768px){.dashboard-hero.jsx-bda3f165a0fa653f{padding:var(--space-5)}h1.jsx-bda3f165a0fa653f{font-size:1.75rem}.dashboard-hero__actions.jsx-bda3f165a0fa653f{flex-direction:column}.dashboard-hero__action.jsx-bda3f165a0fa653f{text-align:center;width:100%}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
        lineNumber: 609,
        columnNumber: 5
    }, this);
}
_c = DashboardHero;
function OperationalHighlightsCard({ metricsState }) {
    if (metricsState.status === 'loading') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            title: "Pulso operacional",
            description: "A sincronizar métricas em tempo real.",
            accent: "info",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Carregando indicadores de satisfação e produtividade..."
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 931,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
            lineNumber: 926,
            columnNumber: 7
        }, this);
    }
    if (metricsState.status === 'error') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            title: "Pulso operacional",
            description: "Resumo das métricas-chave de hóspedes e equipas.",
            accent: "critical",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: metricsState.error
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 943,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
            lineNumber: 938,
            columnNumber: 7
        }, this);
    }
    const data = metricsState.data;
    if (!data) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            title: "Pulso operacional",
            description: "Resumo das métricas-chave de hóspedes e equipas.",
            accent: "warning",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Cadastre propriedades e execuções de playbooks para popular estes indicadores."
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 956,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
            lineNumber: 951,
            columnNumber: 7
        }, this);
    }
    const trend = data.nps.trend7d === null ? 'Tendência estável na última semana' : `${trendFormatter.format(data.nps.trend7d)} pts versus 7 dias`;
    const items = [
        {
            label: 'Pontuação NPS',
            value: numberFormatter.format(data.nps.score),
            helper: `${numberFormatter.format(data.nps.totalResponses)} respostas · ${trend}`
        },
        {
            label: data.operational.housekeepingCompletionRate.name,
            value: formatOperationalMetric(data.operational.housekeepingCompletionRate),
            helper: data.operational.housekeepingCompletionRate.status ?? 'Execução dentro dos SLAs definidos'
        },
        {
            label: data.operational.otaSyncBacklog.name,
            value: formatOperationalMetric(data.operational.otaSyncBacklog),
            helper: data.operational.otaSyncBacklog.status ?? 'Sincronização com OTAs monitorizada'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        title: "Pulso operacional",
        description: "Combine insights de hóspedes e produtividade da equipa para priorizar ações.",
        accent: "info",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                className: "jsx-c1505fb82bbd0abe" + " " + "operational-highlights__grid",
                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-c1505fb82bbd0abe",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                className: "jsx-c1505fb82bbd0abe",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 995,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "jsx-c1505fb82bbd0abe",
                                children: item.value
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 996,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-c1505fb82bbd0abe",
                                children: item.helper
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 997,
                                columnNumber: 13
                            }, this)
                        ]
                    }, item.label, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 994,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 992,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "c1505fb82bbd0abe",
                children: ".operational-highlights__grid.jsx-c1505fb82bbd0abe{gap:var(--space-4);grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin:0;display:grid}.operational-highlights__grid.jsx-c1505fb82bbd0abe div.jsx-c1505fb82bbd0abe{gap:var(--space-1);display:grid}dt.jsx-c1505fb82bbd0abe{text-transform:uppercase;letter-spacing:.06em;color:var(--color-neutral-2);font-size:.75rem}dd.jsx-c1505fb82bbd0abe{color:var(--color-deep-blue);margin:0;font-size:1.5rem;font-weight:700}span.jsx-c1505fb82bbd0abe{color:var(--color-neutral-2);font-size:.85rem}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
        lineNumber: 987,
        columnNumber: 5
    }, this);
}
_c1 = OperationalHighlightsCard;
function CriticalAlertsCard({ metricsState }) {
    if (metricsState.status === 'loading') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            title: "Alertas críticos",
            description: "Casos prioritários para desbloquear hoje.",
            accent: "info",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "A carregar amostras de alertas críticos..."
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 1041,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
            lineNumber: 1036,
            columnNumber: 7
        }, this);
    }
    if (metricsState.status === 'error') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            title: "Alertas críticos",
            description: "Casos prioritários para desbloquear hoje.",
            accent: "critical",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: metricsState.error
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 1053,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
            lineNumber: 1048,
            columnNumber: 7
        }, this);
    }
    const data = metricsState.data;
    if (!data || data.operational.criticalAlerts.total === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            title: "Alertas críticos",
            description: "Casos prioritários para desbloquear hoje.",
            accent: "success",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Sem alertas críticos registados neste período."
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 1066,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
            lineNumber: 1061,
            columnNumber: 7
        }, this);
    }
    const examples = data.operational.criticalAlerts.examples.slice(0, 3);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        title: `Alertas críticos (${numberFormatter.format(data.operational.criticalAlerts.total)})`,
        description: "Casos prioritários para desbloquear hoje.",
        accent: "critical",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "jsx-f41fa9db14dbebc4" + " " + "critical-alerts__list",
                children: examples.map((example)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "jsx-f41fa9db14dbebc4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f41fa9db14dbebc4" + " " + "critical-alerts__header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-f41fa9db14dbebc4" + " " + "critical-alerts__status",
                                        children: formatHousekeepingStatus(example.status)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 1083,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                                        dateTime: example.scheduledDate,
                                        className: "jsx-f41fa9db14dbebc4" + " " + "critical-alerts__time",
                                        children: ALERT_DATE_FORMATTER.format(new Date(example.scheduledDate))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 1084,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1082,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-f41fa9db14dbebc4",
                                children: [
                                    "Unidade #",
                                    example.propertyId,
                                    " · Tarefa ",
                                    example.taskId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1088,
                                columnNumber: 13
                            }, this)
                        ]
                    }, example.taskId, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 1081,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 1079,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "jsx-f41fa9db14dbebc4" + " " + "critical-alerts__footer",
                children: [
                    data.operational.criticalAlerts.blocked,
                    " bloqueios · ",
                    data.operational.criticalAlerts.overdue,
                    " atrasos em acompanhamento"
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 1092,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "f41fa9db14dbebc4",
                children: ".critical-alerts__list.jsx-f41fa9db14dbebc4{gap:var(--space-3);margin:0;padding:0;list-style:none;display:grid}.critical-alerts__list.jsx-f41fa9db14dbebc4 li.jsx-f41fa9db14dbebc4{gap:var(--space-2);padding:var(--space-3);border-radius:var(--radius-sm);background:#ef635114;display:grid}.critical-alerts__header.jsx-f41fa9db14dbebc4{justify-content:space-between;align-items:baseline;gap:var(--space-3);display:flex}.critical-alerts__status.jsx-f41fa9db14dbebc4{text-transform:uppercase;letter-spacing:.08em;color:var(--color-coral);font-size:.75rem;font-weight:600}.critical-alerts__time.jsx-f41fa9db14dbebc4{color:var(--color-neutral-2);font-size:.8rem}.critical-alerts__list.jsx-f41fa9db14dbebc4 p.jsx-f41fa9db14dbebc4{color:var(--color-deep-blue);margin:0;font-weight:600}.critical-alerts__footer.jsx-f41fa9db14dbebc4{margin:0;margin-top:var(--space-3);color:var(--color-neutral-2);font-size:.85rem}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
        lineNumber: 1074,
        columnNumber: 5
    }, this);
}
_c2 = CriticalAlertsCard;
function DashboardPage() {
    _s2();
    const metricsState = useDashboardMetrics();
    const slaState = usePartnerSlas();
    const kpis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardPage.useMemo[kpis]": ()=>buildKpiCards(metricsState)
    }["DashboardPage.useMemo[kpis]"], [
        metricsState
    ]);
    const showSlaOverview = slaState.status === 'success' && slaState.data.length > 0;
    const showSlaOfflineBanner = slaState.mode === 'offline';
    const slaOfflineTooltip = slaState.message ?? 'Sem ligação com o Core API. A mostrar SLAs de referência.';
    const fallbackSlaMessage = slaState.message ?? (slaState.status === 'loading' ? 'Carregando SLAs dos parceiros...' : 'Sem dados de SLA disponíveis.');
    const fallbackSlaAccent = slaState.status === 'error' ? 'critical' : slaState.status === 'loading' ? 'info' : slaState.mode === 'offline' ? 'warning' : 'warning';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardHero, {
                metricsState: metricsState,
                kpis: kpis
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 1168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__main",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                subtitle: "Priorize ações que protegem receita e experiência.",
                                children: "Prioridades estratégicas da semana"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                title: "Backlog crítico",
                                description: "Itens alinhados ao roadmap BL-HK para ação imediata.",
                                accent: "warning",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__priority-list",
                                    children: priorities.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "jsx-6acdeee5b03d5bcb",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-6acdeee5b03d5bcb",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__priority-title",
                                                            children: item.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                            lineNumber: 1183,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-6acdeee5b03d5bcb",
                                                            children: item.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                            lineNumber: 1184,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                    lineNumber: 1182,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                    variant: item.statusVariant,
                                                    children: item.status
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                    lineNumber: 1186,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, item.title, true, {
                                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                            lineNumber: 1181,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                    lineNumber: 1179,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OperationalHighlightsCard, {
                                metricsState: metricsState
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1191,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CriticalAlertsCard, {
                                metricsState: metricsState
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1192,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 1170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__aside",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                subtitle: "Monitorização contínua dos compromissos com parceiros",
                                children: "SLAs críticos dos parceiros"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1195,
                                columnNumber: 11
                            }, this),
                            showSlaOfflineBanner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                "data-testid": "sla-offline-banner",
                                className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__offline-banner",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                        variant: "warning",
                                        tooltip: slaOfflineTooltip,
                                        children: "Modo offline"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 1200,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-6acdeee5b03d5bcb",
                                        children: slaState.message ?? 'A mostrar SLAs de referência até restabelecer a ligação.'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 1203,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1199,
                                columnNumber: 13
                            }, this),
                            showSlaOverview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$slas$2f$SlaOverview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlaOverview"], {
                                slas: slaState.data,
                                context: "home"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1207,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                title: "Monitorização de SLAs",
                                description: "Acompanhe indicadores de resposta e resolução em tempo real.",
                                accent: fallbackSlaAccent,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-6acdeee5b03d5bcb",
                                    children: fallbackSlaMessage
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                    lineNumber: 1214,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                subtitle: "Fluxos acompanhados com métricas de adoção e satisfação",
                                children: "Destaques rápidos"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1217,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__aside-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        title: "Onboarding acelerado",
                                        description: "80% das equipas concluíram o tour guiado em menos de 5 minutos.",
                                        accent: "info",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__bullet-list",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-6acdeee5b03d5bcb",
                                                    children: "Checklist de acessibilidade validado na Iteração 2."
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                    lineNumber: 1227,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-6acdeee5b03d5bcb",
                                                    children: "Artigos “Primeiros Passos” incluídos no tour contextual."
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                    lineNumber: 1228,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                            lineNumber: 1226,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 1221,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        title: "Housekeeping conectado",
                                        description: "Sincronização offline validada para 36 quartos na última ronda.",
                                        accent: "success",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "jsx-6acdeee5b03d5bcb" + " " + "dashboard__bullet-list",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-6acdeee5b03d5bcb",
                                                    children: "Alertas críticos resolvidos em média 12 minutos."
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                    lineNumber: 1237,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-6acdeee5b03d5bcb",
                                                    children: "Inventário atualizado automaticamente após reconexão."
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                                    lineNumber: 1238,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                            lineNumber: 1236,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                        lineNumber: 1231,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                                lineNumber: 1220,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                        lineNumber: 1194,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
                lineNumber: 1169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "6acdeee5b03d5bcb",
                children: '.dashboard.jsx-6acdeee5b03d5bcb{gap:var(--space-6);display:grid}.dashboard__layout.jsx-6acdeee5b03d5bcb{gap:var(--space-5);grid-template-columns:minmax(0,2fr) minmax(280px,1fr);display:grid}.dashboard__main.jsx-6acdeee5b03d5bcb,.dashboard__aside.jsx-6acdeee5b03d5bcb{gap:var(--space-5);display:grid}.dashboard__aside-grid.jsx-6acdeee5b03d5bcb{gap:var(--space-4);display:grid}.dashboard__offline-banner.jsx-6acdeee5b03d5bcb{align-items:center;gap:var(--space-3);padding:var(--space-3)var(--space-4);border-radius:var(--radius-sm);color:var(--color-calm-gold);background:#b453091f;font-weight:600;display:inline-flex}.dashboard__offline-banner.jsx-6acdeee5b03d5bcb span.jsx-6acdeee5b03d5bcb{color:var(--color-neutral-2);font-size:.9rem}.dashboard__priority-list.jsx-6acdeee5b03d5bcb{gap:var(--space-4);margin:0;padding:0;list-style:none;display:grid}.dashboard__priority-list.jsx-6acdeee5b03d5bcb li.jsx-6acdeee5b03d5bcb{align-items:start;gap:var(--space-3);padding-left:var(--space-5);grid-template-columns:minmax(0,1fr) auto;display:grid;position:relative}.dashboard__priority-list.jsx-6acdeee5b03d5bcb li.jsx-6acdeee5b03d5bcb:before{content:"";left:var(--space-2);top:var(--space-1);bottom:var(--space-1);background:#2563eb29;width:2px;position:absolute}.dashboard__priority-list.jsx-6acdeee5b03d5bcb li.jsx-6acdeee5b03d5bcb:after{content:"";left:var(--space-2);background:var(--color-deep-blue);border-radius:999px;width:10px;height:10px;position:absolute;top:.35rem;box-shadow:0 0 0 4px #2563eb2e}.dashboard__priority-title.jsx-6acdeee5b03d5bcb{color:var(--color-deep-blue);font-weight:600}.dashboard__priority-list.jsx-6acdeee5b03d5bcb p.jsx-6acdeee5b03d5bcb{color:var(--color-neutral-2);margin:.35rem 0 0}.dashboard__bullet-list.jsx-6acdeee5b03d5bcb{padding-left:var(--space-5);gap:var(--space-2);color:var(--color-neutral-2);margin:0;display:grid}@media (width<=1200px){.dashboard__layout.jsx-6acdeee5b03d5bcb{grid-template-columns:minmax(0,1fr)}}@media (width<=768px){.dashboard.jsx-6acdeee5b03d5bcb{gap:var(--space-5)}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/page.tsx",
        lineNumber: 1167,
        columnNumber: 5
    }, this);
}
_s2(DashboardPage, "8jHv6PJmyEt4ib6nfFD+vL20nfw=", false, function() {
    return [
        useDashboardMetrics,
        usePartnerSlas
    ];
});
_c3 = DashboardPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "DashboardHero");
__turbopack_context__.k.register(_c1, "OperationalHighlightsCard");
__turbopack_context__.k.register(_c2, "CriticalAlertsCard");
__turbopack_context__.k.register(_c3, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Bmad-Method_apps_web_fcd2e98c._.js.map