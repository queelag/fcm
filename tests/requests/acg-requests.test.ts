import { FetchError } from '@aracna/core'
import { beforeAll, describe, expect, it } from 'vitest'
import { ACGCheckinResponse } from '../../src/definitions/interfaces'
import { postACGCheckin, postACGRegister } from '../../src/requests/acg-requests'

describe('ACG Requests', () => {
  let id: bigint, securityToken: bigint

  beforeAll(() => {
    id = 5202905205808241432n
    securityToken = 8939553500809616555n
  })

  it('checks-in', async () => {
    let checkin: ACGCheckinResponse | FetchError

    checkin = await postACGCheckin()
    if (checkin instanceof Error) throw checkin

    expect(checkin.android_id).toBeTypeOf('bigint')
    expect(checkin.security_token).toBeTypeOf('bigint')
  })

  it('checks-in with existing id and security token', async () => {
    let checkin: ACGCheckinResponse | FetchError

    checkin = await postACGCheckin(id, securityToken)
    if (checkin instanceof Error) throw checkin

    expect(checkin.android_id).toBe(id)
    expect(checkin.security_token).toBe(securityToken)
  })

  it('registers', async () => {
    let token: string | FetchError

    token = await postACGRegister(id, securityToken, 'aracna.fcm')
    if (token instanceof Error) throw token

    expect(token).toBeTypeOf('string')
  })
})
