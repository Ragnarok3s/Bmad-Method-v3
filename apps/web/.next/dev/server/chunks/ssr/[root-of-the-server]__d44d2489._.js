module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnalyticsProvider",
    ()=>AnalyticsProvider,
    "useAnalytics",
    ()=>useAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
const AnalyticsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ANALYTICS_KEY = 'bmad-analytics-queue';
function persistQueue(queue) {
    try {
        window.sessionStorage.setItem(ANALYTICS_KEY, JSON.stringify(queue));
    } catch  {
    // ignore storage errors in private mode
    }
}
function loadQueue() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function AnalyticsProvider({ children }) {
    const queueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        queueRef.current = loadQueue();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        pathname,
        searchParams
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            track: (type, payload)=>{
                const event = {
                    type,
                    payload,
                    timestamp: Date.now()
                };
                queueRef.current.push(event);
                persistQueue(queueRef.current);
            },
            flushQueue: ()=>{
                const copy = [
                    ...queueRef.current
                ];
                queueRef.current = [];
                persistQueue(queueRef.current);
                return copy;
            }
        }), []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnalyticsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx",
        lineNumber: 75,
        columnNumber: 10
    }, this);
}
function useAnalytics() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AnalyticsContext);
    if (!ctx) {
        throw new Error('useAnalytics deve ser utilizado dentro de AnalyticsProvider');
    }
    return ctx;
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/offline-queue.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/idb/build/index.js [app-ssr] (ecmascript)");
;
const DB_NAME = 'bmad-offline';
const STORE_NAME = 'housekeeping-task-mutations';
let dbPromise = null;
const memoryFallback = [];
function isIndexedDbAvailable() {
    return ("TURBOPACK compile-time value", "undefined") !== 'undefined' && typeof window.indexedDB !== 'undefined';
}
async function getDb() {
    if (!dbPromise) {
        dbPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openDB"])(DB_NAME, 1, {
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
    //TURBOPACK unreachable
    ;
    const db = undefined;
}
async function removeTaskUpdate(id) {
    if (!isIndexedDbAvailable()) {
        const index = memoryFallback.findIndex((item)=>item.id === id);
        if (index >= 0) {
            memoryFallback.splice(index, 1);
        }
        return;
    }
    //TURBOPACK unreachable
    ;
    const db = undefined;
}
async function readTaskUpdates() {
    if (!isIndexedDbAvailable()) {
        return [
            ...memoryFallback
        ].sort((a, b)=>a.createdAt - b.createdAt);
    }
    //TURBOPACK unreachable
    ;
    const db = undefined;
    const items = undefined;
}
async function clearTaskUpdates() {
    if (!isIndexedDbAvailable()) {
        memoryFallback.length = 0;
        return;
    }
    //TURBOPACK unreachable
    ;
    const db = undefined;
}
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CoreApiClient",
    ()=>CoreApiClient,
    "CoreApiError",
    ()=>CoreApiError,
    "toSnakeCaseKeys",
    ()=>toSnakeCaseKeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lodash$2e$snakecase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lodash.snakecase/index.js [app-ssr] (ecmascript)");
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
                url.searchParams.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lodash$2e$snakecase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(key), String(value));
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lodash$2e$snakecase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(key),
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
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/housekeeping.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/incidents.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/notifications.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/client.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BmadApiClient",
    ()=>BmadApiClient,
    "createApiClient",
    ()=>createApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$housekeeping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/housekeeping.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$incidents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/incidents.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$notifications$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/notifications.js [app-ssr] (ecmascript)");
;
;
;
;
class BmadApiClient extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoreApiClient"] {
    constructor(options){
        super(options);
        this.housekeeping = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$housekeeping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HousekeepingApi"](this);
        this.incidents = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$incidents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IncidentApi"](this);
        this.notifications = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$notifications$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NotificationApi"](this);
    }
}
function createApiClient(options) {
    return new BmadApiClient(options);
}
}),
"[project]/Desktop/Bmad-Method/packages/api-client/dist/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$housekeeping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/housekeeping.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$incidents$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/incidents.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$notifications$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/notifications.js [app-ssr] (ecmascript)");
;
;
;
;
;
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiClient",
    ()=>getApiClient,
    "resetApiClient",
    ()=>resetApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/client.js [app-ssr] (ecmascript)");
