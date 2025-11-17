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
"[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HousekeepingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/layout/ResponsiveGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/StatusBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$slas$2f$SlaOverview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/slas/SlaOverview.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$partners$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/partners.ts [app-client] (ecmascript)");
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
;
;
;
const DEFAULT_PROPERTY_ID = 1;
const DEFAULT_PAGE_SIZE = 9;
const STATUS_VARIANT = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    blocked: 'critical'
};
function HousekeepingPage() {
    _s();
    const { isOffline, pendingActions, enqueueTaskUpdate, flushQueue, lastChangedAt, isSyncing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOffline"])();
    const { t, locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])('housekeeping');
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pagination, setPagination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [updatingTaskId, setUpdatingTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mutationError, setMutationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [partnerSlas, setPartnerSlas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [slaLoading, setSlaLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [slaError, setSlaError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const dateTimeFormatter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[dateTimeFormatter]": ()=>new Intl.DateTimeFormat(locale, {
                dateStyle: 'short',
                timeStyle: 'short'
            })
    }["HousekeepingPage.useMemo[dateTimeFormatter]"], [
        locale
    ]);
    const integerFormatter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[integerFormatter]": ()=>new Intl.NumberFormat(locale)
    }["HousekeepingPage.useMemo[integerFormatter]"], [
        locale
    ]);
    const statusLabels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[statusLabels]": ()=>({
                pending: t('status.pending'),
                in_progress: t('status.in_progress'),
                completed: t('status.completed'),
                blocked: t('status.blocked')
            })
    }["HousekeepingPage.useMemo[statusLabels]"], [
        t
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HousekeepingPage.useEffect": ()=>{
            if (isOffline) {
                setLoading(false);
                setError(t('errors.offline'));
                return;
            }
            const controller = new AbortController();
            setLoading(true);
            setError(null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getHousekeepingTasks"])({
                propertyId: DEFAULT_PROPERTY_ID,
                pageSize: DEFAULT_PAGE_SIZE,
                signal: controller.signal
            }).then({
                "HousekeepingPage.useEffect": (response)=>{
                    if (!controller.signal.aborted) {
                        setTasks(response.items);
                        setPagination(response.pagination);
                        setLastUpdated(new Date());
                    }
                }
            }["HousekeepingPage.useEffect"]).catch({
                "HousekeepingPage.useEffect": (apiError)=>{
                    if (controller.signal.aborted) {
                        return;
                    }
                    if (apiError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
                        setError(apiError.status >= 500 ? t('errors.fetchUnavailable') : t('errors.fetchFailed'));
                    } else {
                        setError(t('errors.fetchUnexpected'));
                    }
                }
            }["HousekeepingPage.useEffect"]).finally({
                "HousekeepingPage.useEffect": ()=>{
                    if (!controller.signal.aborted) {
                        setLoading(false);
                    }
                }
            }["HousekeepingPage.useEffect"]);
            return ({
                "HousekeepingPage.useEffect": ()=>controller.abort()
            })["HousekeepingPage.useEffect"];
        }
    }["HousekeepingPage.useEffect"], [
        isOffline,
        lastChangedAt,
        t
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HousekeepingPage.useEffect": ()=>{
            if (isOffline) {
                setSlaLoading(false);
                setSlaError(t('errors.slaOffline'));
                return;
            }
            const controller = new AbortController();
            setSlaLoading(true);
            setSlaError(null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$partners$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPartnerSlas"])({
                signal: controller.signal
            }).then({
                "HousekeepingPage.useEffect": (result)=>{
                    if (controller.signal.aborted) {
                        return;
                    }
                    setPartnerSlas(result.data);
                    if (result.status === 'degraded') {
                        setSlaError(t('errors.slaOffline'));
                    }
                }
            }["HousekeepingPage.useEffect"]).catch({
                "HousekeepingPage.useEffect": (apiError)=>{
                    if (controller.signal.aborted) {
                        return;
                    }
                    if (apiError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
                        setSlaError(apiError.status >= 500 ? t('errors.slaUnavailable') : t('errors.slaFailed'));
                    } else {
                        setSlaError(t('errors.slaUnexpected'));
                    }
                    setPartnerSlas([]);
                }
            }["HousekeepingPage.useEffect"]).finally({
                "HousekeepingPage.useEffect": ()=>{
                    if (!controller.signal.aborted) {
                        setSlaLoading(false);
                    }
                }
            }["HousekeepingPage.useEffect"]);
            return ({
                "HousekeepingPage.useEffect": ()=>controller.abort()
            })["HousekeepingPage.useEffect"];
        }
    }["HousekeepingPage.useEffect"], [
        isOffline,
        lastChangedAt,
        t
    ]);
    const handleToggleStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HousekeepingPage.useCallback[handleToggleStatus]": async (task)=>{
            const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
            const description = t('queueUpdate', {
                id: task.id,
                status: statusLabels[nextStatus]
            });
            setMutationError(null);
            if (isOffline) {
                await enqueueTaskUpdate({
                    taskId: task.id,
                    updates: {
                        status: nextStatus
                    },
                    description
                });
                setTasks({
                    "HousekeepingPage.useCallback[handleToggleStatus]": (prev)=>prev.map({
                            "HousekeepingPage.useCallback[handleToggleStatus]": (item)=>item.id === task.id ? {
                                    ...item,
                                    status: nextStatus
                                } : item
                        }["HousekeepingPage.useCallback[handleToggleStatus]"])
                }["HousekeepingPage.useCallback[handleToggleStatus]"]);
                setLastUpdated(new Date());
                return;
            }
            setUpdatingTaskId(task.id);
            try {
                const updatedTask = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["updateHousekeepingTask"])(task.id, {
                    status: nextStatus
                });
                setTasks({
                    "HousekeepingPage.useCallback[handleToggleStatus]": (prev)=>prev.map({
                            "HousekeepingPage.useCallback[handleToggleStatus]": (item)=>item.id === updatedTask.id ? updatedTask : item
                        }["HousekeepingPage.useCallback[handleToggleStatus]"])
                }["HousekeepingPage.useCallback[handleToggleStatus]"]);
                setLastUpdated(new Date());
            } catch (apiError) {
                if (apiError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
                    setMutationError(apiError.status >= 500 ? t('errors.mutationUnavailable') : t('errors.mutationFailed'));
                } else {
                    setMutationError(t('errors.mutationUnexpected'));
                }
            } finally{
                setUpdatingTaskId(null);
            }
        }
    }["HousekeepingPage.useCallback[handleToggleStatus]"], [
        enqueueTaskUpdate,
        isOffline,
        statusLabels,
        t
    ]);
    const handleManualSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HousekeepingPage.useCallback[handleManualSync]": ()=>{
            void flushQueue({
                manual: true
            });
        }
    }["HousekeepingPage.useCallback[handleManualSync]"], [
        flushQueue
    ]);
    const statusCounters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[statusCounters]": ()=>{
            return tasks.reduce({
                "HousekeepingPage.useMemo[statusCounters]": (acc, task)=>{
                    acc[task.status] = (acc[task.status] ?? 0) + 1;
                    return acc;
                }
            }["HousekeepingPage.useMemo[statusCounters]"], {
                pending: 0,
                in_progress: 0,
                completed: 0,
                blocked: 0
            });
        }
    }["HousekeepingPage.useMemo[statusCounters]"], [
        tasks
    ]);
    const upcomingTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[upcomingTasks]": ()=>{
            return [
                ...tasks
            ].sort({
                "HousekeepingPage.useMemo[upcomingTasks]": (a, b)=>new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
            }["HousekeepingPage.useMemo[upcomingTasks]"]).slice(0, 3).map({
                "HousekeepingPage.useMemo[upcomingTasks]": (task)=>t('metrics.upcomingItem', {
                        id: task.id,
                        date: dateTimeFormatter.format(new Date(task.scheduledDate)),
                        status: statusLabels[task.status]
                    })
            }["HousekeepingPage.useMemo[upcomingTasks]"]);
        }
    }["HousekeepingPage.useMemo[upcomingTasks]"], [
        dateTimeFormatter,
        statusLabels,
        t,
        tasks
    ]);
    const backlogCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[backlogCount]": ()=>{
            return statusCounters.pending + statusCounters.in_progress + statusCounters.blocked;
        }
    }["HousekeepingPage.useMemo[backlogCount]"], [
        statusCounters
    ]);
    const taskCards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[taskCards]": ()=>{
            if (loading) {
                return [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: t('loading.title'),
                        description: t('loading.description'),
                        accent: "info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: t('loading.body')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 263,
                            columnNumber: 11
                        }, this)
                    }, "loading", false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ];
            }
            if (error) {
                return [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: t('loadingError.title'),
                        description: error,
                        accent: "critical",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: t('loadingError.body')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 276,
                            columnNumber: 11
                        }, this)
                    }, "error", false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ];
            }
            if (tasks.length === 0) {
                return [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: t('empty.title'),
                        description: t('empty.description'),
                        accent: "info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: t('empty.body')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this)
                    }, "empty", false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this)
                ];
            }
            return tasks.map({
                "HousekeepingPage.useMemo[taskCards]": (task)=>{
                    const isTaskUpdating = updatingTaskId === task.id;
                    const actionLabel = task.status === 'completed' ? t('taskCard.reopen') : t('taskCard.complete');
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: t('taskCard.title', {
                            id: task.id
                        }),
                        description: t('taskCard.scheduled', {
                            date: dateTimeFormatter.format(new Date(task.scheduledDate))
                        }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                variant: STATUS_VARIANT[task.status],
                                children: statusLabels[task.status]
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                lineNumber: 307,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: t('taskCard.reservation', {
                                            value: task.reservationId ?? t('taskCard.reservationFallback')
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                        lineNumber: 311,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: t('taskCard.assignee', {
                                            value: task.assignedAgentId ?? t('taskCard.assigneeFallback')
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                        lineNumber: 316,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: t('taskCard.notes', {
                                            value: task.notes ?? t('taskCard.notesFallback')
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                lineNumber: 310,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: {
                                    "HousekeepingPage.useMemo[taskCards]": ()=>{
                                        void handleToggleStatus(task);
                                    }
                                }["HousekeepingPage.useMemo[taskCards]"],
                                disabled: isTaskUpdating || isSyncing,
                                children: isTaskUpdating ? t('taskCard.syncing') : actionLabel
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this)
                        ]
                    }, task.id, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this);
                }
            }["HousekeepingPage.useMemo[taskCards]"]);
        }
    }["HousekeepingPage.useMemo[taskCards]"], [
        dateTimeFormatter,
        error,
        handleToggleStatus,
        isSyncing,
        loading,
        statusLabels,
        t,
        tasks,
        updatingTaskId
    ]);
    const slaSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[slaSection]": ()=>{
            if (slaLoading) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveGrid"], {
                    columns: 1,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: t('sla.loadingTitle'),
                        description: t('sla.loadingDescription'),
                        accent: "info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: t('sla.loadingBody')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 360,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                    lineNumber: 354,
                    columnNumber: 9
                }, this);
            }
            if (slaError) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveGrid"], {
                    columns: 1,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: t('sla.errorTitle'),
                        description: t('sla.errorDescription'),
                        accent: "critical",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: slaError
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 374,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 369,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                    lineNumber: 368,
                    columnNumber: 9
                }, this);
            }
            if (partnerSlas.length === 0) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveGrid"], {
                    columns: 1,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: t('sla.emptyTitle'),
                        description: t('sla.emptyDescription'),
                        accent: "info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: t('sla.emptyBody')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 388,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 383,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                    lineNumber: 382,
                    columnNumber: 9
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$slas$2f$SlaOverview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlaOverview"], {
                slas: partnerSlas,
                context: "housekeeping"
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 394,
                columnNumber: 12
            }, this);
        }
    }["HousekeepingPage.useMemo[slaSection]"], [
        partnerSlas,
        slaError,
        slaLoading,
        t
    ]);
    const metricsBlocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[metricsBlocks]": ()=>{
            if (loading) {
                return [
                    {
                        title: t('metrics.loadingTitle'),
                        items: [
                            t('metrics.loadingBody')
                        ]
                    }
                ];
            }
            if (error) {
                return [
                    {
                        title: t('metrics.errorTitle'),
                        items: [
                            error
                        ]
                    }
                ];
            }
            const lastUpdatedLabel = lastUpdated ? dateTimeFormatter.format(lastUpdated) : '—';
            const totalRegistrado = pagination?.total ?? tasks.length;
            const totalPaginas = pagination?.totalPages ?? (tasks.length > 0 ? 1 : 0);
            const paginaActual = pagination?.page ?? (tasks.length > 0 ? 1 : 0);
            return [
                {
                    title: t('metrics.efficiencyTitle'),
                    items: [
                        t('metrics.efficiency.total', {
                            value: integerFormatter.format(totalRegistrado)
                        }),
                        t('metrics.efficiency.visible', {
                            value: integerFormatter.format(tasks.length)
                        }),
                        t('metrics.efficiency.backlog', {
                            value: integerFormatter.format(backlogCount)
                        }),
                        t('metrics.efficiency.completed', {
                            value: integerFormatter.format(statusCounters.completed)
                        }),
                        t('metrics.efficiency.page', {
                            page: integerFormatter.format(paginaActual),
                            pages: integerFormatter.format(totalPaginas || 1)
                        }),
                        t('metrics.efficiency.updatedAt', {
                            value: lastUpdatedLabel
                        })
                    ]
                },
                {
                    title: t('metrics.upcomingTitle'),
                    items: upcomingTasks.length > 0 ? upcomingTasks : [
                        t('metrics.noUpcoming')
                    ]
                }
            ];
        }
    }["HousekeepingPage.useMemo[metricsBlocks]"], [
        loading,
        error,
        tasks.length,
        backlogCount,
        statusCounters.completed,
        upcomingTasks,
        lastUpdated,
        pagination,
        t,
        integerFormatter,
        dateTimeFormatter
    ]);
    const operationCards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HousekeepingPage.useMemo[operationCards]": ()=>{
            const cards = [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    title: t('queue.title'),
                    description: t('queue.description'),
                    accent: pendingActions.length > 0 ? 'warning' : 'success',
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: isOffline ? t('queue.offline') : isSyncing ? t('queue.syncing') : t('queue.online')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 469,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            children: pendingActions.length > 0 ? pendingActions.map({
                                "HousekeepingPage.useMemo[operationCards]": (action)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: action
                                    }, action, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                        lineNumber: 478,
                                        columnNumber: 46
                                    }, this)
                            }["HousekeepingPage.useMemo[operationCards]"]) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: t('queue.empty')
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 476,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleManualSync,
                            disabled: isOffline || pendingActions.length === 0 || isSyncing,
                            children: isSyncing ? t('queue.actionSyncing') : t('queue.action')
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 483,
                            columnNumber: 11
                        }, this),
                        mutationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "queue-error",
                            children: mutationError
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 490,
                            columnNumber: 29
                        }, this)
                    ]
                }, "offline-queue", true, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                    lineNumber: 463,
                    columnNumber: 9
                }, this)
            ];
            cards.push(...metricsBlocks.map({
                "HousekeepingPage.useMemo[operationCards]": (block)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: block.title,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            children: block.items.map({
                                "HousekeepingPage.useMemo[operationCards]": (item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                                        lineNumber: 500,
                                        columnNumber: 15
                                    }, this)
                            }["HousekeepingPage.useMemo[operationCards]"])
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                            lineNumber: 498,
                            columnNumber: 11
                        }, this)
                    }, block.title, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                        lineNumber: 497,
                        columnNumber: 9
                    }, this)
            }["HousekeepingPage.useMemo[operationCards]"]));
            return cards;
        }
    }["HousekeepingPage.useMemo[operationCards]"], [
        handleManualSync,
        isOffline,
        isSyncing,
        metricsBlocks,
        mutationError,
        pendingActions,
        t
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-5d5bf926187dc9cf",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                subtitle: t('sections.main.subtitle'),
                children: t('sections.main.title')
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 520,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                title: t('sections.connection.title'),
                description: t('sections.connection.description'),
                accent: isOffline ? 'critical' : 'success',
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "jsx-5d5bf926187dc9cf",
                    children: isOffline ? t('sections.connection.offline') : t('sections.connection.online')
                }, void 0, false, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                    lineNumber: 528,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 523,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                subtitle: t('sections.sla.subtitle'),
                children: t('sections.sla.title')
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 534,
                columnNumber: 7
            }, this),
            slaSection,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                subtitle: t('sections.tasks.subtitle'),
                children: t('sections.tasks.title')
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 538,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveGrid"], {
                columns: 3,
                children: taskCards
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 541,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                subtitle: t('sections.operations.subtitle'),
                children: t('sections.operations.title')
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 542,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveGrid"], {
                columns: 2,
                children: operationCards
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
                lineNumber: 545,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "5d5bf926187dc9cf",
                children: "ul.jsx-5d5bf926187dc9cf{padding-left:var(--space-5);gap:var(--space-2);margin:0;display:grid}button.jsx-5d5bf926187dc9cf{margin-top:var(--space-3);padding:var(--space-2)var(--space-3);border-radius:var(--radius-md,6px);background:var(--color-midnight,#0f172a);color:var(--color-base-inverse,#fff);cursor:pointer;border:0;font-weight:600}button[disabled].jsx-5d5bf926187dc9cf{opacity:.6;cursor:not-allowed}.queue-error.jsx-5d5bf926187dc9cf{margin-top:var(--space-2);color:var(--color-coral);font-weight:600}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/housekeeping/page.tsx",
        lineNumber: 519,
        columnNumber: 5
    }, this);
}
_s(HousekeepingPage, "nWpXwt7P9zt5kUDytZK6JKjU6LU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOffline"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = HousekeepingPage;
var _c;
__turbopack_context__.k.register(_c, "HousekeepingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Bmad-Method_apps_web_4f90e455._.js.map