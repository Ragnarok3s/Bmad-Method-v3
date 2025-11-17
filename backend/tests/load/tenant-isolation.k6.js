import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const responseTrend = new Trend('tenant_kpi_duration');

function buildConfigFromEnv() {
  return {
    baseUrl: __ENV.CORE_API_BASE_URL || 'http://localhost:8000',
    platformToken: __ENV.CORE_PLATFORM_TOKEN || 'platform-secret',
    tenants: [
      { slug: 'pilot', headers: { 'X-Tenant-Slug': 'pilot' } },
      { slug: 'beta', headers: { 'X-Tenant-Slug': 'beta' } }
    ]
  };
}

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

export function setup() {
  const config = buildConfigFromEnv();
  console.log(`[setup] Validando isolamento de tenant contra ${config.baseUrl}`);
  return config;
}

export function teardown(config) {
  console.log(`[teardown] Execução concluída para ${config.baseUrl}`);
}

export default function (config) {
  const tenants = config.tenants;
  const tenant = tenants[__ITER % tenants.length];
  const res = http.get(`${config.baseUrl}/reports/kpis`, { headers: tenant.headers });
  responseTrend.add(res.timings.duration, { tenant: tenant.slug });
  check(res, {
    'status 200': (r) => r.status === 200,
    'no tenant leak marker': (r) => !r.headers['x-tenant-scope']
  });
  sleep(0.5);
}

export function platformScenario(config) {
  const res = http.get(`${config.baseUrl}/tenants/reports/kpis`, {
    headers: {
      'X-Tenant-Scope': 'platform',
      'X-Tenant-Platform-Token': config.platformToken
    }
  });
  check(res, {
    'platform status 200': (r) => r.status === 200,
    'aggregated payload': (r) => r.json('tenants.length') >= 0
  });
  sleep(1);
}
