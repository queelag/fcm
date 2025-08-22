import { FetchError, StorageItem } from '@aracna/core'
import { FcmRegistration, createFcmECDH, generateFcmAuthSecret, registerToFCM } from '@aracna/fcm'
import { ECDH } from 'crypto'
import { ipcMain } from 'electron'
import { fcmClient } from '../clients/fcm-client'
import { DiskStorage } from '../storages/disk-storage'

const APP_ID: string = 'aracna.fcm.node-example'
// @ts-expect-error
const FIREBASE_API_KEY: string = import.meta.env.VITE_FIREBASE_API_KEY
// @ts-expect-error
const FIREBASE_APP_ID: string = import.meta.env.VITE_FIREBASE_APP_ID
// @ts-expect-error
const FIREBASE_PROJECT_ID: string = import.meta.env.VITE_FIREBASE_PROJECT_ID
// @ts-expect-error
const VAPID_KEY: string = import.meta.env.VITE_VAPID_KEY

ipcMain.handle('fcm:connect', async () => {
  let item: StorageItem | Error, connected: void | FetchError | Error

  item = await DiskStorage.get('fcm')
  if (item instanceof Error) throw item

  fcmClient.setAcgID(item.acg.id).setAcgSecurityToken(item.acg.securityToken).setAuthSecret(item.ece.authSecret).setEcdhPrivateKey(item.ece.privateKey)

  connected = await fcmClient.connect()
  if (connected instanceof Error) throw connected
})

ipcMain.handle('fcm:disconnect', () => fcmClient.disconnect())

ipcMain.handle('fcm:get-token', async () => {
  let item: StorageItem | Error

  item = await DiskStorage.get('fcm')
  if (item instanceof Error) return undefined

  return item.token
})

ipcMain.handle('fcm:is-registered', () => DiskStorage.has('fcm'))

ipcMain.handle('fcm:register', async () => {
  let authSecret: Buffer, ecdh: ECDH, registration: FcmRegistration | Error, item: StorageItem | Error, set: void | Error

  if (await DiskStorage.has('fcm')) {
    return
  }

  authSecret = generateFcmAuthSecret()
  ecdh = createFcmECDH()

  registration = await registerToFCM({
    appID: APP_ID,
    ece: {
      authSecret: authSecret,
      publicKey: ecdh.getPublicKey()
    },
    firebase: {
      apiKey: FIREBASE_API_KEY,
      appID: FIREBASE_APP_ID,
      projectID: FIREBASE_PROJECT_ID
    },
    vapidKey: VAPID_KEY
  })
  if (registration instanceof Error) throw registration

  console.log(registration)

  item = {
    acg: {
      id: registration.acg.id,
      securityToken: registration.acg.securityToken
    },
    ece: {
      authSecret: authSecret,
      privateKey: ecdh.getPrivateKey(),
      publicKey: ecdh.getPublicKey()
    },
    token: registration.token
  }

  await DiskStorage.set('fcm', item)
})
