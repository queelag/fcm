import { CoreClassLogger, CoreModuleLogger } from '@aracna/core'
import { beforeAll, describe, expect, test } from 'vitest'
import { ACGCheckin } from '../../src/functions/acg-checkin'

describe(() => {
  beforeAll(() => {
    CoreClassLogger.enable()
    CoreClassLogger.setLevel('verbose')

    CoreModuleLogger.enable()
    CoreModuleLogger.setLevel('verbose')
  })

  test('does something', async () => {
    await ACGCheckin()
    expect(true).toBeTruthy()
  })
})
