import Long from 'long'

export function parseLong(number: bigint, unsigned?: boolean | number, radix?: number): Long {
  return Long.fromString(number.toString(), unsigned, radix)
}
