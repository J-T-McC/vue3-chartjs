module.exports = {
  verbose: true,
  clearMocks: true,
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest'
  },
  setupFiles: ['jest-canvas-mock'],
  collectCoverage: true
}
