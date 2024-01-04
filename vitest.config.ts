import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/index.ts'],
      include: ['src/**/*.ts'],
      reporter: ['lcov']
    },
    include: ['tests/**/*.test.ts']
    // maxWorkers: 1,
    // minWorkers: 1
  }
})
