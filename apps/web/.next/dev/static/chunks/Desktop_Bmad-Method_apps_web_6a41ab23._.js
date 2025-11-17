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
"[project]/Desktop/Bmad-Method/apps/web/services/api/knowledge-base.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchKnowledgeBaseArticle",
    ()=>fetchKnowledgeBaseArticle,
    "fetchKnowledgeBaseCatalog",
    ()=>fetchKnowledgeBaseCatalog,
    "trackKnowledgeBaseEvent",
    ()=>trackKnowledgeBaseEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const CORE_API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000") ?? 'http://localhost:8000';
async function fetchKnowledgeBaseCatalog(params = {}) {
    const url = new URL('/support/knowledge-base/catalog', CORE_API_BASE_URL);
    if (params.query) {
        url.searchParams.set('q', params.query);
    }
    if (params.category) {
        url.searchParams.set('category', params.category);
    }
    if (params.limit) {
        url.searchParams.set('limit', params.limit.toString());
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error(`Failed to load knowledge base catalog: ${response.status}`);
    }
    const dto = await response.json();
    return {
        categories: dto.categories.map(mapCategory),
        articles: dto.articles.map(mapArticleSummary),
        query: {
            term: dto.query.term,
            totalHits: dto.query.total_hits
        }
    };
}
async function fetchKnowledgeBaseArticle(slug) {
    const url = new URL(`/support/knowledge-base/articles/${slug}`, CORE_API_BASE_URL);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error(`Failed to load article ${slug}: ${response.status}`);
    }
    const dto = await response.json();
    return mapArticle(dto);
}
async function trackKnowledgeBaseEvent(event) {
    const url = new URL('/support/knowledge-base/telemetry', CORE_API_BASE_URL);
    const payload = {
        event: event.event,
        slug: event.slug ?? null,
        query: event.query ?? null,
        hits: event.hits ?? null,
        surface: event.surface ?? null,
        duration_seconds: event.durationSeconds ?? null
    };
    await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
function mapCategory(dto) {
    return {
        id: dto.id,
        name: dto.name,
        description: dto.description,
        totalArticles: dto.total_articles,
        topTags: dto.top_tags
    };
}
function mapArticleSummary(dto) {
    return {
        id: dto.id,
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt,
        categoryId: dto.category_id,
        categoryName: dto.category_name,
        readingTimeMinutes: dto.reading_time_minutes,
        tags: dto.tags,
        updatedAt: dto.updated_at,
        stage: dto.stage,
        snippetPreview: dto.snippet_preview
    };
}
function mapArticle(dto) {
    return {
        ...mapArticleSummary(dto),
        content: dto.content,
        actionSnippets: dto.action_snippets.map((snippet)=>({
                id: snippet.id,
                label: snippet.label,
                content: snippet.content,
                surface: snippet.surface,
                recommendedPlaybook: snippet.recommended_playbook
            })),
        relatedPlaybooks: dto.related_playbooks,
        persona: dto.persona,
        useCase: dto.use_case
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SuportePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/layout/SectionHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/layout/ResponsiveGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$knowledge$2d$base$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/knowledge-base.ts [app-client] (ecmascript)");
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
const recursos = [
    {
        titulo: 'Base de conhecimento',
        itens: [
            'Artigos semanais',
            'Tutoriais em vídeo',
            'FAQs acessíveis'
        ]
    },
    {
        titulo: 'Central de tickets',
        itens: [
            'Acompanhamento de SLA',
            'Histórico de incidentes',
            'Integração ITSM'
        ]
    },
    {
        titulo: 'Chat de suporte',
        itens: [
            'Escalonamento em tempo real',
            'Registo automático de conversas',
            'Hand-off pós incidentes'
        ]
    }
];
const checklist = [
    'Concluir tour guiado de suporte no onboarding',
    'Validar canais de atendimento com equipas',
    'Registar feedback no painel de NPS interno'
];
function SuportePage() {
    _s();
    const analytics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"])();
    const [highlights, setHighlights] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingHighlights, setLoadingHighlights] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [announcement, setAnnouncement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SuportePage.useEffect": ()=>{
            let active = true;
            async function loadHighlights() {
                try {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$knowledge$2d$base$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchKnowledgeBaseCatalog"])({
                        limit: 3
                    });
                    if (!active) return;
                    setHighlights(data.articles);
                } catch (error) {
                    if (!active) return;
                    setHighlights([]);
                } finally{
                    if (active) {
                        setLoadingHighlights(false);
                    }
                }
            }
            loadHighlights();
            return ({
                "SuportePage.useEffect": ()=>{
                    active = false;
                }
            })["SuportePage.useEffect"];
        }
    }["SuportePage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SuportePage.useEffect": ()=>{
            if (!announcement) {
                return;
            }
            const timeout = window.setTimeout({
                "SuportePage.useEffect.timeout": ()=>setAnnouncement(null)
            }["SuportePage.useEffect.timeout"], 4000);
            return ({
                "SuportePage.useEffect": ()=>window.clearTimeout(timeout)
            })["SuportePage.useEffect"];
        }
    }["SuportePage.useEffect"], [
        announcement
    ]);
    const handleCopySnippet = async (article)=>{
        if (!article.snippetPreview) {
            return;
        }
        try {
            await navigator.clipboard.writeText(article.snippetPreview);
            analytics.track('knowledge_base.support_snippet_copy', {
                slug: article.slug,
                surface: 'support_center'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$knowledge$2d$base$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackKnowledgeBaseEvent"])({
                event: 'snippet_copy',
                slug: article.slug,
                surface: 'support_center'
            }).catch(()=>undefined);
            setAnnouncement('Snippet copiado a partir da base de conhecimento.');
        } catch (error) {
            setAnnouncement('Não foi possível copiar o snippet automaticamente.');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-ec165aab8504c3d",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$SectionHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                subtitle: "Centro de suporte completo conforme manual do usuário",
                children: "Base de conhecimento & Ajuda"
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            announcement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "status",
                "aria-live": "polite",
                className: "jsx-ec165aab8504c3d" + " " + "suporte-announcement",
                children: announcement
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$layout$2f$ResponsiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveGrid"], {
                columns: 3,
                children: recursos.map((recurso)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        title: recurso.titulo,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "jsx-ec165aab8504c3d",
                            children: recurso.itens.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "jsx-ec165aab8504c3d",
                                    children: item
                                }, item, false, {
                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                    lineNumber: 110,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    }, recurso.titulo, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                title: "Snippets rápidos da base de conhecimento",
                description: "Sugestões directas para reduzir abertura de tickets",
                accent: "info",
                children: [
                    loadingHighlights && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-ec165aab8504c3d",
                        children: "A carregar artigos sugeridos…"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                        lineNumber: 121,
                        columnNumber: 31
                    }, this),
                    !loadingHighlights && highlights.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-ec165aab8504c3d",
                        children: "Sem destaques no momento. Aceda à base completa para explorar novos artigos."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this),
                    !loadingHighlights && highlights.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "jsx-ec165aab8504c3d" + " " + "suporte-highlights",
                        children: highlights.map((article)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "jsx-ec165aab8504c3d",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-ec165aab8504c3d",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-ec165aab8504c3d",
                                                children: article.title
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                                lineNumber: 130,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-ec165aab8504c3d",
                                                children: article.excerpt
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-ec165aab8504c3d" + " " + "suporte-meta",
                                                children: [
                                                    article.categoryName,
                                                    " · ",
                                                    article.readingTimeMinutes,
                                                    " min"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this),
                                    article.snippetPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        "aria-label": `Snippet sugerido do artigo ${article.title}`,
                                        className: "jsx-ec165aab8504c3d",
                                        children: article.snippetPreview
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                        lineNumber: 137,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-ec165aab8504c3d" + " " + "suporte-highlight-actions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/support/knowledge-base`,
                                                className: "link",
                                                children: "Abrir artigo"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                                lineNumber: 142,
                                                columnNumber: 19
                                            }, this),
                                            article.snippetPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleCopySnippet(article),
                                                className: "jsx-ec165aab8504c3d",
                                                children: "Copiar snippet"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                                lineNumber: 146,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, article.id, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                title: "Checklist de lançamento",
                description: "Valide antes do go-live",
                accent: "info",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "jsx-ec165aab8504c3d",
                        children: checklist.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "jsx-ec165aab8504c3d",
                                children: item
                            }, item, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/support/knowledge-base",
                        className: "suporte-link",
                        children: "Ver tour completo da base de conhecimento"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "ec165aab8504c3d",
                children: ".suporte-announcement.jsx-ec165aab8504c3d{padding:var(--space-2)var(--space-3);border-radius:var(--radius-sm);margin:0 0 var(--space-3);background:#0ea5e926}ul.jsx-ec165aab8504c3d{padding-left:var(--space-5);gap:var(--space-2);margin:0;display:grid}.suporte-highlights.jsx-ec165aab8504c3d{gap:var(--space-3);margin:0;padding-left:0;list-style:none;display:grid}.suporte-highlights.jsx-ec165aab8504c3d li.jsx-ec165aab8504c3d{gap:var(--space-2);padding:var(--space-3);border-radius:var(--radius-sm);background:#2563eb0a;display:grid}.suporte-highlights.jsx-ec165aab8504c3d pre.jsx-ec165aab8504c3d{background:var(--color-neutral-0);padding:var(--space-2);border-radius:var(--radius-sm);white-space:pre-wrap;margin:0}.suporte-highlight-actions.jsx-ec165aab8504c3d{gap:var(--space-2);align-items:center;display:flex}.suporte-highlight-actions.jsx-ec165aab8504c3d button.jsx-ec165aab8504c3d{border-radius:var(--radius-sm);background:var(--color-deep-blue);color:#fff;padding:var(--space-1)var(--space-3);cursor:pointer;border:none}.suporte-highlights.jsx-ec165aab8504c3d .link.jsx-ec165aab8504c3d{color:var(--color-deep-blue);font-weight:600}.suporte-meta.jsx-ec165aab8504c3d{color:var(--color-neutral-2);font-size:.875rem}.suporte-link.jsx-ec165aab8504c3d{margin-top:var(--space-3);color:var(--color-deep-blue);font-weight:600;display:inline-block}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/app/suporte/page.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(SuportePage, "3ijh+K4t/sxaDPFXGVVdHA3G1xo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"]
    ];
});
_c = SuportePage;
var _c;
__turbopack_context__.k.register(_c, "SuportePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Bmad-Method_apps_web_6a41ab23._.js.map