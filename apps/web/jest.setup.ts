import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import fetchMock from 'jest-fetch-mock';

process.env.NEXT_DISABLE_LOCKFILE_CHECK = 'true';
process.env.NEXT_PUBLIC_CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});
