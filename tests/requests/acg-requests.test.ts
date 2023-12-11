import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { ACGCheckinResponse } from '../../src/definitions/interfaces'
import { postACGCheckin, postACGRegister } from '../../src/requests/acg-requests'
import { ACG_ID, ACG_SECURITY_TOKEN } from '../definitions/constants'

describe('ACG Requests', () => {
  it('checks-in', async () => {
    let checkin: ACGCheckinResponse | FetchError

    checkin = await postACGCheckin()
    if (checkin instanceof Error) throw checkin

    expect(checkin.android_id).toBeTypeOf('bigint')
    expect(checkin.security_token).toBeTypeOf('bigint')
  })

  it('checks-in with existing id and security token', async () => {
    let checkin: ACGCheckinResponse | FetchError

    checkin = await postACGCheckin(ACG_ID, ACG_SECURITY_TOKEN)
    if (checkin instanceof Error) throw checkin

    expect(checkin.android_id).toBe(ACG_ID)
    expect(checkin.security_token).toBe(ACG_SECURITY_TOKEN)
  })

  it('registers', async () => {
    let token: string | FetchError

    token = await postACGRegister(ACG_ID, ACG_SECURITY_TOKEN, 'aracna.fcm')
    if (token instanceof Error) throw token

    expect(token).toBeTypeOf('string')
  })
})
