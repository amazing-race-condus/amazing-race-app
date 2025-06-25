const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./tests/jest.setup.ts"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["prisma[/\\\\]prisma[/\\\\]runtime"]
}

export default config
export const preset = "ts-jest"
export const testEnvironment = "node"
export const testMatch = ["**/tests/**/*.test.ts"]
