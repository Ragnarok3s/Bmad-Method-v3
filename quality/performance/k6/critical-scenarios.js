import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.K6_BASE_URL || 'https://staging.bmad-method.internal';
const MARKETPLACE_PARTNER = __ENV.K6_PARTNER_ID || 'smart-pricing';
const WORKSPACE_ID = __ENV.K6_WORKSPACE_ID || 'staging-observability';
const TELEMETRY_SURFACE = __ENV.K6_KB_SURFACE || 'k6-critical-flows';

const installLatency = new Trend('marketplace_install_latency', true);
const telemetryFailures = new Rate('knowledge_base_telemetry_failures');

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<800', 'avg<500'],
    http_req_failed: ['rate<0.02'],
    'checks{scenario:marketplace_browse}': ['rate>0.95'],
    'checks{scenario:partner_contract}': ['rate>0.95'],
    'checks{scenario:knowledge_base_engagement}': ['rate>0.95'],
    marketplace_install_latency: ['p(95)<900'],
    knowledge_base_telemetry_failures: ['rate<0.05']
  },
  scenarios: {
    marketplace_browse: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.K6_BROWSE_RATE || 20),
      timeUnit: '1m',
      duration: __ENV.K6_BROWSE_DURATION || '3m',
      preAllocatedVUs: Number(__ENV.K6_BROWSE_VUS || 5),
      exec: 'marketplaceBrowse'
    },
    partner_contract: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1m',
      stages: [
        { target: Number(__ENV.K6_CONTRACT_MAX_RATE || 12), duration: '2m' },
        { target: Number(__ENV.K6_CONTRACT_MAX_RATE || 12), duration: '2m' },
        { target: 0, duration: '1m' }
      ],
      preAllocatedVUs: Number(__ENV.K6_CONTRACT_VUS || 4),
      exec: 'partnerContractFlow'
    },
    knowledge_base_engagement: {
      executor: 'constant-vus',
      vus: Number(__ENV.K6_KB_VUS || 6),
      duration: __ENV.K6_KB_DURATION || '4m',
      exec: 'knowledgeBaseEngagement'
    }
  }
};

export function marketplaceBrowse() {
  const response = http.get(`${BASE_URL}/marketplace/apps`, {
    tags: { name: 'marketplace_catalogue' }
  });

  check(response, {
    'catalogue responde 200': (res) => res.status === 200,
    'catalogue retorna lista': (res) => Array.isArray(res.json())
  });

  sleep(1);
}

export function partnerContractFlow() {
  const contractResponse = http.get(`${BASE_URL}/marketplace/apps/${MARKETPLACE_PARTNER}/contract`, {
    tags: { name: 'partner_contract' }
  });

  const contractData = contractResponse.json();
  check(contractResponse, {
    'contract responde 200': (res) => res.status === 200,
    'contract possui versão': () => Boolean(contractData?.version)
  });

  const installPayload = {
    workspaceId: WORKSPACE_ID,
    scopes: contractData?.scopes || [],
    grantedBy: __ENV.K6_INSTALL_ACTOR || 'qa@bmad.io',
    sandboxRequested: true,
    correlationId: `k6-${__VU}-${Date.now()}`
  };

  const installResponse = http.post(
    `${BASE_URL}/marketplace/apps/${MARKETPLACE_PARTNER}/install`,
    JSON.stringify(installPayload),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'partner_install' }
    }
  );

  check(installResponse, {
    'install aceita sandbox': (res) => res.status === 202
  });

  installLatency.add(installResponse.timings.duration);
  sleep(1);
}

export function knowledgeBaseEngagement() {
  const catalogueResponse = http.get(`${BASE_URL}/support/knowledge-base/catalog?limit=5`, {
    tags: { name: 'kb_catalogue' }
  });

  const catalogue = catalogueResponse.json();
  const hasArticles = Array.isArray(catalogue?.articles) && catalogue.articles.length > 0;

  check(catalogueResponse, {
    'kb catalogue responde 200': (res) => res.status === 200,
    'kb catalogue possui artigos': () => hasArticles
  });

  if (!hasArticles) {
    telemetryFailures.add(1);
    sleep(1);
    return;
  }

  const target = catalogue.articles[Math.floor(Math.random() * catalogue.articles.length)];
  const articleResponse = http.get(`${BASE_URL}/support/knowledge-base/articles/${target.slug}`, {
    tags: { name: 'kb_article' }
  });

  check(articleResponse, {
    'kb article responde 200': (res) => res.status === 200,
    'kb article possui conteúdo': (res) => Boolean(res.json()?.content)
  });

  const telemetryPayload = {
    event: 'article_view',
    slug: target.slug,
    surface: TELEMETRY_SURFACE
  };

  const telemetryResponse = http.post(
    `${BASE_URL}/support/knowledge-base/telemetry`,
    JSON.stringify(telemetryPayload),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'kb_telemetry' }
    }
  );

  const accepted = telemetryResponse.status === 202;
  telemetryFailures.add(accepted ? 0 : 1);

  check(telemetryResponse, {
    'kb telemetry aceita evento': () => accepted
  });

  sleep(Number(__ENV.K6_KB_SLEEP || 1));
}
