import { getSnakeCaseString } from '@aracna/core'
import { execSync } from 'child_process'
import { readFile, rm, writeFile } from 'fs/promises'
import { glob } from 'glob'

execSync(
  [
    `pnpm pbjs proto/android-checkin.proto -t json -o src/assets/android-checkin.json --keep-case`,
    `pnpm pbjs proto/checkin.proto -t json -o src/assets/checkin.json --keep-case`,
    `pnpm pbjs proto/mcs.proto -t json -o src/assets/mcs.json --keep-case`
  ].join(' && ')
)

for (let path of await glob('src/assets/*.json')) {
  let name, json, ts

  name = getSnakeCaseString(path.replace('src/assets/', '').replace('.json', ''))
  json = JSON.parse(await readFile(path, 'utf8'), (key, value) => (key === 'edition' ? undefined : value))

  ts = [`import type { INamespace } from 'protobufjs'`, ``, `export const ${name.toUpperCase()}_PROTO_JSON: INamespace = ${JSON.stringify(json)}`].join('\n')

  await rm(path)
  await writeFile(path.replace('.json', '-proto-json.ts'), ts)
}
