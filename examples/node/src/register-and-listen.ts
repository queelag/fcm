import {
  FcmClient,
  FcmClientLogin,
  FcmClientMessage,
  FcmClientMessageData,
  FcmRegistration,
  createFcmECDH,
  generateFcmAuthSecret,
  registerToFCM
} from '@aracna/fcm'
import { ECDH } from 'crypto'
import { DiskStorage } from './storages/disk-storage'

const APP_ID: string = 'aracna.fcm.node-example'
const FIREBASE_API_KEY: string = import.meta.env.VITE_FIREBASE_API_KEY
const FIREBASE_APP_ID: string = import.meta.env.VITE_FIREBASE_APP_ID
const FIREBASE_PROJECT_ID: string = import.meta.env.VITE_FIREBASE_PROJECT_ID
const VAPID_KEY: string = import.meta.env.VITE_VAPID_KEY

async function register(): Promise<void> {
  let authSecret: Uint8Array, ecdh: ECDH, registration: FcmRegistration | Error

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

  await DiskStorage.set('fcm', {
    ece: {
      authSecret: authSecret,
      privateKey: ecdh.getPrivateKey(),
      publicKey: ecdh.getPublicKey()
    },
    ...registration
  })
}

async function listen(): Promise<void> {
  let fcm: Record<string, any> | Error, client: FcmClient

  fcm = await DiskStorage.get('fcm')
  if (fcm instanceof Error) throw fcm

  client = new FcmClient({
    acg: {
      id: fcm.acg.id,
      securityToken: fcm.acg.securityToken
    },
    ece: {
      authSecret: fcm.ece.authSecret,
      privateKey: fcm.ece.privateKey
    },
    storage: {
      instance: DiskStorage
    }
  })

  client.on('login', (login: FcmClientLogin) => {
    console.log(login)
  })

  client.on('message', (message: FcmClientMessage) => {
    console.log(message)
  })

  client.on('message-data', (message: FcmClientMessageData) => {
    console.log(message)
  })

  client.connect()
}

await register()
await listen()
