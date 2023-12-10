import { generateRandomString } from '@aracna/core'
import { describe, test } from 'vitest'
import { ACGCheckinResponse } from '../../src/definitions/interfaces'
import { ACGCheckinRequest, ACGRegisterRequest } from '../../src/requests/acg-requests'

describe(() => {
  test('does something', async () => {
    let checkin: ACGCheckinResponse | Error

    checkin = await ACGCheckinRequest()
    if (checkin instanceof Error) throw checkin

    await ACGRegisterRequest(generateRandomString(), checkin.android_id, checkin.security_token)
  })
})
