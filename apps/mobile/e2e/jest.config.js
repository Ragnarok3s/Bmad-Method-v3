module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 120000,
  setupFilesAfterEnv: ['./setup.ts']
};
