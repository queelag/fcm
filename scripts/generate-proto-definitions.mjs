import { getPascalCaseString, getSnakeCaseString } from '@aracna/core'
import { execSync } from 'child_process'
import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import { glob } from 'glob'

await rm('src/definitions/proto', { force: true, recursive: true })
await mkdir('src/definitions/proto', { recursive: true })

execSync(
  [
    `protoc`,
    `--plugin=node_modules/.bin/protoc-gen-ts_proto`,
    `--ts_proto_opt=forceLong=long`,
    `--ts_proto_opt=esModuleInterop=true`,
    `--ts_proto_opt=importSuffix=.js`,
    `--ts_proto_opt=onlyTypes=true`,
    `--ts_proto_opt=snakeToCamel=false`,
    `--ts_proto_opt=useSnakeTypeName=false`,
    `--ts_proto_out=src/definitions/proto`,
    `-I=proto proto/*.proto`
  ].join(' ')
)

for (let path of await glob('src/definitions/proto/*.ts')) {
  let name, ts

  name = getSnakeCaseString(path.replace('src/definitions/proto/', '').replace('.ts', ''))
  ts = await readFile(path, 'utf8')

  if (name === 'checkin') {
    ts = ts.replace('import { type AndroidCheckinProto }', 'import type { AndroidCheckinDefinitions }')
    ts = ts.replace('android-checkin.js', 'android-checkin-definitions.js')
    ts = ts.replace('AndroidCheckinProto', 'AndroidCheckinDefinitions.AndroidCheckinProto')
  }

  ts = ts.replace('export const protobufPackage', `export namespace ${getPascalCaseString(name)}Definitions {\nexport const protobufPackage`)
  ts = ts.replace('if (_m0.util.Long !== Long) {', '}\n\nif (_m0.util.Long !== Long) {')
  ts += '}'

  await rm(path)
  await writeFile(path.replace('.ts', '-definitions.ts'), ts)
}