;
let client = null;
function getApiClient() {
    if (!client) {
        const baseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") ?? 'http://localhost:8000';
        const fetchProxy = (input, init)=>globalThis.fetch(input, init);
        client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiClient"])({
            baseUrl,
            fetchImpl: fetchProxy
        });
    }
    return client;
}
function resetApiClient() {
    client = null;
}
}),
"[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getHousekeepingTasks",
    ()=>getHousekeepingTasks,
    "updateHousekeepingTask",
    ()=>updateHousekeepingTask
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/packages/api-client/dist/core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/client.ts [app-ssr] (ecmascript)");
;
;
;
async function getHousekeepingTasks(query) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiClient"])().housekeeping.listTasks(query);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoreApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to load housekeeping tasks', 500, null);
    }
}
async function updateHousekeepingTask(taskId, payload) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiClient"])().housekeeping.updateTask(taskId, payload);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoreApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$packages$2f$api$2d$client$2f$dist$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoreApiError"]('Failed to update housekeeping task', 500, null);
    }
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflineProvider",
    ()=>OfflineProvider,
    "useOffline",
    ()=>useOffline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/offline-queue.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$services$2f$api$2f$housekeeping$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/services/api/housekeeping.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
;
const OfflineContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function OfflineProvider({ children }) {
    const [isOffline, setIsOffline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastChangedAt, setLastChangedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingMutations, setPendingMutations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSyncing, setIsSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const manualSyncListeners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const isClient = ("TURBOPACK compile-time value", "undefined") !== 'undefined';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        const syncInitialStatus = undefined;
        const handleOnline = undefined;
        const handleOffline = undefined;
    }, []);
    const refreshPendingMutations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }, [
        isClient
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void refreshPendingMutations();
    }, [
        refreshPendingMutations
    ]);
    const enqueueTaskUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
        const mutation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enqueueTaskUpdate"])(input);
        setPendingMutations((prev)=>[
                ...prev,
                mutation
            ].sort((a, b)=>a.createdAt - b.createdAt));
        if (isOffline) {
            setLastChangedAt(Date.now());
        }
        return mutation;
    }, [
        isOffline
    ]);
    const removeTaskUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (id)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$offline$2d$queue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeTaskUpdate"])(id);
        setPendingMutations((prev)=>prev.filter((mutation)=>mutation.id !== id));
    }, []);
    const flushQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ({ manual = false } = {})=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        let hasSynced;
    }, [
        isClient,
        isOffline,
        refreshPendingMutations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOffline) {
            void flushQueue();
        }
    }, [
        isOffline,
        flushQueue
    ]);
    const onManualSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((listener)=>{
        manualSyncListeners.current.add(listener);
        return ()=>{
            manualSyncListeners.current.delete(listener);
        };
    }, []);
    const pendingActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return pendingMutations.map((mutation)=>mutation.description);
    }, [
        pendingMutations
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            isOffline,
            lastChangedAt,
            pendingActions,
            enqueueTaskUpdate,
            removeTaskUpdate,
            flushQueue,
            onManualSync,
            isSyncing
        }), [
        isOffline,
        lastChangedAt,
        pendingActions,
        enqueueTaskUpdate,
        removeTaskUpdate,
        flushQueue,
        onManualSync,
        isSyncing
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OfflineContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx",
        lineNumber: 191,
        columnNumber: 10
    }, this);
}
function useOffline() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(OfflineContext);
    if (!context) {
        throw new Error('useOffline deve ser usado dentro de OfflineProvider');
    }
    return context;
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GuidedTourProvider",
    ()=>GuidedTourProvider,
    "tourMatchesPath",
    ()=>tourMatchesPath,
    "useGuidedTour",
    ()=>useGuidedTour
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const COMPLETED_STORAGE_KEY = 'bmad:guided-tour:completed';
const TourContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
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
    const analytics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAnalytics"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [activeTourId, setActiveTourId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [registrations, setRegistrations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [completed, setCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const autoStartTriggeredRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }, [
        completed
    ]);
    const completedSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new Set(completed), [
        completed
    ]);
    const registerTour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((registration)=>{
        setRegistrations((previous)=>{
            const current = previous[registration.id];
            if (current === registration) {
                return previous;
            }
            return {
                ...previous,
                [registration.id]: registration
            };
        });
        return ()=>{
            setRegistrations((previous)=>{
                if (!(registration.id in previous)) {
                    return previous;
                }
                const next = {
                    ...previous
                };
                delete next[registration.id];
                return next;
            });
        };
    }, []);
    const markCompleted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((tourId)=>{
        setCompleted((previous)=>{
            if (previous.includes(tourId)) {
                return previous;
            }
            const next = [
                ...previous,
                tourId
            ];
            return next;
        });
        const registration = registrations[tourId];
        analytics.track('tour.completed', {
            tourId,
            route: registration?.route ?? 'global',
            steps: registration?.steps.length ?? 0
        });
    }, [
        analytics,
        registrations
    ]);
    const startTour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((tourId)=>{
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
    }, [
        analytics,
        registrations
    ]);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((tourId)=>{
        if (tourId) {
            startTour(tourId);
            return;
        }
        const firstTour = Object.values(registrations)[0];
        if (firstTour) {
            startTour(firstTour.id);
        }
    }, [
        registrations,
        startTour
    ]);
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((options = {})=>{
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
    }, [
        activeTourId,
        analytics,
        markCompleted
    ]);
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
        setCurrentIndex((index)=>Math.min(index + 1, lastIndex));
    }, [
        activeTourId,
        currentIndex,
        markCompleted,
        registrations
    ]);
    const previous = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setCurrentIndex((index)=>Math.max(index - 1, 0));
    }, []);
    const hasCompleted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((tourId)=>completedSet.has(tourId), [
        completedSet
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        completedSet,
        isOpen,
        pathname,
        registrations,
        startTour
    ]);
    const activeTour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!activeTourId) {
            return null;
        }
        return registrations[activeTourId] ?? null;
    }, [
        activeTourId,
        registrations
    ]);
    const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return activeTour?.steps ?? [];
    }, [
        activeTour
    ]);
    const activeStep = steps[currentIndex] ?? null;
    const tours = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Object.values(registrations), [
        registrations
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
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
        }), [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TourContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx",
        lineNumber: 314,
        columnNumber: 10
    }, this);
}
function useGuidedTour() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TourContext);
    if (!context) {
        throw new Error('useGuidedTour deve ser usado dentro de GuidedTourProvider');
    }
    return context;
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/telemetry/TelemetryProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelemetryProvider",
    ()=>TelemetryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
