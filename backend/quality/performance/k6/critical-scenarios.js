import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const installLatency = new Trend('marketplace_install_latency', true);
const telemetryFailures = new Rate('knowledge_base_telemetry_failures');

const contractRampDuration = __ENV.K6_CONTRACT_RAMP_DURATION || '2m';
const contractPlateauDuration = __ENV.K6_CONTRACT_PLATEAU_DURATION || '2m';
const contractCooldownDuration = __ENV.K6_CONTRACT_COOLDOWN_DURATION || '1m';

function buildConfigFromEnv() {
  return {
    baseUrl: __ENV.K6_BASE_URL || 'https://staging.bmad-method.internal',
    marketplacePartner: __ENV.K6_PARTNER_ID || 'smart-pricing',
    workspaceId: __ENV.K6_WORKSPACE_ID || 'staging-observability',
    telemetrySurface: __ENV.K6_KB_SURFACE || 'k6-critical-flows',
    installActor: __ENV.K6_INSTALL_ACTOR || 'qa@bmad.io',
    kbSleep: Number(__ENV.K6_KB_SLEEP || 1)
  };
}

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
        { target: Number(__ENV.K6_CONTRACT_MAX_RATE || 12), duration: contractRampDuration },
        { target: Number(__ENV.K6_CONTRACT_MAX_RATE || 12), duration: contractPlateauDuration },
        { target: 0, duration: contractCooldownDuration }
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

export function setup() {
  const config = buildConfigFromEnv();
  console.log(`[setup] Executando cenários críticos contra ${config.baseUrl}`);
  return config;
}

export function teardown(config) {
  console.log(`[teardown] Concluído o teste do marketplace para ${config.baseUrl}`);
}

export function marketplaceBrowse(config) {
  const response = http.get(`${config.baseUrl}/marketplace/apps`, {
    tags: { name: 'marketplace_catalogue' }
  });

  check(response, {
    'catalogue responde 200': (res) => res.status === 200,
    'catalogue retorna lista': (res) => Array.isArray(res.json())
  });

  sleep(1);
}

export function partnerContractFlow(config) {
  const contractResponse = http.get(`${config.baseUrl}/marketplace/apps/${config.marketplacePartner}/contract`, {
    tags: { name: 'partner_contract' }
  });

  const contractData = contractResponse.json();
  const contractHasVersion = Boolean(contractData && contractData.version);
  check(contractResponse, {
    'contract responde 200': (res) => res.status === 200,
    'contract possui versão': () => contractHasVersion
  });

  const installPayload = {
    workspaceId: config.workspaceId,
    scopes: Array.isArray(contractData && contractData.scopes) ? contractData.scopes : [],
    grantedBy: config.installActor,
    sandboxRequested: true,
    correlationId: `k6-${__VU}-${Date.now()}`
  };

  const installResponse = http.post(
    `${config.baseUrl}/marketplace/apps/${config.marketplacePartner}/install`,
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

export function knowledgeBaseEngagement(config) {
  const catalogueResponse = http.get(`${config.baseUrl}/support/knowledge-base/catalog?limit=5`, {
    tags: { name: 'kb_catalogue' }
  });

  const catalogue = catalogueResponse.json();
  const articles = catalogue && catalogue.articles;
  const hasArticles = Array.isArray(articles) && articles.length > 0;

  check(catalogueResponse, {
    'kb catalogue responde 200': (res) => res.status === 200,
    'kb catalogue possui artigos': () => hasArticles
  });

  if (!hasArticles) {
    telemetryFailures.add(1);
    sleep(1);
    return;
  }

  const target = articles[Math.floor(Math.random() * articles.length)];
  const articleResponse = http.get(`${config.baseUrl}/support/knowledge-base/articles/${target.slug}`, {
    tags: { name: 'kb_article' }
  });

  check(articleResponse, {
    'kb article responde 200': (res) => res.status === 200,
    'kb article possui conteúdo': (res) => {
      const articleBody = res.json();
      return Boolean(articleBody && articleBody.content);
    }
  });

  const telemetryPayload = {
    event: 'article_view',
    slug: target.slug,
    surface: config.telemetrySurface
  };

  const telemetryResponse = http.post(
    `${config.baseUrl}/support/knowledge-base/telemetry`,
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

  sleep(config.kbSleep);
}
