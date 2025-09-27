import { cp, rm } from 'fs/promises'
import { bundle } from './fns/bundle.mjs'
import { emitDeclarations } from './fns/emit-declarations.mjs'
import { generateProtoDefinitions } from './fns/generate-proto-definitions.mjs'
import { generateProtoTS } from './fns/generate-proto-ts.mjs'
import { writeDistPackageJSON } from './fns/write-dist-package-json.mjs'

await rm('dist', { force: true, recursive: true })

await generateProtoDefinitions()
await generateProtoTS()
await bundle()
await emitDeclarations()
await writeDistPackageJSON()

await cp('LICENSE', 'dist/LICENSE')
await cp('README.md', 'dist/README.md')
