import nextJest from 'next/jest';

process.env.NEXT_DISABLE_LOCKFILE_CHECK = 'true';

const createJestConfig = nextJest({
  dir: './'
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  roots: ['<rootDir>', '<rootDir>/../../tests/web']
};

export default createJestConfig(customJestConfig);
