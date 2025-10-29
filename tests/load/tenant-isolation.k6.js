import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.CORE_API_BASE_URL || 'http://localhost:8000';
const PLATFORM_TOKEN = __ENV.CORE_PLATFORM_TOKEN || 'platform-secret';

const responseTrend = new Trend('tenant_kpi_duration');

export const options = {
  scenarios: {
    tenant_isolation: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 10,
      stages: [
        { target: 5, duration: '30s' },
        { target: 12, duration: '1m' },
        { target: 0, duration: '15s' }
      ]
    },
    platform_view: {
      executor: 'constant-vus',
      vus: 2,
      duration: '1m',
      exec: 'platformScenario',
      startTime: '30s'
    }
  },
  thresholds: {
    tenant_kpi_duration: ['p(95)<800'],
    'checks{scenario:tenant_isolation}': ['rate>0.97'],
    'checks{scenario:platform_view}': ['rate>0.95']
  }
};

const TENANTS = [
  { slug: 'pilot', headers: { 'X-Tenant-Slug': 'pilot' } },
  { slug: 'beta', headers: { 'X-Tenant-Slug': 'beta' } }
];

export default function () {
  const tenant = TENANTS[__ITER % TENANTS.length];
  const res = http.get(`${BASE_URL}/reports/kpis`, { headers: tenant.headers });
  responseTrend.add(res.timings.duration, { tenant: tenant.slug });
  check(res, {
    'status 200': (r) => r.status === 200,
    'no tenant leak marker': (r) => !r.headers['x-tenant-scope']
  });
  sleep(0.5);
}

export function platformScenario() {
  const res = http.get(`${BASE_URL}/tenants/reports/kpis`, {
    headers: {
      'X-Tenant-Scope': 'platform',
      'X-Tenant-Platform-Token': PLATFORM_TOKEN
    }
  });
  check(res, {
    'platform status 200': (r) => r.status === 200,
    'aggregated payload': (r) => r.json('tenants.length') >= 0
  });
  sleep(1);
}
