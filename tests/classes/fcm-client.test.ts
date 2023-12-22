import { DeferredPromise, FetchError, PromiseState } from '@aracna/core'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FcmApiError, FcmApiMessage, FcmClient, FcmClientACG, FcmClientECDH, FcmClientMessage, FcmClientMessageData, sendFcmMessage } from '../../src'
import { McsTag } from '../../src/definitions/enums'
import {
  ACG_ID,
  ACG_SECURITY_TOKEN,
  ECDH_PRIVATE_KEY,
  ECDH_SALT,
  FCM_SENDER_ID,
  FCM_TOKEN,
  FIREBASE_PROJECT_ID,
  GOOGLE_SERVICE_ACCOUNT
} from '../definitions/constants'

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
    client = new FcmClient(acg, ecdh)
  })

  it('closes if a bad message is sent', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('close', () => promise.resolve())

    await client.connect()
    client.socket.write(Buffer.from([McsTag.CLOSE]))
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
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

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('logs-in', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('login', () => promise.resolve())

    await client.connect()
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('receives the iq', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('iq', () => promise.resolve())

    await client.connect()
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('emits the message event', async () => {
    let promise: DeferredPromise<FcmClientMessage>, sent: FcmApiMessage | FcmApiError, message: FcmClientMessage

    promise = new DeferredPromise()

    client.on('message', (message: FcmClientMessage) => promise.resolve(message))

    await client.connect()

    sent = await sendFcmMessage(FIREBASE_PROJECT_ID, GOOGLE_SERVICE_ACCOUNT, { token: FCM_TOKEN })
    if (sent instanceof Error) throw sent

    message = await promise.instance

    expect(message.id).toBeTypeOf('string')
  }, 20000)

  it('emits the message-data event', async () => {
    let promise: DeferredPromise<FcmClientMessageData>, sent: FcmApiMessage | FcmApiError, data: FcmClientMessageData

    promise = new DeferredPromise()

    client.on('message-data', (data: FcmClientMessageData) => promise.resolve(data))

    await client.connect()

    sent = await sendFcmMessage(FIREBASE_PROJECT_ID, GOOGLE_SERVICE_ACCOUNT, { token: FCM_TOKEN })
    if (sent instanceof Error) throw sent

    data = await promise.instance

    expect(data.from).toBe(FCM_SENDER_ID)
  }, 20000)

  it('logins multiple times with the same client instance', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('login', () => promise.resolve())

    await client.connect()
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)

    promise = new DeferredPromise()

    await client.disconnect()
    await client.connect()
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)

    promise = new DeferredPromise()

    await client.disconnect(new Error())
    await client.connect()
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })
})
