module.exports = {
  transform: {
    ".(ts|tsx)": "<rootDir>/test/preprocessor.js"
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "./test/setup.ts"
  ],
  moduleNameMapper: {
    "^@dataproviders/(.*)$": "<rootDir>/src/dataproviders/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@frameworks/(.*)$": "<rootDir>/src/frameworks/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@test/(.*)$": "<rootDir>/test/$1"
  }
}
