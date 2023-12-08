import { CoreClassLogger, CoreModuleLogger, generateRandomString } from '@aracna/core'
import { beforeAll, describe, test } from 'vitest'
import { ACGCheckin } from '../../src/functions/acg-checkin'
import { ACGRegister } from '../../src/functions/acg-register'
import { AndroidCheckinResponse } from '../../src/proto/checkin'

describe(() => {
  beforeAll(() => {
    CoreClassLogger.enable()
    CoreClassLogger.setLevel('verbose')

    CoreModuleLogger.enable()
    CoreModuleLogger.setLevel('verbose')
  })

  test('does something', async () => {
    let checkin: AndroidCheckinResponse | Error

    checkin = await ACGCheckin()
    if (checkin instanceof Error) throw checkin

    await ACGRegister(generateRandomString(), checkin.androidId, checkin.securityToken)
  })
})
