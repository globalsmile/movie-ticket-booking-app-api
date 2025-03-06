// jest.config.js
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./__tests__/setup.js'],
    testPathIgnorePatterns: ['/__tests__/setup.js']
  };
  