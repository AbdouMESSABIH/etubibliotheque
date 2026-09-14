module.exports = {
  preset: 'jest-preset-angular',

  roots: ['<rootDir>/src/'],

  testMatch: [
    '**/+(*.)+(spec).+(ts|js)'
  ],

  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],

  collectCoverage: true,

  collectCoverageFrom: [
    '<rootDir>/src/app/**/*.ts',
    '!<rootDir>/src/app/**/*.spec.ts',
    '!<rootDir>/src/app/**/*.d.ts'
  ],

  coverageDirectory: '<rootDir>/coverage',

  coverageReporters: [
    'html',
    'text-summary'
  ]
};