let configured = false;
function TelemetryProvider({ children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (configured) {
            return;
        }
        configured = true;
        void __turbopack_context__.A("[project]/Desktop/Bmad-Method/apps/web/telemetry/init.ts [app-ssr] (ecmascript, async loader)").then(async (module)=>{
            const runtime = await module.initTelemetry();
            if (!runtime) {
                console.info('[Telemetry] Telemetria não será inicializada (desativada ou indisponível no ambiente atual).');
                return;
            }
            const { registerAnalyticsInstrumentation } = await __turbopack_context__.A("[project]/Desktop/Bmad-Method/apps/web/telemetry/analytics.ts [app-ssr] (ecmascript, async loader)");
            registerAnalyticsInstrumentation(runtime);
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/catalog.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/translator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nProvider",
    ()=>I18nProvider,
    "useI18nContext",
    ()=>useI18nContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/catalog.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$translator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/translator.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const I18nContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function determineInitialLocale(initialLocale) {
    if (initialLocale) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(initialLocale);
    }
    if (typeof document !== 'undefined' && document.documentElement?.lang) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(document.documentElement.lang);
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(navigator.language);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFallbackLocale"])();
}
function I18nProvider({ initialLocale, children }) {
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>determineInitialLocale(initialLocale));
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fallbackMessages, setFallbackMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        setReady(false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadLocaleMessages"])(locale).then((loaded)=>{
            if (mounted) {
                setMessages(loaded);
                setReady(true);
            }
        }).catch(()=>{
            if (mounted) {
                setMessages(null);
                setReady(true);
            }
        });
        return ()=>{
            mounted = false;
        };
    }, [
        locale
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        const fallbackLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFallbackLocale"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadLocaleMessages"])(fallbackLocale).then((loaded)=>{
            if (mounted) {
                setFallbackMessages(loaded);
            }
        }).catch(()=>{
            if (mounted) {
                setFallbackMessages(null);
            }
        });
        return ()=>{
            mounted = false;
        };
    }, []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return {
            locale,
            ready,
            setLocale: (next)=>setLocaleState((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeLocaleCode"])(next)),
            t: (key, values)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$translator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translate"])(messages, fallbackMessages, key, values)
        };
    }, [
        locale,
        ready,
        messages,
        fallbackMessages
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(I18nContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx",
        lineNumber: 96,
        columnNumber: 10
    }, this);
}
function useI18nContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(I18nContext);
    if (!context) {
        throw new Error('useI18nContext must be used within I18nProvider');
    }
    return context;
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTranslation",
    ()=>useTranslation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function useTranslation(namespace) {
    const { locale, ready, setLocale, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18nContext"])();
    const translate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key, values)=>{
        const scopedKey = namespace ? `${namespace}.${key}` : key;
        return t(scopedKey, values);
    }, [
        namespace,
        t
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            locale,
            ready,
            t: translate,
            setLocale
        }), [
        locale,
        ready,
        translate,
        setLocale
    ]);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/i18n/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/catalog.ts [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/Desktop/Bmad-Method/apps/web/lib/tenant-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TenantProvider",
    ()=>TenantProvider,
    "useTenant",
    ()=>useTenant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const TenantContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function resolveInitialMode() {
    const scope = process.env.NEXT_PUBLIC_TENANT_SCOPE;
    return scope === 'platform' ? 'platform' : 'tenant';
}
function resolveInitialTenant() {
    const slug = process.env.NEXT_PUBLIC_TENANT_SLUG;
    if (!slug) {
        return undefined;
    }
    return {
        slug,
        name: process.env.NEXT_PUBLIC_TENANT_NAME ?? slug
    };
}
function TenantProvider({ children, tenant, mode, platformToken, capabilities }) {
    const resolvedMode = mode ?? resolveInitialMode();
    const resolvedTenant = tenant ?? resolveInitialTenant();
    const resolvedToken = platformToken ?? process.env.NEXT_PUBLIC_TENANT_PLATFORM_TOKEN ?? null;
    const resolvedTenantSlug = resolvedTenant?.slug;
    const buildHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((options)=>{
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
    }, [
        resolvedMode,
        resolvedTenantSlug,
        resolvedToken
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
    }, [
        buildHeaders,
        capabilities,
        resolvedMode,
        resolvedTenant,
        resolvedToken
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TenantContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/lib/tenant-context.tsx",
        lineNumber: 110,
        columnNumber: 10
    }, this);
}
function useTenant() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TenantContext);
    if (!context) {
        throw new Error('TenantProvider não encontrado no contexto da aplicação');
    }
    return context;
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/analytics/AnalyticsContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$telemetry$2f$TelemetryProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/telemetry/TelemetryProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/I18nProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$tenant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/tenant-context.tsx [app-ssr] (ecmascript)");
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
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])('common.loading');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "sr-only",
        children: t('navigation')
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
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
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I18nProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationFallback, {}, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                lineNumber: 36,
                columnNumber: 27
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$telemetry$2f$TelemetryProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TelemetryProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
                    client: queryClient,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$tenant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TenantProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$analytics$2f$AnalyticsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnalyticsProvider"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OfflineProvider"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GuidedTourProvider"], {
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                                    lineNumber: 42,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                                lineNumber: 41,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                            lineNumber: 40,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                        lineNumber: 39,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                    lineNumber: 38,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
                lineNumber: 37,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/providers/Providers.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflineBanner",
    ()=>OfflineBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function OfflineBanner() {
    const { isOffline, lastChangedAt, pendingActions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOffline"])();
    const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isOffline && !lastChangedAt) return 'Conectado';
        if (!isOffline && lastChangedAt) {
            return `Conexão restabelecida há ${(Date.now() - lastChangedAt) / 1000 < 60 ? 'poucos segundos' : 'alguns minutos'}.`;
        }
        const pending = pendingActions.length ? `Ações pendentes: ${pendingActions.join(', ')}` : 'Sincronização automática quando a ligação voltar.';
        return `Você está offline. ${pending}`;
    }, [
        isOffline,
        lastChangedAt,
        pendingActions
    ]);
    if (!isOffline && !lastChangedAt) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-live": "polite",
        "data-offline": isOffline,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dynamic([
            [
                "35333b98a60f013",
                [
                    isOffline ? 'var(--color-coral)' : 'var(--color-soft-aqua)'
                ]
            ]
        ]) + " " + "offline-banner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dynamic([
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dynamic([
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainNav",
    ()=>MainNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/bot.js [app-ssr] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/calendar-check.js [app-ssr] (ecmascript) <export default as CalendarCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-ssr] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-ssr] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-ssr] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/chart-line.js [app-ssr] (ecmascript) <export default as LineChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/workflow.js [app-ssr] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-ssr] (ecmascript) <export default as Smartphone>");
