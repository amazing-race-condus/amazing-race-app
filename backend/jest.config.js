const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./tests/jest.setup.ts"],
}

export default config
export const preset = "ts-jest"
export const testEnvironment = "node"
export const testMatch = ["**/tests/**/*.test.ts"]
