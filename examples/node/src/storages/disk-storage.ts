import { AsyncStorage, StorageItem, tcp } from '@aracna/core'
import { Stats } from 'fs'
import { lstat, readFile, writeFile } from 'fs/promises'
import { deserialize, serialize } from 'v8'

const PATH: string = 'storage.json'

export const DiskStorage: AsyncStorage = new AsyncStorage(
  'DiskStorage',
  async () => writeFile(PATH, serialize({})),
  async (key: string) => {
    let path: string, stat: Stats | Error, file: Buffer, json: Record<string, any>, item: any

    path = PATH
    stat = await tcp(() => lstat(path), false)

    if (stat instanceof Error) {
      await writeFile(path, serialize({}))
    }

    file = await readFile(path)
    json = deserialize(file)
    item = json[key]

    if (item) {
      return item
    }

    return new Error(`The item does not exist.`)
  },
  async (key: string) => {
    let path: string, stat: Stats | Error, file: Buffer, json: Record<string, any>

    path = PATH
    stat = await tcp(() => lstat(path), false)

    if (stat instanceof Error) {
      await writeFile(path, serialize({}))
    }

    file = await readFile(path)
    json = deserialize(file)

    return Boolean(json[key])
  },
  async (key: string) => {
    let path: string, stat: Stats | Error, file: Buffer, json: Record<string, any>

    path = PATH
    stat = await tcp(() => lstat(path), false)

    if (stat instanceof Error) {
      await writeFile(path, serialize({}))
    }

    file = await readFile(path)
    json = deserialize(file)

    if (json[key]) {
      delete json[key]
    }

    return writeFile(path, serialize(json))
  },
  async (key: string, item: StorageItem) => {
    let path: string, stat: Stats | Error, file: Buffer, json: Record<string, any>

    path = PATH
    stat = await tcp(() => lstat(path), false)

    if (stat instanceof Error) {
      await writeFile(path, serialize({}))
    }

    file = await readFile(path)
    json = deserialize(file)

    json[key] = item

    return writeFile(path, serialize(json))
  }
)
