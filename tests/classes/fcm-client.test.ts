import { DeferredPromise, FetchError, PromiseState, decodeBase64, decodeText } from '@aracna/core'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FcmApiError, FcmApiMessage, FcmClient, FcmClientACG, FcmClientECDH, FcmClientMessage, FcmClientMessageData, sendFcmMessage } from '../../src'
import { MCSTag } from '../../src/definitions/enums'
import { ClassLogger } from '../../src/loggers/class-logger'
import { ACG_ID, ACG_SECURITY_TOKEN, ECDH_PRIVATE_KEY, ECDH_SALT } from '../definitions/constants'

describe('FcmClient', () => {
  let acg: FcmClientACG, ecdh: FcmClientECDH, client: FcmClient

  afterEach(async () => {
    await client.disconnect()
  })

  beforeAll(() => {
    acg = {
      id: ACG_ID,
      securityToken: ACG_SECURITY_TOKEN
    }
    ecdh = {
      privateKey: ECDH_PRIVATE_KEY,
      salt: ECDH_SALT
    }
  })

  beforeEach(() => {
    client = new FcmClient()
  })

  it('closes if a bad message is sent', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('close', () => promise.resolve())

    await client.connect(acg, ecdh)
    client.socket.write(Buffer.from([MCSTag.CLOSE]))
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('connects', async () => {
    let connected: void | FetchError | Error

    connected = await client.connect(acg, ecdh)
    if (connected instanceof Error) throw connected

    expect(connected).toBeUndefined()
  })

  it('has working heartbeat', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('heartbeat', () => promise.resolve())

    await client.connect(acg, ecdh)
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('logs-in', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('login', () => promise.resolve())

    await client.connect(acg, ecdh)
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('receives the iq', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('iq', () => promise.resolve())

    await client.connect(acg, ecdh)
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('emits the message event', async () => {
    let promise: DeferredPromise<FcmClientMessage>, sent: FcmApiMessage | FcmApiError, message: FcmClientMessage

    promise = new DeferredPromise()

    ClassLogger.enable()
    ClassLogger.setLevel('verbose')

    client.on('message', (message: FcmClientMessage) => promise.resolve(message))

    await client.connect(acg, ecdh)

    sent = await sendFcmMessage(import.meta.env.VITE_FIREBASE_PROJECT_ID, JSON.parse(decodeText(decodeBase64(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT))), {
      token: import.meta.env.VITE_FCM_TOKEN
    })
    if (sent instanceof Error) throw sent

    message = await promise.instance

    expect(message.id).toBeTypeOf('string')
  }, 20000)

  it('emits the message-data event', async () => {
    let promise: DeferredPromise<FcmClientMessageData>, sent: FcmApiMessage | FcmApiError, data: FcmClientMessageData

    promise = new DeferredPromise()

    client.on('message-data', (data: FcmClientMessageData) => promise.resolve(data))

    await client.connect(acg, ecdh)

    sent = await sendFcmMessage(import.meta.env.VITE_FIREBASE_PROJECT_ID, JSON.parse(decodeText(decodeBase64(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT))), {
      token: import.meta.env.VITE_FCM_TOKEN
    })
    if (sent instanceof Error) throw sent

    data = await promise.instance

    expect(data.from).toBe(import.meta.env.VITE_FCM_SENDER_ID)
  }, 20000)
})
