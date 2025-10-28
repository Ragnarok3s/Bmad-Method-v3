import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './'
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/']
};

export default createJestConfig(customJestConfig);
