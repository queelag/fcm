import { execSync } from 'child_process'

export async function emitDeclarations() {
  try {
    execSync('npm exec tsc', { stdio: 'inherit' })
    execSync('npm exec api-extractor run --local', { stdio: 'inherit' })
  } catch (e) {
    return e
  }
}
