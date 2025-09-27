import { writeFile } from 'fs/promises'
import pkg from '../../package.json' with { type: 'json' }

export async function writeDistPackageJSON() {
  let clone = JSON.parse(JSON.stringify(pkg))

  delete clone.devDependencies
  delete clone.engines
  delete clone.packageManager
  delete clone.publishConfig
  delete clone.scripts

  return writeFile('dist/package.json', JSON.stringify(clone, null, 2))
}
