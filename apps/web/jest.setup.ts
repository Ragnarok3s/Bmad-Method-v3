import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import * as util from 'util';

const { TextEncoder: UtilTextEncoder, TextDecoder: UtilTextDecoder } = util;

if (typeof global.TextEncoder === 'undefined' && typeof UtilTextEncoder !== 'undefined') {
  global.TextEncoder = UtilTextEncoder as unknown as typeof global.TextEncoder;
}

if (typeof global.TextDecoder === 'undefined' && typeof UtilTextDecoder !== 'undefined') {
  // @ts-expect-error - Jest environment lacks TextDecoder typings on global
  global.TextDecoder = UtilTextDecoder as unknown;
}

const fetchMock = (require('jest-fetch-mock') as typeof import('jest-fetch-mock')).default;

process.env.NEXT_DISABLE_LOCKFILE_CHECK = 'true';
process.env.NEXT_PUBLIC_CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});
