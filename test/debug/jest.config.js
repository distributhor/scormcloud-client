module.exports = {
  automock: false,
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: [
    '**/debug/?(*.)+(spec|test).[t]s?(x)'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/node/',
    '/dist/',
    '/lib/'
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
}
