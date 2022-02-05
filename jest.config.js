module.exports = {
  transform: {
    '^.+\\.vue$': 'vue3-jest',
    '^.+\\js$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node']
}