'use client';
;
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
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
            },
            {
                href: '/reservas',
                label: 'Reservas',
                description: 'Fluxos de check-in/out e ajustes de estadia',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarCheck$3e$__["CalendarCheck"]
            },
            {
                href: '/calendario',
                label: 'Calendário',
                description: 'Disponibilidade por unidade e sincronização OTA',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"]
            },
            {
                href: '/housekeeping',
                label: 'Housekeeping',
                description: 'Atribuição de tarefas, incidentes e auditorias',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"]
            },
            {
                href: '/faturacao',
                label: 'Faturação',
                description: 'Checkout, notas de crédito e reconciliações',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"]
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
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
            },
            {
                href: '/onboarding',
                label: 'Onboarding',
                description: 'Wizard guiado para novas propriedades e equipas',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"]
            },
            {
                href: '/mobile/housekeeping',
                label: 'App Housekeeping',
                description: 'Execução mobile com suporte offline',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"]
            },
            {
                href: '/mobile/gestor',
                label: 'App Gestor',
                description: 'KPIs móveis e aprovações rápidas',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__["LineChart"]
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
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"]
            },
            {
                href: '/playbooks',
                label: 'Playbooks Automatizados',
                description: 'Fluxos configurados e monitorização de adoção',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"]
            },
            {
                href: '/recommendations',
                label: 'Recomendações',
                description: 'Sugestões de upsell e alertas gerados por IA',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"]
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
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"]
            },
            {
                href: '/governanca',
                label: 'Governança',
                description: 'Políticas, auditoria e controlos de acesso',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
            },
            {
                href: '/analytics',
                label: 'Analytics',
                description: 'Dashboards avançados e relatórios exportáveis',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
            },
            {
                href: '/support/knowledge-base',
                label: 'Base de Conhecimento',
                description: 'Guias, SOPs e artigos de apoio',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
            }
        ]
    }
];
function MainNav() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Navegação principal",
        className: "jsx-7aedb6187154bc84" + " " + "main-nav",
        children: [
            NAV_SECTIONS.map((section, index)=>{
                const headingId = `main-nav-section-${index}`;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    "aria-labelledby": headingId,
                    className: "jsx-7aedb6187154bc84" + " " + "main-nav__section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            id: headingId,
                            className: "jsx-7aedb6187154bc84" + " " + "main-nav__heading",
                            children: section.heading
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "jsx-7aedb6187154bc84",
                            children: section.items.map((item)=>{
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                const tooltipId = `nav-tooltip-${slugify(item.href)}-${slugify(item.label)}`;
                                const Icon = item.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "jsx-7aedb6187154bc84" + " " + "main-nav__item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.href,
                                            "aria-current": isActive ? 'page' : undefined,
                                            "data-active": isActive ? 'true' : 'false',
                                            "aria-describedby": tooltipId,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-hidden": "true",
                                                    className: "jsx-7aedb6187154bc84" + " " + "main-nav__icon",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        size: 18,
                                                        strokeWidth: 1.6,
                                                        className: "jsx-7aedb6187154bc84"
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-7aedb6187154bc84" + " " + "main-nav__label",
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            role: "tooltip",
                                            id: tooltipId,
                                            className: "jsx-7aedb6187154bc84" + " " + "main-nav__tooltip",
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "7aedb6187154bc84",
                children: '.main-nav.jsx-7aedb6187154bc84{gap:var(--space-5);top:var(--space-4);z-index:2050;display:grid;position:sticky}.main-nav__section.jsx-7aedb6187154bc84{gap:var(--space-2);display:grid}.main-nav__heading.jsx-7aedb6187154bc84{text-transform:uppercase;letter-spacing:.12em;color:var(--color-neutral-2);margin:0;font-size:.75rem}ul.jsx-7aedb6187154bc84{gap:var(--space-2);margin:0;padding:0;list-style:none;display:grid}.main-nav__item.jsx-7aedb6187154bc84{position:relative}a.jsx-7aedb6187154bc84{align-items:center;gap:var(--space-2);padding:var(--space-3)var(--space-4);border-radius:var(--radius-sm);color:var(--color-neutral-3);background:#94a3b81f;border:1px solid #0000;grid-template-columns:auto 1fr;font-weight:500;transition:background .2s,border .2s,transform .2s,color .2s;display:grid}a.jsx-7aedb6187154bc84:hover,a.jsx-7aedb6187154bc84:focus-visible{color:var(--color-deep-blue);background:#2563eb24;border-color:#2563eb47;transform:translateY(-1px)}a[data-active=true].jsx-7aedb6187154bc84{color:#fff;box-shadow:var(--shadow-card);background:linear-gradient(135deg,#2563ebf5,#0ea5e9eb)}.main-nav__icon.jsx-7aedb6187154bc84{width:28px;height:28px;color:inherit;background:#ffffff29;border-radius:999px;justify-content:center;align-items:center;display:inline-flex}.main-nav__label.jsx-7aedb6187154bc84{font-weight:600}.main-nav__tooltip.jsx-7aedb6187154bc84{pointer-events:none;left:calc(100% + var(--space-2));color:#fff;width:min(240px,32vw);padding:var(--space-3);border-radius:var(--radius-sm);box-shadow:var(--shadow-flyout);opacity:0;transform-origin:0;background:#0f172a;font-size:.8125rem;line-height:1.45;transition:opacity .2s,transform .2s;position:absolute;top:50%;transform:translateY(-50%)}.main-nav__tooltip.jsx-7aedb6187154bc84:before{content:"";border-top:6px solid #0000;border-bottom:6px solid #0000;border-right:6px solid #0f172a;width:0;height:0;position:absolute;top:50%;left:-6px;transform:translateY(-50%)}.main-nav__item.jsx-7aedb6187154bc84:hover .main-nav__tooltip.jsx-7aedb6187154bc84,a.jsx-7aedb6187154bc84:focus-visible+.main-nav__tooltip.jsx-7aedb6187154bc84{opacity:1;transform:translateY(-50%)translate(4px)}a[data-active=true].jsx-7aedb6187154bc84+.main-nav__tooltip.jsx-7aedb6187154bc84{background:#0f172af2}a[data-active=true].jsx-7aedb6187154bc84 .main-nav__icon.jsx-7aedb6187154bc84{background:#ffffff38}@media (prefers-reduced-motion:reduce){.main-nav__tooltip.jsx-7aedb6187154bc84{transition:none}}@media (width<=960px){.main-nav.jsx-7aedb6187154bc84{position:relative;top:auto}ul.jsx-7aedb6187154bc84{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}}@media (width<=640px){.main-nav__item.jsx-7aedb6187154bc84{position:static}.main-nav__tooltip.jsx-7aedb6187154bc84{opacity:1;margin-top:var(--space-2);width:auto;position:relative;top:auto;left:0;transform:none}.main-nav__tooltip.jsx-7aedb6187154bc84:before{display:none}ul.jsx-7aedb6187154bc84{grid-template-columns:minmax(0,1fr)}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TourDialog",
    ()=>TourDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function TourDialog() {
    const { isOpen, close, next, previous, steps, currentIndex, activeStep } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGuidedTour"])();
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const descriptionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const dialogRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const primaryButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const liveRegionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, [
        close,
        isOpen,
        next,
        previous
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen && primaryButtonRef.current) {
            primaryButtonRef.current.focus();
        }
    }, [
        isOpen,
        currentIndex
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        return ()=>{
            element.removeAttribute('data-tour-highlighted');
            if (previousAriaDescribedBy) {
                element.setAttribute('aria-describedby', previousAriaDescribedBy);
            } else {
                element.removeAttribute('aria-describedby');
            }
        };
    }, [
        activeStep,
        descriptionId,
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen || !dialogRef.current) {
            return;
        }
        dialogRef.current.scrollIntoView({
            block: 'center'
        });
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dialogRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-describedby": descriptionId,
        className: "jsx-ede7fc0aa0f5a545" + " " + "tour-overlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-ede7fc0aa0f5a545" + " " + "tour-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-ede7fc0aa0f5a545" + " " + "tour-step-counter",
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: titleId,
                        className: "jsx-ede7fc0aa0f5a545",
                        children: activeStep.title
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        id: descriptionId,
                        ref: liveRegionRef,
                        "aria-live": "polite",
                        className: "jsx-ede7fc0aa0f5a545",
                        children: activeStep.description
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "group",
                        "aria-label": "Navegação do tour guiado",
                        className: "jsx-ede7fc0aa0f5a545" + " " + "tour-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: previous,
                                disabled: currentIndex === 0,
                                className: "jsx-ede7fc0aa0f5a545",
                                children: "Anterior"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            !isLastStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: next,
                                ref: primaryButtonRef,
                                className: "jsx-ede7fc0aa0f5a545",
                                children: "Próximo"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleFinish,
                                ref: primaryButtonRef,
                                className: "jsx-ede7fc0aa0f5a545",
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>close(),
                        "aria-label": "Fechar tour guiado",
                        className: "jsx-ede7fc0aa0f5a545" + " " + "tour-close",
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "ede7fc0aa0f5a545",
                children: ".tour-overlay.jsx-ede7fc0aa0f5a545{padding:var(--space-6);z-index:2000;pointer-events:none;background:#2563eb99;place-items:center;display:grid;position:fixed;inset:0}.tour-content.jsx-ede7fc0aa0f5a545{border-radius:var(--radius-md);width:100%;max-width:540px;padding:var(--space-5);box-shadow:var(--shadow-card);gap:var(--space-4);pointer-events:auto;background:#fff;display:grid;position:relative}.tour-step-counter.jsx-ede7fc0aa0f5a545{color:var(--color-neutral-2);margin:0;font-size:.875rem}.tour-actions.jsx-ede7fc0aa0f5a545{gap:var(--space-3);justify-content:flex-end;display:flex}.tour-actions.jsx-ede7fc0aa0f5a545 button.jsx-ede7fc0aa0f5a545{border-radius:var(--radius-sm);padding:var(--space-2)var(--space-4);cursor:pointer;color:var(--color-deep-blue);border:none;border:1px solid var(--color-deep-blue);background:0 0;font-weight:600}.tour-actions.jsx-ede7fc0aa0f5a545 button.jsx-ede7fc0aa0f5a545:last-of-type{background:var(--color-deep-blue);color:#fff}.tour-actions.jsx-ede7fc0aa0f5a545 button.jsx-ede7fc0aa0f5a545:disabled{opacity:.4;cursor:not-allowed}.tour-close.jsx-ede7fc0aa0f5a545{top:var(--space-2);right:var(--space-2);cursor:pointer;color:var(--color-neutral-2);background:0 0;border:none;font-size:1.5rem;position:absolute}[data-tour-highlighted=true]{outline:3px solid var(--color-soft-aqua);outline-offset:4px;border-radius:var(--radius-sm);transition:outline .2s}@media (width<=768px){.tour-overlay.jsx-ede7fc0aa0f5a545,.tour-content.jsx-ede7fc0aa0f5a545{padding:var(--space-4)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppChrome",
    ()=>AppChrome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/offline/OfflineBanner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$navigation$2f$MainNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/navigation/MainNav.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/components/tour/TourDialog.tsx [app-ssr] (ecmascript)");
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
    const { isOffline } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOffline"])();
    const now = new Date();
    const todayLabel = DATE_FORMATTER.format(now);
    const timeLabel = TIME_FORMATTER.format(now);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-offline": isOffline,
        className: "jsx-315698946e31618" + " " + "shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                role: "banner",
                className: "jsx-315698946e31618" + " " + "shell__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-315698946e31618" + " " + "shell__brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "jsx-315698946e31618" + " " + "shell__logo",
                                children: "BM"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-315698946e31618",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-315698946e31618" + " " + "shell__product",
                                        children: "Bmad Local Stays"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                        lineNumber: 35,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "jsx-315698946e31618",
                                        children: "Centro operacional para alojamentos locais"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-live": "polite",
                        className: "jsx-315698946e31618" + " " + "shell__context",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-315698946e31618" + " " + "shell__context-label",
                                children: "Portefólio ativo"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-315698946e31618" + " " + "shell__context-title",
                                children: "Porto Riverside Collection"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-315698946e31618" + " " + "shell__context-meta",
                                children: [
                                    todayLabel,
                                    " · ",
                                    timeLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "navigation",
                        "aria-label": "Acesso e autenticação",
                        className: "jsx-315698946e31618" + " " + "shell__auth",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-315698946e31618" + " " + "shell__auth-label",
                                children: "Acesso seguro"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: "shell__auth-link",
                                children: "Entrar na conta"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-315698946e31618" + " " + "shell__auth-meta",
                                children: "Gestores, housekeeping e proprietários"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-315698946e31618" + " " + "shell__actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "jsx-315698946e31618" + " " + "shell__action shell__action--primary",
                                children: "Sincronizar OTAs"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "jsx-315698946e31618" + " " + "shell__action shell__action--secondary",
                                children: "Registar incidente"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$offline$2f$OfflineBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OfflineBanner"], {}, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-315698946e31618" + " " + "shell__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-315698946e31618" + " " + "shell__sidebar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$navigation$2f$MainNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MainNav"], {}, void 0, false, {
                            fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        id: "conteudo-principal",
                        tabIndex: -1,
                        className: "jsx-315698946e31618" + " " + "shell__content",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$components$2f$tour$2f$TourDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TourDialog"], {}, void 0, false, {
                fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "315698946e31618",
                children: '.shell.jsx-315698946e31618{gap:var(--space-5);padding:var(--space-5)var(--space-6);background:var(--color-neutral-1);display:grid}.shell__header.jsx-315698946e31618{align-items:center;gap:var(--space-5);padding:var(--space-4)var(--space-5);border-radius:var(--radius-md);box-shadow:var(--shadow-card);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);background:#ffffffeb;border:1px solid #94a3b83d;grid-template-columns:minmax(0,1.2fr) minmax(0,.9fr) minmax(0,.9fr) auto;display:grid}.shell__brand.jsx-315698946e31618{align-items:center;gap:var(--space-4);display:flex}.shell__logo.jsx-315698946e31618{letter-spacing:.08em;color:#fff;background:linear-gradient(135deg,#2563ebf5,#0ea5e9e0);border-radius:16px;justify-content:center;align-items:center;width:48px;height:48px;font-weight:700;display:inline-flex}.shell__product.jsx-315698946e31618{margin:0 0 var(--space-2)0;letter-spacing:.08em;text-transform:uppercase;color:var(--color-neutral-2);font-weight:600}.shell__brand.jsx-315698946e31618 h1.jsx-315698946e31618{color:var(--color-neutral-3);margin:0;font-size:1.5rem}.shell__context.jsx-315698946e31618{gap:var(--space-1);justify-items:start;display:grid}.shell__context-label.jsx-315698946e31618{text-transform:uppercase;letter-spacing:.08em;color:var(--color-neutral-2);margin:0;font-size:.75rem}.shell__context-title.jsx-315698946e31618{color:var(--color-neutral-3);margin:0;font-size:1.125rem;font-weight:600}.shell__context-meta.jsx-315698946e31618{color:var(--color-neutral-2);margin:0}.shell__auth.jsx-315698946e31618{gap:var(--space-1);padding:var(--space-3)var(--space-4);border-radius:var(--radius-sm);background:#2563eb14;border:1px solid #2563eb33;justify-items:start;display:grid}.shell__auth-label.jsx-315698946e31618{text-transform:uppercase;letter-spacing:.08em;color:var(--color-neutral-2);margin:0;font-size:.75rem}.shell__auth-link.jsx-315698946e31618{color:var(--color-deep-blue);align-items:center;gap:var(--space-2);font-weight:600;text-decoration:none;display:inline-flex}.shell__auth-link.jsx-315698946e31618:after{content:"↗";font-size:.85em;transition:transform .2s}.shell__auth-link.jsx-315698946e31618:hover,.shell__auth-link.jsx-315698946e31618:focus-visible{color:#1e40af}.shell__auth-link.jsx-315698946e31618:hover:after,.shell__auth-link.jsx-315698946e31618:focus-visible:after{transform:translate(2px)}.shell__auth-meta.jsx-315698946e31618{color:var(--color-neutral-2);margin:0;font-size:.8125rem}.shell__actions.jsx-315698946e31618{gap:var(--space-3);flex-wrap:wrap;justify-content:flex-end;display:inline-flex}.shell__action.jsx-315698946e31618{border-radius:var(--radius-sm);padding:var(--space-2)var(--space-4);cursor:pointer;border:1px solid #0000;font-weight:600;transition:background .2s,color .2s,border .2s}.shell__action--primary.jsx-315698946e31618{background:var(--color-deep-blue);color:#fff;box-shadow:0 10px 25px #2563eb40}.shell__action--primary.jsx-315698946e31618:hover,.shell__action--primary.jsx-315698946e31618:focus-visible{background:#1d4ed8}.shell__action--secondary.jsx-315698946e31618{color:var(--color-deep-blue);background:#0ea5e924;border-color:#0ea5e952}.shell__action--secondary.jsx-315698946e31618:hover,.shell__action--secondary.jsx-315698946e31618:focus-visible{background:#0ea5e93d}.shell__body.jsx-315698946e31618{gap:var(--space-5);grid-template-columns:320px 1fr;align-items:start;display:grid}.shell__sidebar.jsx-315698946e31618{min-width:0}.shell__content.jsx-315698946e31618{gap:var(--space-5);display:grid}@media (width<=1200px){.shell.jsx-315698946e31618{padding:var(--space-5)}.shell__header.jsx-315698946e31618{grid-template-columns:minmax(0,1fr);justify-items:stretch}.shell__auth.jsx-315698946e31618{width:100%;padding:var(--space-3)var(--space-4)}.shell__actions.jsx-315698946e31618{justify-content:flex-start}.shell__body.jsx-315698946e31618{grid-template-columns:minmax(0,1fr)}}@media (width<=768px){.shell.jsx-315698946e31618{padding:var(--space-4)}.shell__actions.jsx-315698946e31618{width:100%}.shell__actions.jsx-315698946e31618 .shell__action.jsx-315698946e31618{text-align:center;flex:auto}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/layout/AppChrome.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Bmad-Method/apps/web/components/a11y/SkipToContentLink.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkipToContentLink",
    ()=>SkipToContentLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/apps/web/lib/i18n/useTranslation.ts [app-ssr] (ecmascript)");
'use client';
;
;
function SkipToContentLink({ targetId, className }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$apps$2f$web$2f$lib$2f$i18n$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])('common');
    const classes = [
        'skip-link'
    ];
    if (className) {
        classes.push(className);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        className: classes.join(' '),
        href: `#${targetId}`,
        children: t('skipToMainContent')
    }, void 0, false, {
        fileName: "[project]/Desktop/Bmad-Method/apps/web/components/a11y/SkipToContentLink.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d44d2489._.js.map