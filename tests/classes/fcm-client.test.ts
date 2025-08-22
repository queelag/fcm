import { DeferredPromise, FetchError, generateRandomString } from '@aracna/core'
import { ECDH } from 'crypto'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  FcmApiError,
  FcmApiMessage,
  FcmClient,
  FcmClientACG,
  FcmClientECE,
  FcmClientMessage,
  FcmClientMessageData,
  FcmRegistration,
  createFcmECDH,
  generateFcmAuthSecret,
  registerToFCM,
  sendFcmMessage
} from '../../src'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { McsTag } from '../../src/definitions/enums'
import { APP_ID, FCM_SENDER_ID, FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_PROJECT_ID, GOOGLE_SERVICE_ACCOUNT, VAPID_KEY } from '../definitions/constants'

describe('FcmClient', () => {
  let auth: Buffer, ecdh: ECDH, registration: FcmRegistration | Error, acg: FcmClientACG, ece: FcmClientECE, token: string, client: FcmClient

  afterEach(async () => {
    await client.disconnect()
  })

  beforeAll(async () => {
    auth = generateFcmAuthSecret()
    ecdh = createFcmECDH()

    registration = await registerToFCM({
      appID: APP_ID,
      ece: {
        authSecret: auth,
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

    acg = registration.acg
    ece = {
      authSecret: auth,
      privateKey: ecdh.getPrivateKey()
    }
    token = registration.token
  })

  beforeEach(() => {
    client = new FcmClient({ acg, ece })
  })

  it('closes if a bad message is sent', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('close', () => promise.resolve())

    await client.connect()
    client.getSocket()?.write(Buffer.from([McsTag.CLOSE]))
    await promise.instance

    expect(promise.state).toBe('fulfilled')
  })

  it('connects', async () => {
    let connected: void | FetchError | Error

    connected = await client.connect()
    if (connected instanceof Error) throw connected

    expect(connected).toBeUndefined()
  })

  it('has working heartbeat', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('heartbeat', () => promise.resolve())

    await client.connect()
    await promise.instance

    expect(promise.state).toBe('fulfilled')
  })

  it('logs-in', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('login', () => promise.resolve())

    await client.connect()
    await promise.instance

    expect(promise.state).toBe('fulfilled')
  })

  it('logs-in multiple times with the same client instance', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('login', () => promise.resolve())

    await client.connect()
    await promise.instance

    expect(promise.state).toBe('fulfilled')

    promise = new DeferredPromise()

    await client.disconnect()
    await client.connect()
    await promise.instance

    expect(promise.state).toBe('fulfilled')

    promise = new DeferredPromise()

    await client.disconnect(new Error())
    await client.connect()
    await promise.instance

    expect(promise.state).toBe('fulfilled')
  })

  it('receives the iq', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('iq', () => promise.resolve())

    await client.connect()
    await promise.instance

    expect(promise.state).toBe('fulfilled')
  })

  it('emits the message and message-data events', { retry: 4, timeout: 10000 }, async () => {
    let pm: DeferredPromise<FcmClientMessage>,
      pmd: DeferredPromise<FcmClientMessageData>,
      sent: FcmApiMessage | FcmApiError,
      message: FcmClientMessage,
      data: FcmClientMessageData

    pm = new DeferredPromise()
    pmd = new DeferredPromise()

    client.on('message', (message: FcmClientMessage) => pm.resolve(message))
    client.on('message-data', (data: FcmClientMessageData) => pmd.resolve(data))

    await client.connect()

    sent = await sendFcmMessage(GOOGLE_SERVICE_ACCOUNT, { android: { priority: FcmApiDefinitions.V1.AndroidMessagePriority.HIGH }, token })
    if (sent instanceof Error) throw sent

    message = await pm.instance
    data = await pmd.instance

    expect(message.id).toBeTypeOf('string')
    expect(data.from).toBe(FCM_SENDER_ID)
  })

  it('handles big messages with multiple async bytes reception', { retry: 4, timeout: 10000 }, async () => {
    let promise: DeferredPromise<FcmClientMessage>, sent: FcmApiMessage | FcmApiError, message: FcmClientMessage

    promise = new DeferredPromise()

    client.on('message', (message: FcmClientMessage) => promise.resolve(message))

    await client.connect()

    sent = await sendFcmMessage(GOOGLE_SERVICE_ACCOUNT, {
      android: { priority: FcmApiDefinitions.V1.AndroidMessagePriority.HIGH },
      data: {
        random: generateRandomString({ size: 2048 })
      },
      token: token
    })
    if (sent instanceof Error) throw sent

    message = await promise.instance

    expect(message.id).toBeTypeOf('string')
  })
})
