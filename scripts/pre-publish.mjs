import { cp } from 'fs/promises'

await cp('LICENSE', 'dist/LICENSE', { force: true })
await cp('README.md', 'dist/README.md', { force: true })
await cp('package.json', 'dist/package.json', { force: true })
