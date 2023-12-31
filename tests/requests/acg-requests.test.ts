import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { AcgCheckinResponse } from '../../src/definitions/interfaces'
import { postAcgCheckin, postAcgRegister } from '../../src/requests/acg-requests'
import { ACG_ID, ACG_SECURITY_TOKEN } from '../definitions/constants'

describe('ACG Requests', () => {
  it('checks-in', async () => {
    let checkin: AcgCheckinResponse | FetchError

    checkin = await postAcgCheckin()
    if (checkin instanceof Error) throw checkin

    expect(checkin.android_id).toBeTypeOf('bigint')
    expect(checkin.security_token).toBeTypeOf('bigint')
  })

  it('checks-in with existing id and security token', async () => {
    let checkin: AcgCheckinResponse | FetchError

    checkin = await postAcgCheckin(ACG_ID, ACG_SECURITY_TOKEN)
    if (checkin instanceof Error) throw checkin

    expect(checkin.android_id).toBe(ACG_ID)
    expect(checkin.security_token).toBe(ACG_SECURITY_TOKEN)
  })

  it('registers', async () => {
    let token: string | FetchError

    token = await postAcgRegister(ACG_ID, ACG_SECURITY_TOKEN, 'aracna.fcm')
    if (token instanceof Error) throw token

    expect(token).toBeTypeOf('string')
  })

  it('registers with fresh id and security token', async () => {
    let checkin: AcgCheckinResponse | FetchError, token: string | FetchError

    checkin = await postAcgCheckin()
    if (checkin instanceof Error) throw checkin

    token = await postAcgRegister(checkin.android_id, checkin.security_token, 'aracna.fcm')
    if (token instanceof Error) throw token

    expect(token).toBeTypeOf('string')
  })
})
