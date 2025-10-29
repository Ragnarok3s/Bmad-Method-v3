import detox from 'detox';
import adapter from 'detox/runners/jest/adapter';
import specReporter from 'detox/runners/jest/specReporter';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const detoxConfig = require('../detox.config');

declare const global: typeof globalThis & {
  detox: typeof detox;
};

jest.setTimeout(120000);

jasmine.getEnv().addReporter(adapter);
jasmine.getEnv().addReporter(specReporter);

beforeAll(async () => {
  await detox.init(detoxConfig, { launchApp: false });
  global.detox = detox;
});

afterAll(async () => {
  await detox.cleanup();
});

afterEach(async () => {
  await adapter.afterEach();
});
