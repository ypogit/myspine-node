/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testMatch: ["<rootDir>/**/*.{test,spec}.{js,ts}"],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
    '^.+\\.js$': 'babel-jest',
  },
  useStderr: true,
  watchman: false
};