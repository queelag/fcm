import { Reader, Type } from 'protobufjs'

export function decodeProtoType<T extends object>(type: Type, reader: Reader | Uint8Array, length?: number): T {
  return type.decode(reader, length) as T
}
