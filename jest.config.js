module.exports = {
  automock: false,
  clearMocks: true,
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["test/?(*.)+(spec|test).[jt]s?(x)"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
  // transformIgnorePatterns: ["<rootDir>/node_modules/"]
  // moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // setupFiles: ["./setupJest.ts"]
};
