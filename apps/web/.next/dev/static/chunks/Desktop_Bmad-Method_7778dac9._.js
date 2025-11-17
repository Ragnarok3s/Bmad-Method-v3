(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnalyticsProvider",
    ()=>AnalyticsProvider,
    "useAnalytics",
    ()=>useAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AnalyticsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ANALYTICS_KEY = 'bmad-analytics-queue';
function persistQueue(queue) {
    try {
        window.sessionStorage.setItem(ANALYTICS_KEY, JSON.stringify(queue));
    } catch  {
    // ignore storage errors in private mode
    }
}
function loadQueue() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = window.sessionStorage.getItem(ANALYTICS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch  {
        return [];
    }
}
function AnalyticsProvider({ children }) {
    _s();
    const queueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnalyticsProvider.useEffect": ()=>{
            queueRef.current = loadQueue();
        }
    }["AnalyticsProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnalyticsProvider.useEffect": ()=>{
            const event = {
                type: 'page_view',
                payload: {
                    path: pathname,
                    search: searchParams?.toString() ?? ''
                },
                timestamp: Date.now()
            };
            queueRef.current.push(event);
            persistQueue(queueRef.current);
        }
    }["AnalyticsProvider.useEffect"], [
        pathname,
        searchParams
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsProvider.useMemo[value]": ()=>({
                track: ({
                    "AnalyticsProvider.useMemo[value]": (type, payload)=>{
                        const event = {
                            type,
                            payload,
                            timestamp: Date.now()
                        };
                        queueRef.current.push(event);
                        persistQueue(queueRef.current);
                    }
                })["AnalyticsProvider.useMemo[value]"],
                flushQueue: ({
                    "AnalyticsProvider.useMemo[value]": ()=>{
                        const copy = [
                            ...queueRef.current
                        ];
                        queueRef.current = [];
                        persistQueue(queueRef.current);
                        return copy;
                    }
                })["AnalyticsProvider.useMemo[value]"]
            })
    }["AnalyticsProvider.useMemo[value]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnalyticsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx",
        lineNumber: 75,
        columnNumber: 10
    }, this);
}
_s(AnalyticsProvider, "ebBnTWsC1xquZfWmy86PXRdHZlg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = AnalyticsProvider;
function useAnalytics() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AnalyticsContext);
    if (!ctx) {
        throw new Error('useAnalytics deve ser utilizado dentro de AnalyticsProvider');
    }
    return ctx;
}
_s1(useAnalytics, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AnalyticsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/offline-queue.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTaskUpdates",
    ()=>clearTaskUpdates,
    "enqueueTaskUpdate",
    ()=>enqueueTaskUpdate,
    "readTaskUpdates",
    ()=>readTaskUpdates,
    "removeTaskUpdate",
    ()=>removeTaskUpdate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/idb/build/index.js [app-client] (ecmascript)");
;
const DB_NAME = 'bmad-offline';
const STORE_NAME = 'housekeeping-task-mutations';
let dbPromise = null;
const memoryFallback = [];
function isIndexedDbAvailable() {
    return ("TURBOPACK compile-time value", "object") !== 'undefined' && typeof window.indexedDB !== 'undefined';
}
async function getDb() {
    if (!dbPromise) {
        dbPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openDB"])(DB_NAME, 1, {
            upgrade (db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, {
                        keyPath: 'id'
                    });
                }
            }
        });
    }
    return dbPromise;
}
function createMutation(input) {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `mutation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return {
        id,
        taskId: input.taskId,
        updates: input.updates,
        description: input.description,
        createdAt: Date.now()
    };
}
async function enqueueTaskUpdate(input) {
    const mutation = createMutation(input);
    if (!isIndexedDbAvailable()) {
        memoryFallback.push(mutation);
        return mutation;
    }
    const db = await getDb();
    await db.put(STORE_NAME, mutation);
    return mutation;
}
async function removeTaskUpdate(id) {
    if (!isIndexedDbAvailable()) {
        const index = memoryFallback.findIndex((item)=>item.id === id);
        if (index >= 0) {
            memoryFallback.splice(index, 1);
        }
        return;
    }
    const db = await getDb();
    await db.delete(STORE_NAME, id);
}
async function readTaskUpdates() {
    if (!isIndexedDbAvailable()) {
        return [
            ...memoryFallback
        ].sort((a, b)=>a.createdAt - b.createdAt);
    }
    const db = await getDb();
    const items = await db.getAll(STORE_NAME);
    return items.sort((a, b)=>a.createdAt - b.createdAt);
}
async function clearTaskUpdates() {
    if (!isIndexedDbAvailable()) {
        memoryFallback.length = 0;
        return;
    }
    const db = await getDb();
    await db.clear(STORE_NAME);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CoreApiClient",
    ()=>CoreApiClient,
    "CoreApiError",
    ()=>CoreApiError,
    "toSnakeCaseKeys",
    ()=>toSnakeCaseKeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lodash$2e$snakecase$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lodash.snakecase/index.js [app-client] (ecmascript)");
;
class CoreApiError extends Error {
    constructor(message, status, body){
        super(message);
        this.status = status;
        this.body = body;
        this.name = 'CoreApiError';
    }
}
class CoreApiClient {
    constructor(options){
        var _a;
        this.baseUrl = new URL(options.baseUrl.replace(/\/$/, ''));
        this.getAccessToken = options.getAccessToken;
        this.fetchImpl = (_a = options.fetchImpl) !== null && _a !== void 0 ? _a : fetch;
    }
    async request(options) {
        var _a, _b, _c;
        const url = new URL(options.path, this.baseUrl);
        if (options.query) {
            for (const [key, value] of Object.entries(options.query)){
                if (value === undefined || value === null) {
                    continue;
                }
                url.searchParams.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lodash$2e$snakecase$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key), String(value));
            }
        }
        const headers = {
            Accept: 'application/json',
            ...(_a = options.headers) !== null && _a !== void 0 ? _a : {}
        };
        let body;
        if (options.body instanceof FormData || typeof options.body === 'string') {
            body = options.body;
        } else if (options.body) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(toSnakeCaseKeys(options.body));
        }
        const token = this.getAccessToken ? await this.getAccessToken() : null;
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        const response = await this.fetchImpl(url, {
            method: (_b = options.method) !== null && _b !== void 0 ? _b : 'GET',
            body,
            signal: options.signal,
            headers
        });
        if (!response.ok) {
            const payload = await safeReadJson(response);
            throw new CoreApiError(`Request to ${options.path} failed with status ${response.status}`, response.status, payload);
        }
        if (response.status === 204) {
            return undefined;
        }
        const contentType = (_c = response.headers.get('content-type')) !== null && _c !== void 0 ? _c : '';
        if (contentType.includes('application/json')) {
            return await response.json();
        }
        return undefined;
    }
}
function toSnakeCaseKeys(value) {
    const entries = Object.entries(value).map(([key, val])=>[
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lodash$2e$snakecase$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key),
            val
        ]);
    return Object.fromEntries(entries);
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
"[project]/Desktop/Bmad-Method/packages/api-client/dist/housekeeping.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HousekeepingApi",
    ()=>HousekeepingApi
]);
class HousekeepingApi {
    constructor(client){
        this.client = client;
    }
    async listTasks(query) {
        const { propertyId, signal, ...filters } = query;
        const payload = await this.client.request({
            path: `/properties/${propertyId}/housekeeping`,
            method: 'GET',
            query: filters,
            signal
        });
        return {
            items: payload.items.map(mapTask),
            pagination: mapPagination(payload.pagination)
        };
    }
    async updateTask(taskId, payload) {
        const dto = await this.client.request({
            path: `/housekeeping/tasks/${taskId}`,
            method: 'PATCH',
            body: payload
        });
        return mapTask(dto);
    }
}
function mapTask(dto) {
    return {
        id: dto.id,
        propertyId: dto.property_id,
        reservationId: dto.reservation_id,
        assignedAgentId: dto.assigned_agent_id,
        status: dto.status,
        scheduledDate: dto.scheduled_date,
        notes: dto.notes,
        createdAt: dto.created_at
    };
}
function mapPagination(dto) {
    return {
        page: dto.page,
        pageSize: dto.page_size,
        total: dto.total,
        totalPages: dto.total_pages
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/incidents.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IncidentApi",
    ()=>IncidentApi
]);
class IncidentApi {
    constructor(client){
        this.client = client;
    }
    async submit(ownerId, payload) {
        return this.client.request({
            path: `/owners/${ownerId}/incidents`,
            method: 'POST',
            body: payload
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/notifications.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationApi",
    ()=>NotificationApi
]);
class NotificationApi {
    constructor(client){
        this.client = client;
    }
    async registerDevice(ownerId, payload) {
        await this.client.request({
            path: `/owners/${ownerId}/devices`,
            method: 'POST',
            body: payload
        });
    }
    async unregisterDevice(ownerId, token) {
        await this.client.request({
            path: `/owners/${ownerId}/devices/${encodeURIComponent(token)}`,
            method: 'DELETE'
        });
    }
    async listDevices(ownerId) {
        const payload = await this.client.request({
            path: `/owners/${ownerId}/devices`,
            method: 'GET'
        });
        return payload;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/client.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BmadApiClient",
    ()=>BmadApiClient,
    "createApiClient",
    ()=>createApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$housekeeping$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/housekeeping.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$incidents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/incidents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/notifications.js [app-client] (ecmascript)");
;
;
;
;
class BmadApiClient extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiClient"] {
    constructor(options){
        super(options);
        this.housekeeping = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$housekeeping$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HousekeepingApi"](this);
        this.incidents = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$incidents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IncidentApi"](this);
        this.notifications = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationApi"](this);
    }
}
function createApiClient(options) {
    return new BmadApiClient(options);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$housekeeping$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/housekeeping.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$incidents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/incidents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/notifications.js [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiClient",
    ()=>getApiClient,
    "resetApiClient",
    ()=>resetApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/client.js [app-client] (ecmascript)");
;
let client = null;
function getApiClient() {
    if (!client) {
        const baseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") ?? 'http://localhost:8000';
        const fetchProxy = (input, init)=>globalThis.fetch(input, init);
        client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createApiClient"])({
            baseUrl,
            fetchImpl: fetchProxy
        });
    }
    return client;
}
function resetApiClient() {
    client = null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getHousekeepingTasks",
    ()=>getHousekeepingTasks,
    "updateHousekeepingTask",
    ()=>updateHousekeepingTask
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/client.ts [app-client] (ecmascript)");
;
;
;
async function getHousekeepingTasks(query) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiClient"])().housekeeping.listTasks(query);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to load housekeeping tasks', 500, null);
    }
}
async function updateHousekeepingTask(taskId, payload) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiClient"])().housekeeping.updateTask(taskId, payload);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to update housekeeping task', 500, null);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflineProvider",
    ()=>OfflineProvider,
    "useOffline",
    ()=>useOffline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/offline-queue.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const OfflineContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function OfflineProvider({ children }) {
    _s();
    const [isOffline, setIsOffline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastChangedAt, setLastChangedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingMutations, setPendingMutations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSyncing, setIsSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const manualSyncListeners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const isClient = ("TURBOPACK compile-time value", "object") !== 'undefined';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OfflineProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const syncInitialStatus = {
                "OfflineProvider.useEffect.syncInitialStatus": ()=>{
                    const offline = !navigator.onLine;
                    setIsOffline(offline);
                    if (offline) {
                        setLastChangedAt(Date.now());
                    }
                }
            }["OfflineProvider.useEffect.syncInitialStatus"];
            syncInitialStatus();
            const handleOnline = {
                "OfflineProvider.useEffect.handleOnline": ()=>{
                    setIsOffline(false);
                    setLastChangedAt(Date.now());
                }
            }["OfflineProvider.useEffect.handleOnline"];
            const handleOffline = {
                "OfflineProvider.useEffect.handleOffline": ()=>{
                    setIsOffline(true);
                    setLastChangedAt(Date.now());
                }
            }["OfflineProvider.useEffect.handleOffline"];
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            return ({
                "OfflineProvider.useEffect": ()=>{
                    window.removeEventListener('online', handleOnline);
                    window.removeEventListener('offline', handleOffline);
                }
            })["OfflineProvider.useEffect"];
        }
    }["OfflineProvider.useEffect"], []);
    const refreshPendingMutations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OfflineProvider.useCallback[refreshPendingMutations]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const mutations = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readTaskUpdates"])();
                setPendingMutations(mutations);
            } catch (error) {
                console.error('Não foi possível ler fila offline', error);
            }
        }
    }["OfflineProvider.useCallback[refreshPendingMutations]"], [
        isClient
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OfflineProvider.useEffect": ()=>{
            void refreshPendingMutations();
        }
    }["OfflineProvider.useEffect"], [
        refreshPendingMutations
    ]);
    const enqueueTaskUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OfflineProvider.useCallback[enqueueTaskUpdate]": async (input)=>{
            const mutation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enqueueTaskUpdate"])(input);
            setPendingMutations({
                "OfflineProvider.useCallback[enqueueTaskUpdate]": (prev)=>[
                        ...prev,
                        mutation
                    ].sort({
                        "OfflineProvider.useCallback[enqueueTaskUpdate]": (a, b)=>a.createdAt - b.createdAt
                    }["OfflineProvider.useCallback[enqueueTaskUpdate]"])
            }["OfflineProvider.useCallback[enqueueTaskUpdate]"]);
            if (isOffline) {
                setLastChangedAt(Date.now());
            }
            return mutation;
        }
    }["OfflineProvider.useCallback[enqueueTaskUpdate]"], [
        isOffline
    ]);
    const removeTaskUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OfflineProvider.useCallback[removeTaskUpdate]": async (id)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeTaskUpdate"])(id);
            setPendingMutations({
                "OfflineProvider.useCallback[removeTaskUpdate]": (prev)=>prev.filter({
                        "OfflineProvider.useCallback[removeTaskUpdate]": (mutation)=>mutation.id !== id
                    }["OfflineProvider.useCallback[removeTaskUpdate]"])
            }["OfflineProvider.useCallback[removeTaskUpdate]"]);
        }
    }["OfflineProvider.useCallback[removeTaskUpdate]"], []);
    const flushQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OfflineProvider.useCallback[flushQueue]": async ({ manual = false } = {})=>{
            if (isOffline || !isClient) {
                return;
            }
            setIsSyncing(true);
            let hasSynced = false;
            try {
                const queuedMutations = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readTaskUpdates"])();
                for (const mutation of queuedMutations){
                    try {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["updateHousekeepingTask"])(mutation.taskId, mutation.updates);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeTaskUpdate"])(mutation.id);
                        hasSynced = true;
                    } catch (error) {
                        console.error('Falha ao reenviar mutação offline', error);
                        break;
                    }
                }
            } finally{
                await refreshPendingMutations();
                setIsSyncing(false);
                if (hasSynced) {
                    setLastChangedAt(Date.now());
                }
                if (manual) {
                    manualSyncListeners.current.forEach({
                        "OfflineProvider.useCallback[flushQueue]": (listener)=>{
                            try {
                                listener();
                            } catch (error) {
                                console.error('Erro ao notificar listener de sincronização manual', error);
                            }
                        }
                    }["OfflineProvider.useCallback[flushQueue]"]);
                }
            }
        }
    }["OfflineProvider.useCallback[flushQueue]"], [
        isClient,
        isOffline,
        refreshPendingMutations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OfflineProvider.useEffect": ()=>{
            if (!isOffline) {
                void flushQueue();
            }
        }
    }["OfflineProvider.useEffect"], [
        isOffline,
        flushQueue
    ]);
    const onManualSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OfflineProvider.useCallback[onManualSync]": (listener)=>{
            manualSyncListeners.current.add(listener);
            return ({
                "OfflineProvider.useCallback[onManualSync]": ()=>{
                    manualSyncListeners.current.delete(listener);
                }
            })["OfflineProvider.useCallback[onManualSync]"];
        }
    }["OfflineProvider.useCallback[onManualSync]"], []);
    const pendingActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OfflineProvider.useMemo[pendingActions]": ()=>{
            return pendingMutations.map({
                "OfflineProvider.useMemo[pendingActions]": (mutation)=>mutation.description
            }["OfflineProvider.useMemo[pendingActions]"]);
        }
    }["OfflineProvider.useMemo[pendingActions]"], [
        pendingMutations
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OfflineProvider.useMemo[value]": ()=>({
                isOffline,
                lastChangedAt,
                pendingActions,
                enqueueTaskUpdate,
                removeTaskUpdate,
                flushQueue,
                onManualSync,
                isSyncing
            })
    }["OfflineProvider.useMemo[value]"], [
        isOffline,
        lastChangedAt,
        pendingActions,
        enqueueTaskUpdate,
        removeTaskUpdate,
        flushQueue,
        onManualSync,
        isSyncing
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OfflineContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx",
        lineNumber: 191,
        columnNumber: 10
    }, this);
}
_s(OfflineProvider, "qWUWj0E8xeyQp2sz+tCa9ajSlqk=");
_c = OfflineProvider;
function useOffline() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(OfflineContext);
    if (!context) {
        throw new Error('useOffline deve ser usado dentro de OfflineProvider');
    }
    return context;
}
_s1(useOffline, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "OfflineProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GuidedTourProvider",
    ()=>GuidedTourProvider,
    "tourMatchesPath",
    ()=>tourMatchesPath,
    "useGuidedTour",
    ()=>useGuidedTour
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const COMPLETED_STORAGE_KEY = 'bmad:guided-tour:completed';
const TourContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function normalizeRoutes(route) {
    if (!route) {
        return [];
    }
    if (Array.isArray(route)) {
        return route;
    }
    return [
        route
    ];
}
function tourMatchesPath(route, pathname) {
    const routes = normalizeRoutes(route);
    if (routes.length === 0) {
        return true;
    }
    return routes.some((entry)=>{
        if (entry === '*') {
            return true;
        }
        if (entry.endsWith('*')) {
            const prefix = entry.slice(0, -1);
            return pathname.startsWith(prefix);
        }
        return pathname === entry;
    });
}
function GuidedTourProvider({ children }) {
    _s();
    const analytics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [activeTourId, setActiveTourId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [registrations, setRegistrations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [completed, setCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const autoStartTriggeredRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GuidedTourProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const stored = window.localStorage.getItem(COMPLETED_STORAGE_KEY);
                if (!stored) {
                    return;
                }
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    const sanitized = parsed.filter({
                        "GuidedTourProvider.useEffect.sanitized": (item)=>typeof item === 'string'
                    }["GuidedTourProvider.useEffect.sanitized"]);
                    setCompleted(sanitized);
                }
            } catch (error) {
                console.warn('guided_tour_completed_read_failed', error);
            }
        }
    }["GuidedTourProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GuidedTourProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                window.localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completed));
            } catch (error) {
                console.warn('guided_tour_completed_write_failed', error);
            }
        }
    }["GuidedTourProvider.useEffect"], [
        completed
    ]);
    const completedSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GuidedTourProvider.useMemo[completedSet]": ()=>new Set(completed)
    }["GuidedTourProvider.useMemo[completedSet]"], [
        completed
    ]);
    const registerTour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[registerTour]": (registration)=>{
            setRegistrations({
                "GuidedTourProvider.useCallback[registerTour]": (previous)=>{
                    const current = previous[registration.id];
                    if (current === registration) {
                        return previous;
                    }
                    return {
                        ...previous,
                        [registration.id]: registration
                    };
                }
            }["GuidedTourProvider.useCallback[registerTour]"]);
            return ({
                "GuidedTourProvider.useCallback[registerTour]": ()=>{
                    setRegistrations({
                        "GuidedTourProvider.useCallback[registerTour]": (previous)=>{
                            if (!(registration.id in previous)) {
                                return previous;
                            }
                            const next = {
                                ...previous
                            };
                            delete next[registration.id];
                            return next;
                        }
                    }["GuidedTourProvider.useCallback[registerTour]"]);
                }
            })["GuidedTourProvider.useCallback[registerTour]"];
        }
    }["GuidedTourProvider.useCallback[registerTour]"], []);
    const markCompleted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[markCompleted]": (tourId)=>{
            setCompleted({
                "GuidedTourProvider.useCallback[markCompleted]": (previous)=>{
                    if (previous.includes(tourId)) {
                        return previous;
                    }
                    const next = [
                        ...previous,
                        tourId
                    ];
                    return next;
                }
            }["GuidedTourProvider.useCallback[markCompleted]"]);
            const registration = registrations[tourId];
            analytics.track('tour.completed', {
                tourId,
                route: registration?.route ?? 'global',
                steps: registration?.steps.length ?? 0
            });
        }
    }["GuidedTourProvider.useCallback[markCompleted]"], [
        analytics,
        registrations
    ]);
    const startTour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[startTour]": (tourId)=>{
            const registration = registrations[tourId];
            if (!registration || registration.steps.length === 0) {
                return;
            }
            setActiveTourId(tourId);
            setCurrentIndex(0);
            setIsOpen(true);
            analytics.track('tour.started', {
                tourId,
                route: registration.route ?? 'global',
                autoStart: registration.autoStart ?? false
            });
        }
    }["GuidedTourProvider.useCallback[startTour]"], [
        analytics,
        registrations
    ]);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[open]": (tourId)=>{
            if (tourId) {
                startTour(tourId);
                return;
            }
            const firstTour = Object.values(registrations)[0];
            if (firstTour) {
                startTour(firstTour.id);
            }
        }
    }["GuidedTourProvider.useCallback[open]"], [
        registrations,
        startTour
    ]);
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[close]": (options = {})=>{
            const { markCompleted: shouldComplete = false } = options;
            const currentTourId = activeTourId;
            setIsOpen(false);
            setCurrentIndex(0);
            if (shouldComplete && currentTourId) {
                markCompleted(currentTourId);
            }
            analytics.track('tour.closed', {
                tourId: currentTourId,
                markedCompleted: shouldComplete
            });
            if (shouldComplete) {
                setActiveTourId(null);
            }
        }
    }["GuidedTourProvider.useCallback[close]"], [
        activeTourId,
        analytics,
        markCompleted
    ]);
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[next]": ()=>{
            if (!activeTourId) {
                return;
            }
            const registration = registrations[activeTourId];
            if (!registration) {
                return;
            }
            const lastIndex = registration.steps.length - 1;
            if (currentIndex >= lastIndex) {
                markCompleted(activeTourId);
                setIsOpen(false);
                setActiveTourId(null);
                setCurrentIndex(0);
                return;
            }
            setCurrentIndex({
                "GuidedTourProvider.useCallback[next]": (index)=>Math.min(index + 1, lastIndex)
            }["GuidedTourProvider.useCallback[next]"]);
        }
    }["GuidedTourProvider.useCallback[next]"], [
        activeTourId,
        currentIndex,
        markCompleted,
        registrations
    ]);
    const previous = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[previous]": ()=>{
            setCurrentIndex({
                "GuidedTourProvider.useCallback[previous]": (index)=>Math.max(index - 1, 0)
            }["GuidedTourProvider.useCallback[previous]"]);
        }
    }["GuidedTourProvider.useCallback[previous]"], []);
    const hasCompleted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTourProvider.useCallback[hasCompleted]": (tourId)=>completedSet.has(tourId)
    }["GuidedTourProvider.useCallback[hasCompleted]"], [
        completedSet
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GuidedTourProvider.useEffect": ()=>{
            if (!pathname || isOpen) {
                return;
            }
            const registrationsList = Object.values(registrations);
            for (const registration of registrationsList){
                if (!registration.autoStart) {
                    continue;
                }
                if (!tourMatchesPath(registration.route, pathname)) {
                    continue;
                }
                if (completedSet.has(registration.id)) {
                    continue;
                }
                const key = `${registration.id}:${pathname}`;
                if (autoStartTriggeredRef.current.has(key)) {
                    continue;
                }
                autoStartTriggeredRef.current.add(key);
                startTour(registration.id);
                break;
            }
        }
    }["GuidedTourProvider.useEffect"], [
        completedSet,
        isOpen,
        pathname,
        registrations,
        startTour
    ]);
    const activeTour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GuidedTourProvider.useMemo[activeTour]": ()=>{
            if (!activeTourId) {
                return null;
            }
            return registrations[activeTourId] ?? null;
        }
    }["GuidedTourProvider.useMemo[activeTour]"], [
        activeTourId,
        registrations
    ]);
    const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GuidedTourProvider.useMemo[steps]": ()=>{
            return activeTour?.steps ?? [];
        }
    }["GuidedTourProvider.useMemo[steps]"], [
        activeTour
    ]);
    const activeStep = steps[currentIndex] ?? null;
    const tours = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GuidedTourProvider.useMemo[tours]": ()=>Object.values(registrations)
    }["GuidedTourProvider.useMemo[tours]"], [
        registrations
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GuidedTourProvider.useMemo[value]": ()=>({
                isOpen,
                currentIndex,
                steps,
                activeStep,
                activeTourId,
                tours,
                open,
                startTour,
                close,
                next,
                previous,
                registerTour,
                hasCompleted,
                markCompleted
            })
    }["GuidedTourProvider.useMemo[value]"], [
        activeStep,
        activeTourId,
        close,
        currentIndex,
        hasCompleted,
        isOpen,
        markCompleted,
        next,
        open,
        previous,
        registerTour,
        startTour,
        steps,
        tours
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TourContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx",
        lineNumber: 314,
        columnNumber: 10
    }, this);
}
_s(GuidedTourProvider, "5FiDr3vSm0/+vmcjOLgKTAK+zWw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = GuidedTourProvider;
function useGuidedTour() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TourContext);
    if (!context) {
        throw new Error('useGuidedTour deve ser usado dentro de GuidedTourProvider');
    }
    return context;
}
_s1(useGuidedTour, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "GuidedTourProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/telemetry/TelemetryProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelemetryProvider",
    ()=>TelemetryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
let configured = false;
function TelemetryProvider({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TelemetryProvider.useEffect": ()=>{
            if (configured) {
                return;
            }
            configured = true;
            void __turbopack_context__.A("[project]/Desktop/Bmad-Method/apps/web/telemetry/init.ts [app-client] (ecmascript, async loader)").then({
                "TelemetryProvider.useEffect": async (module)=>{
                    const runtime = await module.initTelemetry();
                    if (!runtime) {
                        console.info('[Telemetry] Telemetria não será inicializada (desativada ou indisponível no ambiente atual).');
                        return;
                    }
                    const { registerAnalyticsInstrumentation } = await __turbopack_context__.A("[project]/Desktop/Bmad-Method/apps/web/telemetry/analytics.ts [app-client] (ecmascript, async loader)");
                    registerAnalyticsInstrumentation(runtime);
                }
            }["TelemetryProvider.useEffect"]);
        }
    }["TelemetryProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(TelemetryProvider, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = TelemetryProvider;
var _c;
__turbopack_context__.k.register(_c, "TelemetryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/catalog.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFallbackLocale",
    ()=>getFallbackLocale,
    "listSupportedLocales",
    ()=>listSupportedLocales,
    "loadLocaleMessages",
    ()=>loadLocaleMessages,
    "normalizeLocaleCode",
    ()=>normalizeLocaleCode
]);
const FALLBACK_LOCALE = 'en';
const LOCALE_LOADERS = {
    en: async ()=>(await __turbopack_context__.A("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/locales/en.json (json, async loader)")).default,
    'pt-BR': async ()=>(await __turbopack_context__.A("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/locales/pt-BR.json (json, async loader)")).default
};
const LOCALE_ALIASES = {
    en: 'en',
    'en-us': 'en',
    'en-gb': 'en',
    pt: 'pt-BR',
    'pt-br': 'pt-BR',
    'pt-pt': 'pt-BR',
    'pt_br': 'pt-BR'
};
const catalogCache = new Map();
function normalizeLocaleCode(input) {
    if (!input) {
        return FALLBACK_LOCALE;
    }
    const normalized = input.trim();
    if (!normalized) {
        return FALLBACK_LOCALE;
    }
    const lookupKey = normalized.toLowerCase();
    if (lookupKey in LOCALE_ALIASES) {
        return LOCALE_ALIASES[lookupKey];
    }
    if (LOCALE_LOADERS[normalized]) {
        return normalized;
    }
    return FALLBACK_LOCALE;
}
function getFallbackLocale() {
    return FALLBACK_LOCALE;
}
function listSupportedLocales() {
    return Object.keys(LOCALE_LOADERS);
}
async function loadLocaleMessages(locale) {
    const normalized = normalizeLocaleCode(locale);
    if (!catalogCache.has(normalized)) {
        const loader = LOCALE_LOADERS[normalized];
        catalogCache.set(normalized, loader().catch(async ()=>{
            if (normalized !== FALLBACK_LOCALE) {
                return LOCALE_LOADERS[FALLBACK_LOCALE]();
            }
            return {};
        }));
    }
    return catalogCache.get(normalized);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/translator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "translate",
    ()=>translate
]);
function isDictionary(value) {
    return typeof value === 'object' && value !== null;
}
function resolveMessage(dictionary, key) {
    const segments = key.split('.');
    let current = dictionary;
    for (const segment of segments){
        if (!isDictionary(current)) {
            return undefined;
        }
        if (!(segment in current)) {
            return undefined;
        }
        current = current[segment];
    }
    return typeof current === 'string' ? current : undefined;
}
function stringifyValue(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return String(value);
}
function formatTemplate(template, values) {
    if (!values) {
        return template;
    }
    return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, token)=>{
        if (!(token in values)) {
            return match;
        }
        return stringifyValue(values[token]);
    });
}
function translate(messages, fallbackMessages, key, values) {
    const primary = messages ? resolveMessage(messages, key) : undefined;
    const fallback = !primary && fallbackMessages ? resolveMessage(fallbackMessages, key) : undefined;
    const resolved = primary ?? fallback;
    if (!resolved) {
        return key;
    }
    return formatTemplate(resolved, values);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/locales/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"skipToMainContent":"Skip to main content","loading":{"navigation":"Preparing navigation context…"}},"auth":{"login":{"cardTitle":"Authentication","cardDescription":"Sign in to the platform with strengthened MFA.","labels":{"email":"Corporate email","password":"Password"},"errors":{"missingCredentials":"Provide your email and password.","coreFailure":"Authentication failed. Check your credentials.","unexpected":"Unexpected error while contacting the API."},"success":{"sessionStarted":"Session started for agent #{{agentId}}. Expires in {{minutes}} minutes."},"actions":{"submit":"Sign in","submitting":"Validating…"},"links":{"recoverPrompt":"Lost access to the second factor?","recoverCta":"Start recovery"}},"mfa":{"invalidSessionTitle":"MFA validation","invalidSessionDescription":"Invalid session","invalidSessionBody":"We did not receive a valid session identifier. Return to the <link>login screen</link> to restart the flow.","cardTitle":"Confirm second factor","cardDescription":"Enter the 6-digit code or use a recovery code.","methodLegend":"Method","methods":{"totp":"Authenticator code","recovery":"Recovery code"},"placeholders":{"totp":"000000","recovery":"ABCDE-12345"},"errors":{"missingCode":"Provide the authenticator or recovery code.","invalidCode":"Invalid code. Try again.","unexpected":"We were unable to validate MFA."},"success":{"confirmed":"MFA confirmed successfully. You can continue."},"actions":{"submit":"Confirm MFA","submitting":"Validating…"},"links":{"recover":"Request recovery","needNewCodes":"Need new codes?"}},"recover":{"generateCardTitle":"Generate new codes","generateCardDescription":"Produces a new set of recovery codes with immediate validity.","completeCardTitle":"Complete recovery","completeCardDescription":"Use one of the issued codes to create an authenticated session.","labels":{"agentEmail":"Agent email","recoveryCode":"Recovery code"},"errors":{"missingEmail":"Provide the email associated with the agent.","missingEmailAndCode":"Provide email and recovery code.","generateFailure":"Unable to generate new codes.","generateUnexpected":"Unexpected failure while contacting the API.","completeInvalid":"Invalid or expired code.","completeUnexpected":"Recovery could not be completed."},"feedback":{"generatedAt":"Store these codes safely. Issued at {{issuedAt}}.","completeSuccess":"Recovery completed. <link>Return to login</link> to start a new session."},"actions":{"generate":"Generate codes","generating":"Generating…","complete":"Complete recovery","completing":"Validating…"}}},"housekeeping":{"status":{"pending":"Pending","in_progress":"In progress","completed":"Completed","blocked":"Blocked"},"errors":{"offline":"Offline mode enabled. Real-time data will sync when the connection returns.","fetchUnavailable":"Housekeeping service unavailable. Try again shortly.","fetchFailed":"We could not load housekeeping tasks for this property.","fetchUnexpected":"An unexpected error occurred while loading tasks.","slaOffline":"SLA monitoring is not available in offline mode.","slaUnavailable":"Unable to refresh partner SLAs. Service unavailable.","slaFailed":"Failed to load SLAs. Try again later.","slaUnexpected":"Unexpected error while loading partner SLAs.","mutationUnavailable":"Sync unavailable. Try again shortly.","mutationFailed":"Unable to update the task in core.","mutationUnexpected":"An error occurred while updating the task."},"sections":{"main":{"title":"Housekeeping","subtitle":"Daily planning with offline-first support"},"connection":{"title":"Connection status","description":"Monitor pending tasks and scheduled syncs.","offline":"Offline mode enabled. Completed tasks will sync automatically once connectivity is restored.","online":"Online. Automatic sync every 2 minutes plus manual sync available."},"sla":{"title":"Partner SLAs","subtitle":"Operational alerts with support partners"},"tasks":{"title":"Housekeeping tasks","subtitle":"Prioritised assignments with core data"},"operations":{"title":"Real-time operations","subtitle":"Syncs and metrics for managers"}},"loading":{"title":"Syncing tasks","description":"Fetching the latest assignments.","body":"Loading data from the core service..."},"loadingError":{"title":"Unable to load tasks","body":"Check connectivity or try again shortly."},"empty":{"title":"No tasks visible","description":"No housekeeping tasks found for the requested period.","body":"Adjust API filters to retrieve a different result set."},"taskCard":{"title":"Task #{{id}}","scheduled":"Scheduled for {{date}}","reservation":"Reservation: {{value}}","reservationFallback":"Unlinked","assignee":"Assignee: {{value}}","assigneeFallback":"Unassigned","notes":"Notes: {{value}}","notesFallback":"No additional notes.","reopen":"Reopen task","complete":"Mark as completed","syncing":"Syncing…"},"sla":{"loadingTitle":"Tracking partner SLAs","loadingDescription":"Synchronising response and resolution indicators.","loadingBody":"Loading SLA indicators…","errorTitle":"SLAs unavailable","errorDescription":"Check with the integrations team to confirm the connection state.","emptyTitle":"No SLAs configured","emptyDescription":"No active SLA is associated with housekeeping partners.","emptyBody":"Update partner records to display alerts in this panel."},"queue":{"title":"Offline queue","description":"Track pending mutations for the core service","offline":"Offline mode enabled. Submissions will resume automatically.","syncing":"Synchronising with core.","online":"Online. No blockers to sync changes.","empty":"No pending actions.","action":"Sync now","actionSyncing":"Syncing…"},"metrics":{"loadingTitle":"Waiting for sync","loadingBody":"Refreshing indicators with the most recent data...","errorTitle":"Indicators unavailable","efficiencyTitle":"Efficiency indicators","efficiency":{"total":"Total registered in core: {{value}}","visible":"Tasks in this view: {{value}}","backlog":"Active backlog: {{value}}","completed":"Completed: {{value}}","page":"Current page: {{page}}/{{pages}}","updatedAt":"Last updated: {{value}}"},"upcomingTitle":"Upcoming executions","upcomingItem":"#{{id}} · {{date}} · {{status}}","noUpcoming":"No tasks scheduled for the selected window."},"queueUpdate":"Task #{{id}} → {{status}}"},"owners":{"overview":{"section":{"title":"Owner financial overview","subtitle":"Financial and operational indicators updated every 15 minutes"},"errors":{"loadFailed":"Failed to load owner data. Contact support for assistance.","updateFailed":"Unable to update payout preferences right now.","uploadMissing":"Select a valid document before submitting.","uploadFailed":"Document upload failed. Try again."},"loading":"Loading consolidated data…","cards":{"occupancy":{"title":"Occupancy rate","description":"Last 30 days","properties":"{{count}} active properties"},"revenue":{"title":"Accumulated revenue","description":"Current month","adr":"Average daily rate {{value}}"},"compliance":{"title":"Compliance","description":"KYC reviews and audits","clear":"Compliant","pending":"Review pending","summary":"{{pending}} verifications remaining · {{documents}} documents delivered"},"payout":{"title":"Payout preferences","description":"Update banking details and settlement frequency.","success":"Payout preferences updated successfully.","labels":{"beneficiary":"Beneficiary","method":"Method","lastDigits":"Last 4 account digits","currency":"Currency","threshold":"Minimum payout amount","schedule":"Frequency"},"options":{"bank_transfer":"Bank transfer","pix":"PIX (Brazil)","paypal":"PayPal","monthly":"Monthly","weekly":"Weekly"},"submit":"Save preferences"},"documents":{"title":"Verification documents","description":"Upload corporate records, bank proofs or ID.","labels":{"type":"Document type","file":"File"},"options":{"identidade":"Identity","comprovativo-bancario":"Bank proof","contrato-social":"Corporate charter"},"submit":"Submit document","success":"Document submitted and sent for manual review."},"notifications":{"title":"Alerts and notifications","description":"Most recent events in the owner portal.","empty":"No notifications right now.","meta":"{{timestamp}} · {{category}}"}}}}});}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/locales/pt-BR.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"skipToMainContent":"Saltar para o conteúdo principal","loading":{"navigation":"A preparar contexto de navegação…"}},"auth":{"login":{"cardTitle":"Autenticação","cardDescription":"Aceda à plataforma com MFA reforçado.","labels":{"email":"Email corporativo","password":"Palavra-passe"},"errors":{"missingCredentials":"Informe email e palavra-passe.","coreFailure":"Falha na autenticação. Verifique as credenciais.","unexpected":"Erro inesperado ao contactar a API."},"success":{"sessionStarted":"Sessão iniciada para o agente #{{agentId}}. Expira em {{minutes}} minutos."},"actions":{"submit":"Entrar","submitting":"A validar…"},"links":{"recoverPrompt":"Perdeu acesso ao segundo fator?","recoverCta":"Inicie a recuperação"}},"mfa":{"invalidSessionTitle":"Validação MFA","invalidSessionDescription":"Sessão inválida","invalidSessionBody":"Não recebemos um identificador de sessão válido. Regresse ao <link>ecrã de login</link> para reiniciar o processo.","cardTitle":"Validar segundo fator","cardDescription":"Introduza o código de 6 dígitos ou utilize um código de recuperação.","methodLegend":"Método","methods":{"totp":"Código do autenticador","recovery":"Código de recuperação"},"placeholders":{"totp":"000000","recovery":"ABCDE-12345"},"errors":{"missingCode":"Informe o código enviado pelo autenticador ou recovery.","invalidCode":"Código inválido. Tente novamente.","unexpected":"Não foi possível validar o MFA."},"success":{"confirmed":"MFA confirmado com sucesso. Está pronto para avançar."},"actions":{"submit":"Confirmar MFA","submitting":"A validar…"},"links":{"recover":"Solicitar recuperação","needNewCodes":"Precisa de novos códigos?"}},"recover":{"generateCardTitle":"Gerar novos códigos","generateCardDescription":"Produz um novo conjunto de códigos de recuperação com validade imediata.","completeCardTitle":"Concluir recuperação","completeCardDescription":"Use um dos códigos emitidos para criar uma sessão autenticada.","labels":{"agentEmail":"Email do agente","recoveryCode":"Código de recuperação"},"errors":{"missingEmail":"Informe o email associado ao agente.","missingEmailAndCode":"Informe email e código de recuperação.","generateFailure":"Não foi possível gerar novos códigos.","generateUnexpected":"Falha inesperada ao contactar a API.","completeInvalid":"Código inválido ou expirado.","completeUnexpected":"Não foi possível concluir a recuperação."},"feedback":{"generatedAt":"Guardar estes códigos num local seguro. Emitidos em {{issuedAt}}.","completeSuccess":"Recuperação concluída. <link>Regresse ao login</link> para iniciar uma nova sessão."},"actions":{"generate":"Gerar códigos","generating":"Gerando…","complete":"Concluir recuperação","completing":"Validando…"}}},"housekeeping":{"status":{"pending":"Pendente","in_progress":"Em progresso","completed":"Concluída","blocked":"Bloqueada"},"errors":{"offline":"Modo offline ativo. Dados em tempo real serão sincronizados quando a ligação for restabelecida.","fetchUnavailable":"Serviço de housekeeping indisponível. Tente novamente em instantes.","fetchFailed":"Não foi possível carregar as tarefas de housekeeping para esta propriedade.","fetchUnexpected":"Ocorreu um erro inesperado ao carregar as tarefas.","slaOffline":"Monitorização de SLA indisponível em modo offline.","slaUnavailable":"Não foi possível atualizar os SLAs dos parceiros. Serviço indisponível.","slaFailed":"Falha ao carregar SLAs. Tente novamente mais tarde.","slaUnexpected":"Ocorreu um erro inesperado ao carregar os SLAs dos parceiros.","mutationUnavailable":"Sincronização indisponível. Tente novamente em instantes.","mutationFailed":"Não foi possível atualizar a tarefa no core.","mutationUnexpected":"Ocorreu um erro ao atualizar a tarefa."},"sections":{"main":{"title":"Housekeeping","subtitle":"Planeamento diário com suporte offline-first"},"connection":{"title":"Estado da conexão","description":"Monitorize tarefas pendentes e sincronizações agendadas.","offline":"Modo offline ativo. As tarefas concluídas serão sincronizadas automaticamente quando a conexão retornar.","online":"Online. Sincronização automática a cada 2 minutos e sincronização manual disponível."},"sla":{"title":"SLAs dos parceiros","subtitle":"Alertas operacionais com parceiros de apoio"},"tasks":{"title":"Tarefas de housekeeping","subtitle":"Atribuições priorizadas com dados do core"},"operations":{"title":"Operação em tempo real","subtitle":"Sincronizações e métricas para gestores"}},"loading":{"title":"Sincronizando tarefas","description":"Aguarde enquanto buscamos as atribuições mais recentes.","body":"Carregando dados do serviço core..."},"loadingError":{"title":"Não foi possível carregar as tarefas","body":"Verifique a ligação ou tente novamente em alguns instantes."},"empty":{"title":"Nenhuma tarefa visível","description":"Nenhuma tarefa de housekeeping foi encontrada para o período consultado.","body":"Configure filtros adicionais na API para obter um conjunto diferente de resultados."},"taskCard":{"title":"Tarefa #{{id}}","scheduled":"Agendado para {{date}}","reservation":"Reserva: {{value}}","reservationFallback":"Sem ligação","assignee":"Responsável: {{value}}","assigneeFallback":"Não atribuído","notes":"Observações: {{value}}","notesFallback":"Sem notas adicionais.","reopen":"Reabrir tarefa","complete":"Marcar como concluída","syncing":"Sincronizando…"},"sla":{"loadingTitle":"Acompanhar SLAs de parceiros","loadingDescription":"Sincronizando indicadores de resposta e resolução.","loadingBody":"Carregando indicadores de SLA…","errorTitle":"SLAs indisponíveis","errorDescription":"Consulte o time de integrações para confirmar o estado da conexão.","emptyTitle":"Sem SLAs configurados","emptyDescription":"Nenhum SLA ativo foi associado aos parceiros de housekeeping.","emptyBody":"Atualize os cadastros de parceiros para acompanhar alertas neste painel."},"queue":{"title":"Fila offline","description":"Acompanhe mutações pendentes para o serviço core","offline":"Modo offline ativo. Os envios serão retomados automaticamente.","syncing":"Sincronização em andamento com o core.","online":"Online. Nenhum bloqueio para sincronizar as alterações.","empty":"Sem ações pendentes.","action":"Sincronizar agora","actionSyncing":"Sincronizando…"},"metrics":{"loadingTitle":"Aguardando sincronização","loadingBody":"Actualizando indicadores com os dados mais recentes...","errorTitle":"Indicadores indisponíveis","efficiencyTitle":"Indicadores de eficiência","efficiency":{"total":"Total registado no core: {{value}}","visible":"Tarefas nesta vista: {{value}}","backlog":"Backlog activo: {{value}}","completed":"Concluídas: {{value}}","page":"Página actual: {{page}}/{{pages}}","updatedAt":"Última atualização: {{value}}"},"upcomingTitle":"Próximas execuções","upcomingItem":"#{{id}} · {{date}} · {{status}}","noUpcoming":"Nenhuma tarefa agendada no intervalo consultado."},"queueUpdate":"Tarefa #{{id}} → {{status}}"},"owners":{"overview":{"section":{"title":"Overview financeiro do proprietário","subtitle":"Indicadores financeiros e operacionais actualizados a cada 15 minutos"},"errors":{"loadFailed":"Falha ao carregar dados do proprietário. Utilize o suporte para obter ajuda.","updateFailed":"Não foi possível actualizar preferências de pagamento neste momento.","uploadMissing":"Selecione um documento válido antes de enviar.","uploadFailed":"Falha ao submeter documento. Tente novamente."},"loading":"A carregar dados consolidados…","cards":{"occupancy":{"title":"Taxa de ocupação","description":"Últimos 30 dias","properties":"{{count}} propriedades activas"},"revenue":{"title":"Receita acumulada","description":"Mês corrente","adr":"ADR médio {{value}}"},"compliance":{"title":"Compliance","description":"Revisões KYC e auditorias","clear":"Em conformidade","pending":"Revisão pendente","summary":"{{pending}} verificações por concluir · {{documents}} documentos entregues"},"payout":{"title":"Preferências de pagamento","description":"Actualize dados bancários e frequência de liquidação.","success":"Preferências de pagamento actualizadas com sucesso.","labels":{"beneficiary":"Beneficiário","method":"Método","lastDigits":"Últimos 4 dígitos da conta","currency":"Moeda","threshold":"Valor mínimo por pagamento","schedule":"Periodicidade"},"options":{"bank_transfer":"Transferência bancária","pix":"PIX (Brasil)","paypal":"PayPal","monthly":"Mensal","weekly":"Semanal"},"submit":"Guardar preferências"},"documents":{"title":"Documentos de verificação","description":"Envie contratos sociais, comprovativos bancários ou identidade.","labels":{"type":"Tipo de documento","file":"Ficheiro"},"options":{"identidade":"Identidade","comprovativo-bancario":"Comprovativo bancário","contrato-social":"Contrato social"},"submit":"Submeter documento","success":"Documento submetido e encaminhado para verificação manual."},"notifications":{"title":"Alertas e notificações","description":"Eventos mais recentes do portal do proprietário.","empty":"Nenhuma notificação no momento.","meta":"{{timestamp}} · {{category}}"}}}}});}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nProvider",
    ()=>I18nProvider,
    "useI18nContext",
    ()=>useI18nContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/catalog.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$translator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/translator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$locales$2f$en$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/locales/en.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$locales$2f$pt$2d$BR$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/locales/pt-BR.json (json)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const STATIC_MESSAGES = {
    en: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$locales$2f$en$2e$json__$28$json$29$__["default"],
    'pt-BR': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$locales$2f$pt$2d$BR$2e$json__$28$json$29$__["default"]
};
const I18nContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function determineInitialLocale(initialLocale) {
    if (initialLocale) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(initialLocale);
    }
    if (typeof document !== 'undefined' && document.documentElement?.lang) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(document.documentElement.lang);
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(navigator.language);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFallbackLocale"])();
}
function I18nProvider({ initialLocale, children }) {
    _s();
    const initialResolvedLocale = determineInitialLocale(initialLocale);
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialResolvedLocale);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(STATIC_MESSAGES[initialResolvedLocale] ?? null);
    const [fallbackMessages, setFallbackMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(STATIC_MESSAGES[(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFallbackLocale"])()] ?? null);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Boolean(STATIC_MESSAGES[initialResolvedLocale]));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "I18nProvider.useEffect": ()=>{
            let mounted = true;
            setReady(false);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadLocaleMessages"])(locale).then({
                "I18nProvider.useEffect": (loaded)=>{
                    if (mounted) {
                        setMessages(loaded);
                        setReady(true);
                    }
                }
            }["I18nProvider.useEffect"]).catch({
                "I18nProvider.useEffect": ()=>{
                    if (mounted) {
                        setMessages(null);
                        setReady(true);
                    }
                }
            }["I18nProvider.useEffect"]);
            return ({
                "I18nProvider.useEffect": ()=>{
                    mounted = false;
                }
            })["I18nProvider.useEffect"];
        }
    }["I18nProvider.useEffect"], [
        locale
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "I18nProvider.useEffect": ()=>{
            let mounted = true;
            const fallbackLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFallbackLocale"])();
            if (STATIC_MESSAGES[fallbackLocale]) {
                setFallbackMessages(STATIC_MESSAGES[fallbackLocale] ?? null);
                return ({
                    "I18nProvider.useEffect": ()=>{
                        mounted = false;
                    }
                })["I18nProvider.useEffect"];
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadLocaleMessages"])(fallbackLocale).then({
                "I18nProvider.useEffect": (loaded)=>{
                    if (mounted) {
                        setFallbackMessages(loaded);
                    }
                }
            }["I18nProvider.useEffect"]).catch({
                "I18nProvider.useEffect": ()=>{
                    if (mounted) {
                        setFallbackMessages(null);
                    }
                }
            }["I18nProvider.useEffect"]);
            return ({
                "I18nProvider.useEffect": ()=>{
                    mounted = false;
                }
            })["I18nProvider.useEffect"];
        }
    }["I18nProvider.useEffect"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "I18nProvider.useMemo[value]": ()=>{
            return {
                locale,
                ready,
                setLocale: ({
                    "I18nProvider.useMemo[value]": (next)=>setLocaleState((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(next))
                })["I18nProvider.useMemo[value]"],
                t: ({
                    "I18nProvider.useMemo[value]": (key, values)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$translator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translate"])(messages, fallbackMessages, key, values)
                })["I18nProvider.useMemo[value]"]
            };
        }
    }["I18nProvider.useMemo[value]"], [
        locale,
        ready,
        messages,
        fallbackMessages
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(I18nContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx",
        lineNumber: 112,
        columnNumber: 10
    }, this);
}
_s(I18nProvider, "HmPwGAFhmfYtGrUenYfrR2oYQBc=");
_c = I18nProvider;
function useI18nContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(I18nContext);
    if (!context) {
        throw new Error('useI18nContext must be used within I18nProvider');
    }
    return context;
}
_s1(useI18nContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "I18nProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTranslation",
    ()=>useTranslation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useTranslation(namespace) {
    _s();
    const { locale, ready, setLocale, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18nContext"])();
    const translate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTranslation.useCallback[translate]": (key, values)=>{
            const scopedKey = namespace ? `${namespace}.${key}` : key;
            return t(scopedKey, values);
        }
    }["useTranslation.useCallback[translate]"], [
        namespace,
        t
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useTranslation.useMemo": ()=>({
                locale,
                ready,
                t: translate,
                setLocale
            })
    }["useTranslation.useMemo"], [
        locale,
        ready,
        translate,
        setLocale
    ]);
}
_s(useTranslation, "GIiEJCEMhu2uBNJ6pBnAjkQCz3I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18nContext"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/catalog.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/tenant-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TenantProvider",
    ()=>TenantProvider,
    "useTenant",
    ()=>useTenant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const TenantContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function resolveInitialMode() {
    const scope = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_TENANT_SCOPE;
    return scope === 'platform' ? 'platform' : 'tenant';
}
function resolveInitialTenant() {
    const slug = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_TENANT_SLUG;
    if (!slug) {
        return undefined;
    }
    return {
        slug,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_TENANT_NAME ?? slug
    };
}
function TenantProvider({ children, tenant, mode, platformToken, capabilities }) {
    _s();
    const resolvedMode = mode ?? resolveInitialMode();
    const resolvedTenant = tenant ?? resolveInitialTenant();
    const resolvedToken = platformToken ?? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_TENANT_PLATFORM_TOKEN ?? null;
    const resolvedTenantSlug = resolvedTenant?.slug;
    const buildHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TenantProvider.useCallback[buildHeaders]": (options)=>{
            const headers = {};
            const targetScope = options?.scope ?? resolvedMode;
            const overrideSlug = options?.tenantSlug;
            if (targetScope === 'platform') {
                headers['x-tenant-scope'] = 'platform';
                if (resolvedToken) {
                    headers['x-tenant-platform-token'] = resolvedToken;
                }
                if (overrideSlug) {
                    headers['x-tenant-slug'] = overrideSlug;
                }
            } else {
                const activeSlug = overrideSlug ?? resolvedTenantSlug;
                if (activeSlug) {
                    headers['x-tenant-slug'] = activeSlug;
                }
            }
            return headers;
        }
    }["TenantProvider.useCallback[buildHeaders]"], [
        resolvedMode,
        resolvedTenantSlug,
        resolvedToken
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TenantProvider.useMemo[value]": ()=>{
            const resolvedCapabilities = {
                canViewAggregatedReports: resolvedMode === 'platform',
                canProvisionWorkspaces: resolvedMode === 'platform',
                ...capabilities
            };
            return {
                mode: resolvedMode,
                tenant: resolvedTenant,
                platformToken: resolvedToken,
                capabilities: resolvedCapabilities,
                buildHeaders
            };
        }
    }["TenantProvider.useMemo[value]"], [
        buildHeaders,
        capabilities,
        resolvedMode,
        resolvedTenant,
        resolvedToken
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TenantContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/lib/tenant-context.tsx",
        lineNumber: 110,
        columnNumber: 10
    }, this);
}
_s(TenantProvider, "h86IiryM1OdSzYKtsB02lErSSPA=");
_c = TenantProvider;
function useTenant() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TenantContext);
    if (!context) {
        throw new Error('TenantProvider não encontrado no contexto da aplicação');
    }
    return context;
}
_s1(useTenant, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "TenantProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const STORAGE_KEY = 'bmad-theme-preference';
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function applyThemeClass(theme) {
    if (typeof document === 'undefined') {
        return;
    }
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
}
function getSystemTheme() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function ThemeProvider({ children }) {
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const [hasExplicitPreference, setHasExplicitPreference] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isMountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isTestEnv = ("TURBOPACK compile-time value", "development") === 'test';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === 'light' || stored === 'dark') {
                setThemeState(stored);
                setHasExplicitPreference(true);
                applyThemeClass(stored);
            } else {
                const systemTheme = getSystemTheme();
                setThemeState(systemTheme);
                applyThemeClass(systemTheme);
            }
            isMountedRef.current = true;
        }
    }["ThemeProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (!isMountedRef.current || ("TURBOPACK compile-time value", "object") === 'undefined') {
                return;
            }
            applyThemeClass(theme);
            if (hasExplicitPreference) {
                window.localStorage.setItem(STORAGE_KEY, theme);
            } else {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        }
    }["ThemeProvider.useEffect"], [
        theme,
        hasExplicitPreference
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = {
                "ThemeProvider.useEffect.handler": (event)=>{
                    if (!hasExplicitPreference) {
                        setThemeState(event.matches ? 'dark' : 'light');
                    }
                }
            }["ThemeProvider.useEffect.handler"];
            mediaQuery.addEventListener('change', handler);
            return ({
                "ThemeProvider.useEffect": ()=>mediaQuery.removeEventListener('change', handler)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], [
        hasExplicitPreference
    ]);
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThemeProvider.useMemo[contextValue]": ()=>{
            const setTheme = {
                "ThemeProvider.useMemo[contextValue].setTheme": (next)=>{
                    setHasExplicitPreference(true);
                    setThemeState(next);
                }
            }["ThemeProvider.useMemo[contextValue].setTheme"];
            const toggleTheme = {
                "ThemeProvider.useMemo[contextValue].toggleTheme": ()=>{
                    setHasExplicitPreference(true);
                    setThemeState({
                        "ThemeProvider.useMemo[contextValue].toggleTheme": (current)=>current === 'light' ? 'dark' : 'light'
                    }["ThemeProvider.useMemo[contextValue].toggleTheme"]);
                }
            }["ThemeProvider.useMemo[contextValue].toggleTheme"];
            return {
                theme,
                toggleTheme,
                setTheme,
                hasExplicitPreference
            };
        }
    }["ThemeProvider.useMemo[contextValue]"], [
        theme,
        hasExplicitPreference
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeProvider.tsx",
        lineNumber: 119,
        columnNumber: 10
    }, this);
}
_s(ThemeProvider, "3fZQEk2geAa3zZwURHaA0W73ZuI=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$telemetry$2f$TelemetryProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/telemetry/TelemetryProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$tenant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/tenant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$theme$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
function NavigationFallback() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])('common.loading');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "sr-only",
        children: t('navigation')
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_s(NavigationFallback, "zlIdU9EjM2llFt74AbE2KsUJXyM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = NavigationFallback;
function Providers({ children, initialLocale }) {
    _s1();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Providers.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1,
                        staleTime: 60_000
                    },
                    mutations: {
                        retry: 1
                    }
                }
            })
    }["Providers.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I18nProvider"], {
        initialLocale: initialLocale,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationFallback, {}, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                lineNumber: 43,
                columnNumber: 27
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$telemetry$2f$TelemetryProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TelemetryProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
                    client: queryClient,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$tenant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TenantProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsProvider"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflineProvider"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$theme$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GuidedTourProvider"], {
                                        children: children
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                                        lineNumber: 50,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                                    lineNumber: 49,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                                lineNumber: 48,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                            lineNumber: 47,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s1(Providers, "eguN7WScDIJCSG/BAKuvUrFrFls=");
_c1 = Providers;
var _c, _c1;
__turbopack_context__.k.register(_c, "NavigationFallback");
__turbopack_context__.k.register(_c1, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflineBanner",
    ()=>OfflineBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function OfflineBanner() {
    _s();
    const { isOffline, lastChangedAt, pendingActions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOffline"])();
    const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OfflineBanner.useMemo[description]": ()=>{
            if (!isOffline && !lastChangedAt) return 'Conectado';
            if (!isOffline && lastChangedAt) {
                return `Conexão restabelecida há ${(Date.now() - lastChangedAt) / 1000 < 60 ? 'poucos segundos' : 'alguns minutos'}.`;
            }
            const pending = pendingActions.length ? `Ações pendentes: ${pendingActions.join(', ')}` : 'Sincronização automática quando a ligação voltar.';
            return `Você está offline. ${pending}`;
        }
    }["OfflineBanner.useMemo[description]"], [
        isOffline,
        lastChangedAt,
        pendingActions
    ]);
    if (!isOffline && !lastChangedAt) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-live": "polite",
        "data-offline": isOffline,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
            [
                "35333b98a60f013",
                [
                    isOffline ? 'var(--color-coral)' : 'var(--color-soft-aqua)'
                ]
            ]
        ]) + " " + "offline-banner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                    [
                        "35333b98a60f013",
                        [
                            isOffline ? 'var(--color-coral)' : 'var(--color-soft-aqua)'
                        ]
                    ]
                ]),
                children: isOffline ? '⛔' : '✅'
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineBanner.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                    [
                        "35333b98a60f013",
                        [
                            isOffline ? 'var(--color-coral)' : 'var(--color-soft-aqua)'
                        ]
                    ]
                ]),
                children: description
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineBanner.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "35333b98a60f013",
                dynamic: [
                    isOffline ? 'var(--color-coral)' : 'var(--color-soft-aqua)'
                ],
                children: `.offline-banner.__jsx-style-dynamic-selector{gap:var(--space-3);background:${isOffline ? 'var(--color-coral)' : 'var(--color-soft-aqua)'};color:#fff;padding:var(--space-3)var(--space-4);border-radius:var(--radius-sm);box-shadow:var(--shadow-card);grid-template-columns:auto 1fr;align-items:center;display:grid}.offline-banner.__jsx-style-dynamic-selector p.__jsx-style-dynamic-selector{margin:0;font-weight:500}`
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineBanner.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(OfflineBanner, "KJOxn7AGo9hkZQ0IqL7hwalkoWk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOffline"]
    ];
});
_c = OfflineBanner;
var _c;
__turbopack_context__.k.register(_c, "OfflineBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainNav",
    ()=>MainNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/calendar-check.js [app-client] (ecmascript) <export default as CalendarCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/chart-line.js [app-client] (ecmascript) <export default as LineChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/workflow.js [app-client] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const slugify = (value)=>value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const NAV_SECTIONS = [
    {
        heading: 'Operação diária',
        items: [
            {
                href: '/',
                label: 'Dashboard',
                description: 'Resumo diário de ocupação e alertas críticos',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
            },
            {
                href: '/reservas',
                label: 'Reservas',
                description: 'Fluxos de check-in/out e ajustes de estadia',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarCheck$3e$__["CalendarCheck"]
            },
            {
                href: '/calendario',
                label: 'Calendário',
                description: 'Disponibilidade por unidade e sincronização OTA',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"]
            },
            {
                href: '/housekeeping',
                label: 'Housekeeping',
                description: 'Atribuição de tarefas, incidentes e auditorias',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"]
            },
            {
                href: '/faturacao',
                label: 'Faturação',
                description: 'Checkout, notas de crédito e reconciliações',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"]
            }
        ]
    },
    {
        heading: 'Produtos e experiências',
        items: [
            {
                href: '/owners',
                label: 'Portal Proprietários',
                description: 'Painel de partilha de resultados e documentos',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
            },
            {
                href: '/onboarding',
                label: 'Onboarding',
                description: 'Wizard guiado para novas propriedades e equipas',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"]
            },
            {
                href: '/mobile/housekeeping',
                label: 'App Housekeeping',
                description: 'Execução mobile com suporte offline',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"]
            },
            {
                href: '/mobile/gestor',
                label: 'App Gestor',
                description: 'KPIs móveis e aprovações rápidas',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__["LineChart"]
            }
        ]
    },
    {
        heading: 'Automação e inteligência',
        items: [
            {
                href: '/agentes',
                label: 'Catálogo de Agentes',
                description: 'Bots operacionais por módulo e contexto',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"]
            },
            {
                href: '/playbooks',
                label: 'Playbooks Automatizados',
                description: 'Fluxos configurados e monitorização de adoção',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"]
            },
            {
                href: '/recommendations',
                label: 'Recomendações',
                description: 'Sugestões de upsell e alertas gerados por IA',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"]
            }
        ]
    },
    {
        heading: 'Governança e suporte',
        items: [
            {
                href: '/observabilidade',
                label: 'Observabilidade',
                description: 'Logs, métricas e tracing da operação',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"]
            },
            {
                href: '/governanca',
                label: 'Governança',
                description: 'Políticas, auditoria e controlos de acesso',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
            },
            {
                href: '/analytics',
                label: 'Analytics',
                description: 'Dashboards avançados e relatórios exportáveis',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
            },
            {
                href: '/support/knowledge-base',
                label: 'Base de Conhecimento',
                description: 'Guias, SOPs e artigos de apoio',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
            }
        ]
    }
];
function MainNav() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Navegação principal",
        className: "jsx-c169c0702576a1fa" + " " + "main-nav",
        children: [
            NAV_SECTIONS.map((section, index)=>{
                const headingId = `main-nav-section-${index}`;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    "aria-labelledby": headingId,
                    className: "jsx-c169c0702576a1fa" + " " + "main-nav__section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            id: headingId,
                            className: "jsx-c169c0702576a1fa" + " " + "main-nav__heading",
                            children: section.heading
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "jsx-c169c0702576a1fa",
                            children: section.items.map((item)=>{
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                const tooltipId = `nav-tooltip-${slugify(item.href)}-${slugify(item.label)}`;
                                const Icon = item.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "jsx-c169c0702576a1fa" + " " + "main-nav__item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.href,
                                            "aria-current": isActive ? 'page' : undefined,
                                            "data-active": isActive ? 'true' : 'false',
                                            "aria-describedby": tooltipId,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-hidden": "true",
                                                    className: "jsx-c169c0702576a1fa" + " " + "main-nav__icon",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        size: 18,
                                                        strokeWidth: 1.6,
                                                        className: "jsx-c169c0702576a1fa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-c169c0702576a1fa" + " " + "main-nav__label",
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                                            lineNumber: 170,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            role: "tooltip",
                                            id: tooltipId,
                                            className: "jsx-c169c0702576a1fa" + " " + "main-nav__tooltip",
                                            children: item.description
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                                            lineNumber: 181,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                                    lineNumber: 169,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this)
                    ]
                }, section.heading, true, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "c169c0702576a1fa",
                children: '.main-nav.jsx-c169c0702576a1fa{gap:var(--space-5);top:var(--space-4);z-index:2050;display:grid;position:sticky}.main-nav__section.jsx-c169c0702576a1fa{gap:var(--space-2);display:grid}.main-nav__heading.jsx-c169c0702576a1fa{text-transform:uppercase;letter-spacing:.12em;color:var(--color-neutral-2);margin:0;font-size:.75rem}ul.jsx-c169c0702576a1fa{gap:var(--space-2);margin:0;padding:0;list-style:none;display:grid}.main-nav__item.jsx-c169c0702576a1fa{position:relative}a.jsx-c169c0702576a1fa{align-items:center;gap:var(--space-2);padding:var(--space-3)var(--space-4);border-radius:var(--radius-sm);color:var(--color-neutral-3);background:var(--tint-neutral-soft);border:1px solid #0000;grid-template-columns:auto 1fr;font-weight:500;transition:background .2s,border .2s,transform .2s,color .2s;display:grid}a.jsx-c169c0702576a1fa:hover,a.jsx-c169c0702576a1fa:focus-visible{background:var(--tint-primary-soft);border-color:var(--tint-primary-strong);color:var(--color-deep-blue);transform:translateY(-1px)}a[data-active=true].jsx-c169c0702576a1fa{color:#fff;box-shadow:var(--shadow-card);background:linear-gradient(135deg,#2563ebf5,#0ea5e9eb)}.main-nav__icon.jsx-c169c0702576a1fa{background:var(--tint-neutral-soft);width:28px;height:28px;color:inherit;border-radius:999px;justify-content:center;align-items:center;display:inline-flex}.main-nav__label.jsx-c169c0702576a1fa{font-weight:600}.main-nav__tooltip.jsx-c169c0702576a1fa{pointer-events:none;left:calc(100% + var(--space-2));background:var(--tooltip-surface);width:min(240px,32vw);color:var(--tooltip-text);padding:var(--space-3);border-radius:var(--radius-sm);box-shadow:var(--shadow-flyout);opacity:0;transform-origin:0;font-size:.8125rem;line-height:1.45;transition:opacity .2s,transform .2s;position:absolute;top:50%;transform:translateY(-50%)}.main-nav__tooltip.jsx-c169c0702576a1fa:before{content:"";border-top:6px solid #0000;border-bottom:6px solid #0000;border-right:6px solid var(--tooltip-surface);width:0;height:0;position:absolute;top:50%;left:-6px;transform:translateY(-50%)}.main-nav__item.jsx-c169c0702576a1fa:hover .main-nav__tooltip.jsx-c169c0702576a1fa,a.jsx-c169c0702576a1fa:focus-visible+.main-nav__tooltip.jsx-c169c0702576a1fa{opacity:1;transform:translateY(-50%)translate(4px)}a[data-active=true].jsx-c169c0702576a1fa+.main-nav__tooltip.jsx-c169c0702576a1fa{background:var(--tooltip-strong)}a[data-active=true].jsx-c169c0702576a1fa .main-nav__icon.jsx-c169c0702576a1fa{background:var(--tint-neutral-strong)}@media (prefers-reduced-motion:reduce){.main-nav__tooltip.jsx-c169c0702576a1fa{transition:none}}@media (width<=960px){.main-nav.jsx-c169c0702576a1fa{position:relative;top:auto}ul.jsx-c169c0702576a1fa{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}}@media (width<=640px){.main-nav__item.jsx-c169c0702576a1fa{position:static}.main-nav__tooltip.jsx-c169c0702576a1fa{opacity:1;margin-top:var(--space-2);width:auto;position:relative;top:auto;left:0;transform:none}.main-nav__tooltip.jsx-c169c0702576a1fa:before{display:none}ul.jsx-c169c0702576a1fa{grid-template-columns:minmax(0,1fr)}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_s(MainNav, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = MainNav;
var _c;
__turbopack_context__.k.register(_c, "MainNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TourDialog",
    ()=>TourDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function TourDialog() {
    _s();
    const { isOpen, close, next, previous, steps, currentIndex, activeStep } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGuidedTour"])();
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const descriptionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const dialogRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const primaryButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const liveRegionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TourDialog.useEffect": ()=>{
            function handleKeyDown(event) {
                if (!isOpen) return;
                if (event.key === 'Escape') {
                    event.preventDefault();
                    close();
                }
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    next();
                }
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    previous();
                }
            }
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "TourDialog.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["TourDialog.useEffect"];
        }
    }["TourDialog.useEffect"], [
        close,
        isOpen,
        next,
        previous
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TourDialog.useEffect": ()=>{
            if (isOpen && primaryButtonRef.current) {
                primaryButtonRef.current.focus();
            }
        }
    }["TourDialog.useEffect"], [
        isOpen,
        currentIndex
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TourDialog.useEffect": ()=>{
            if (!isOpen || !activeStep?.target) {
                return;
            }
            const element = document.querySelector(activeStep.target);
            if (!element) {
                return;
            }
            const previousAriaDescribedBy = element.getAttribute('aria-describedby');
            const nextDescription = previousAriaDescribedBy ? `${previousAriaDescribedBy} ${descriptionId}`.trim() : descriptionId;
            element.setAttribute('data-tour-highlighted', 'true');
            element.setAttribute('aria-describedby', nextDescription);
            return ({
                "TourDialog.useEffect": ()=>{
                    element.removeAttribute('data-tour-highlighted');
                    if (previousAriaDescribedBy) {
                        element.setAttribute('aria-describedby', previousAriaDescribedBy);
                    } else {
                        element.removeAttribute('aria-describedby');
                    }
                }
            })["TourDialog.useEffect"];
        }
    }["TourDialog.useEffect"], [
        activeStep,
        descriptionId,
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TourDialog.useEffect": ()=>{
            if (!isOpen || !dialogRef.current) {
                return;
            }
            dialogRef.current.scrollIntoView({
                block: 'center'
            });
        }
    }["TourDialog.useEffect"], [
        isOpen,
        currentIndex
    ]);
    if (!isOpen || !activeStep) {
        return null;
    }
    const isLastStep = currentIndex >= steps.length - 1;
    const handleFinish = ()=>close({
            markCompleted: true
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dialogRef,
        role: "dialog",
        "aria-modal": "false",
        "aria-labelledby": titleId,
        "aria-describedby": descriptionId,
        className: "jsx-8e34dc1c71dcb818" + " " + "tour-overlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-8e34dc1c71dcb818" + " " + "tour-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-8e34dc1c71dcb818" + " " + "tour-step-counter",
                        children: [
                            "Passo ",
                            currentIndex + 1,
                            " de ",
                            steps.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: titleId,
                        className: "jsx-8e34dc1c71dcb818",
                        children: activeStep.title
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        id: descriptionId,
                        ref: liveRegionRef,
                        "aria-live": "polite",
                        className: "jsx-8e34dc1c71dcb818",
                        children: activeStep.description
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "group",
                        "aria-label": "Navegação do tour guiado",
                        className: "jsx-8e34dc1c71dcb818" + " " + "tour-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: previous,
                                disabled: currentIndex === 0,
                                className: "jsx-8e34dc1c71dcb818",
                                children: "Anterior"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            !isLastStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: next,
                                ref: primaryButtonRef,
                                className: "jsx-8e34dc1c71dcb818",
                                children: "Próximo"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleFinish,
                                ref: primaryButtonRef,
                                className: "jsx-8e34dc1c71dcb818",
                                children: "Concluir tour"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>close(),
                        "aria-label": "Fechar tour guiado",
                        className: "jsx-8e34dc1c71dcb818" + " " + "tour-close",
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "8e34dc1c71dcb818",
                children: ".tour-overlay.jsx-8e34dc1c71dcb818{padding:var(--space-6);z-index:2000;pointer-events:none;background:#2563eb99;place-items:center;display:grid;position:fixed;inset:0}.tour-content.jsx-8e34dc1c71dcb818{background:var(--color-neutral-0);border-radius:var(--radius-md);width:100%;max-width:540px;padding:var(--space-5);box-shadow:var(--shadow-card);gap:var(--space-4);pointer-events:auto;display:grid;position:relative}.tour-step-counter.jsx-8e34dc1c71dcb818{color:var(--color-neutral-2);margin:0;font-size:.875rem}.tour-actions.jsx-8e34dc1c71dcb818{gap:var(--space-3);justify-content:flex-end;display:flex}.tour-actions.jsx-8e34dc1c71dcb818 button.jsx-8e34dc1c71dcb818{border-radius:var(--radius-sm);padding:var(--space-2)var(--space-4);cursor:pointer;color:var(--color-deep-blue);border:none;border:1px solid var(--color-deep-blue);background:0 0;font-weight:600}.tour-actions.jsx-8e34dc1c71dcb818 button.jsx-8e34dc1c71dcb818:last-of-type{background:var(--color-deep-blue);color:#fff}.tour-actions.jsx-8e34dc1c71dcb818 button.jsx-8e34dc1c71dcb818:disabled{opacity:.4;cursor:not-allowed}.tour-close.jsx-8e34dc1c71dcb818{top:var(--space-2);right:var(--space-2);cursor:pointer;color:var(--color-neutral-2);background:0 0;border:none;font-size:1.5rem;position:absolute}[data-tour-highlighted=true]{outline:3px solid var(--color-soft-aqua);outline-offset:4px;border-radius:var(--radius-sm);transition:outline .2s}@media (width<=768px){.tour-overlay.jsx-8e34dc1c71dcb818,.tour-content.jsx-8e34dc1c71dcb818{padding:var(--space-4)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(TourDialog, "hRmEUZW4jaItBnaxPNFZ08+Zips=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGuidedTour"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = TourDialog;
var _c;
__turbopack_context__.k.register(_c, "TourDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$theme$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ThemeToggle({ className }) {
    _s();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$theme$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === 'dark';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: toggleTheme,
                "aria-pressed": isDark,
                title: isDark ? 'Ativar modo claro' : 'Ativar modo escuro',
                className: "jsx-6eb237bbf8ac2046" + " " + ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('theme-toggle', className) || ""),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-6eb237bbf8ac2046" + " " + "sr-only",
                        children: [
                            "Alternar modo ",
                            isDark ? 'claro' : 'escuro'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeToggle.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                        className: "theme-toggle__icon theme-toggle__icon--sun",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeToggle.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                        className: "theme-toggle__icon theme-toggle__icon--moon",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeToggle.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeToggle.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "6eb237bbf8ac2046",
                children: ".theme-toggle.jsx-6eb237bbf8ac2046{border-radius:var(--radius-sm);border:1px solid var(--app-border-subtle);background:var(--app-surface-muted);width:44px;height:44px;color:var(--color-neutral-3);justify-content:center;align-items:center;transition:background .2s,border .2s,color .2s,box-shadow .2s;display:inline-flex;position:relative}.theme-toggle.jsx-6eb237bbf8ac2046:hover,.theme-toggle.jsx-6eb237bbf8ac2046:focus-visible{background:var(--tint-neutral-soft);border-color:var(--tint-primary-strong);color:var(--color-deep-blue);box-shadow:var(--shadow-card)}.theme-toggle__icon.jsx-6eb237bbf8ac2046{width:18px;height:18px;color:inherit;transition:transform .3s,opacity .3s;position:absolute}.theme-toggle__icon--sun.jsx-6eb237bbf8ac2046{opacity:1;transform:translateY(0)}.theme-toggle__icon--moon.jsx-6eb237bbf8ac2046{opacity:0;transform:translateY(-12px)}.theme-toggle[aria-pressed=true].jsx-6eb237bbf8ac2046{color:#fbbf24}.theme-toggle[aria-pressed=true].jsx-6eb237bbf8ac2046 .theme-toggle__icon--sun.jsx-6eb237bbf8ac2046{opacity:0;transform:translateY(12px)}.theme-toggle[aria-pressed=true].jsx-6eb237bbf8ac2046 .theme-toggle__icon--moon.jsx-6eb237bbf8ac2046{opacity:1;transform:translateY(0)}@media (prefers-reduced-motion:reduce){.theme-toggle.jsx-6eb237bbf8ac2046,.theme-toggle__icon.jsx-6eb237bbf8ac2046{transition:none}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
_s(ThemeToggle, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$theme$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppChrome",
    ()=>AppChrome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$navigation$2f$MainNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$theme$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/theme/ThemeToggle.tsx [app-client] (ecmascript)");
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
const DATE_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
});
const TIME_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
    hour: '2-digit',
    minute: '2-digit'
});
function AppChrome({ children }) {
    _s();
    const { isOffline } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOffline"])();
    const now = new Date();
    const todayLabel = DATE_FORMATTER.format(now);
    const timeLabel = TIME_FORMATTER.format(now);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-offline": isOffline,
        className: "jsx-aecdbd79da3dd1cd" + " " + "shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                role: "banner",
                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-aecdbd79da3dd1cd" + " " + "shell__brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__logo",
                                children: "BM"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-aecdbd79da3dd1cd",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-aecdbd79da3dd1cd" + " " + "shell__product",
                                        children: "Bmad Local Stays"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "jsx-aecdbd79da3dd1cd",
                                        children: "Centro operacional para alojamentos locais"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                        lineNumber: 37,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-live": "polite",
                        className: "jsx-aecdbd79da3dd1cd" + " " + "shell__context",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__context-label",
                                children: "Portefólio ativo"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__context-title",
                                children: "Porto Riverside Collection"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__context-meta",
                                children: [
                                    todayLabel,
                                    " · ",
                                    timeLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "navigation",
                        "aria-label": "Acesso e autenticação",
                        className: "jsx-aecdbd79da3dd1cd" + " " + "shell__auth",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__auth-label",
                                children: "Acesso seguro"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: "shell__auth-link",
                                children: "Entrar na conta"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__auth-meta",
                                children: "Gestores, housekeeping e proprietários"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-aecdbd79da3dd1cd" + " " + "shell__actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$theme$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {
                                className: "shell__theme-toggle"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__action shell__action--primary",
                                children: "Sincronizar OTAs"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__action shell__action--secondary",
                                children: "Registar incidente"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflineBanner"], {}, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-aecdbd79da3dd1cd" + " " + "shell__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-aecdbd79da3dd1cd" + " " + "shell__sidebar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$navigation$2f$MainNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MainNav"], {}, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        id: "conteudo-principal",
                        tabIndex: -1,
                        className: "jsx-aecdbd79da3dd1cd" + " " + "shell__content",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TourDialog"], {}, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "aecdbd79da3dd1cd",
                children: '.shell.jsx-aecdbd79da3dd1cd{gap:var(--space-5);padding:var(--space-5)var(--space-6);background:var(--app-background);transition:background .3s;display:grid}.shell__header.jsx-aecdbd79da3dd1cd{align-items:center;gap:var(--space-5);background:var(--app-surface-overlay);padding:var(--space-4)var(--space-5);border-radius:var(--radius-md);box-shadow:var(--shadow-card);border:1px solid var(--app-border-strong);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);grid-template-columns:minmax(0,1.2fr) minmax(0,.9fr) minmax(0,.9fr) auto;transition:background .3s,border .3s,box-shadow .3s;display:grid}.shell__brand.jsx-aecdbd79da3dd1cd{align-items:center;gap:var(--space-4);display:flex}.shell__logo.jsx-aecdbd79da3dd1cd{letter-spacing:.08em;color:#fff;background:linear-gradient(135deg,#2563ebf5,#0ea5e9e0);border-radius:16px;justify-content:center;align-items:center;width:48px;height:48px;font-weight:700;display:inline-flex}.shell__product.jsx-aecdbd79da3dd1cd{margin:0 0 var(--space-2)0;letter-spacing:.08em;text-transform:uppercase;color:var(--color-neutral-2);font-weight:600}.shell__brand.jsx-aecdbd79da3dd1cd h1.jsx-aecdbd79da3dd1cd{color:var(--color-neutral-3);margin:0;font-size:1.5rem}.shell__context.jsx-aecdbd79da3dd1cd{gap:var(--space-1);justify-items:start;display:grid}.shell__context-label.jsx-aecdbd79da3dd1cd{text-transform:uppercase;letter-spacing:.08em;color:var(--color-neutral-2);margin:0;font-size:.75rem}.shell__context-title.jsx-aecdbd79da3dd1cd{color:var(--color-neutral-3);margin:0;font-size:1.125rem;font-weight:600}.shell__context-meta.jsx-aecdbd79da3dd1cd{color:var(--color-neutral-2);margin:0}.shell__auth.jsx-aecdbd79da3dd1cd{gap:var(--space-1);padding:var(--space-3)var(--space-4);border-radius:var(--radius-sm);background:var(--tint-primary-soft);border:1px solid var(--tint-primary-strong);justify-items:start;display:grid}.shell__auth-label.jsx-aecdbd79da3dd1cd{text-transform:uppercase;letter-spacing:.08em;color:var(--color-neutral-2);margin:0;font-size:.75rem}.shell__auth-link.jsx-aecdbd79da3dd1cd{color:var(--color-deep-blue);align-items:center;gap:var(--space-2);font-weight:600;text-decoration:none;display:inline-flex}.shell__auth-link.jsx-aecdbd79da3dd1cd:after{content:"↗";font-size:.85em;transition:transform .2s}.shell__auth-link.jsx-aecdbd79da3dd1cd:hover,.shell__auth-link.jsx-aecdbd79da3dd1cd:focus-visible{color:#1e40af}.shell__auth-link.jsx-aecdbd79da3dd1cd:hover:after,.shell__auth-link.jsx-aecdbd79da3dd1cd:focus-visible:after{transform:translate(2px)}.shell__auth-meta.jsx-aecdbd79da3dd1cd{color:var(--color-neutral-2);margin:0;font-size:.8125rem}.shell__actions.jsx-aecdbd79da3dd1cd{align-items:center;gap:var(--space-3);flex-wrap:wrap;justify-content:flex-end;display:inline-flex}.shell__theme-toggle.jsx-aecdbd79da3dd1cd{flex:none}.shell__action.jsx-aecdbd79da3dd1cd{border-radius:var(--radius-sm);padding:var(--space-2)var(--space-4);cursor:pointer;border:1px solid #0000;font-weight:600;transition:background .2s,color .2s,border .2s}.shell__action--primary.jsx-aecdbd79da3dd1cd{background:var(--color-deep-blue);color:#fff;box-shadow:0 10px 25px #2563eb40}.shell__action--primary.jsx-aecdbd79da3dd1cd:hover,.shell__action--primary.jsx-aecdbd79da3dd1cd:focus-visible{background:#1d4ed8}.shell__action--secondary.jsx-aecdbd79da3dd1cd{background:var(--tint-accent-soft);color:var(--color-deep-blue);border-color:var(--tint-accent-strong)}.shell__action--secondary.jsx-aecdbd79da3dd1cd:hover,.shell__action--secondary.jsx-aecdbd79da3dd1cd:focus-visible{background:var(--tint-accent-strong)}.shell__body.jsx-aecdbd79da3dd1cd{gap:var(--space-5);grid-template-columns:320px 1fr;align-items:start;display:grid}.shell__sidebar.jsx-aecdbd79da3dd1cd{min-width:0}.shell__content.jsx-aecdbd79da3dd1cd{gap:var(--space-5);display:grid}@media (width<=1200px){.shell.jsx-aecdbd79da3dd1cd{padding:var(--space-5)}.shell__header.jsx-aecdbd79da3dd1cd{grid-template-columns:minmax(0,1fr);justify-items:stretch}.shell__auth.jsx-aecdbd79da3dd1cd{width:100%;padding:var(--space-3)var(--space-4)}.shell__actions.jsx-aecdbd79da3dd1cd{justify-content:flex-start}.shell__body.jsx-aecdbd79da3dd1cd{grid-template-columns:minmax(0,1fr)}}@media (width<=768px){.shell.jsx-aecdbd79da3dd1cd{padding:var(--space-4)}.shell__actions.jsx-aecdbd79da3dd1cd{justify-content:flex-start;gap:var(--space-2);width:100%}.shell__theme-toggle.jsx-aecdbd79da3dd1cd{flex:none}.shell__actions.jsx-aecdbd79da3dd1cd .shell__action.jsx-aecdbd79da3dd1cd{text-align:center;flex:auto}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(AppChrome, "rVTeLx7Nl1RzubOC8ipMEIfsknM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOffline"]
    ];
});
_c = AppChrome;
var _c;
__turbopack_context__.k.register(_c, "AppChrome");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/a11y/SkipToContentLink.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkipToContentLink",
    ()=>SkipToContentLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function SkipToContentLink({ targetId, className }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])('common');
    const classes = [
        'skip-link'
    ];
    if (className) {
        classes.push(className);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        className: classes.join(' '),
        href: `#${targetId}`,
        children: t('skipToMainContent')
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/a11y/SkipToContentLink.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(SkipToContentLink, "zlIdU9EjM2llFt74AbE2KsUJXyM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = SkipToContentLink;
var _c;
__turbopack_context__.k.register(_c, "SkipToContentLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Bmad-Method_7778dac9._.js.map