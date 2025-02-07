module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\ts': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  setupFiles: ['jest-canvas-mock'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  coverageProvider: "v8",
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
}
