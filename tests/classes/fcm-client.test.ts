import { DeferredPromise, FetchError, PromiseState } from '@aracna/core'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FCMClient, FCMClientACG, FCMClientECDH, Message, MessageData } from '../../src'
import { FCMAPIDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { MCSTag } from '../../src/definitions/enums'
import { postFCMSend } from '../../src/requests/fcm-requests'
import { ACG_ID, ACG_SECURITY_TOKEN, ECDH_PRIVATE_KEY, ECDH_SALT } from '../definitions/constants'

describe('FCMClient', () => {
  let acg: FCMClientACG, ecdh: FCMClientECDH, client: FCMClient

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
    client = new FCMClient(acg, ecdh)
  })

  it('closes if a bad message is sent', async () => {
    let promise: DeferredPromise<void> = new DeferredPromise()

    client.on('close', () => promise.resolve())

    await client.connect()
    client.socket.write(Buffer.from([MCSTag.CLOSE]))
    await promise.instance

    expect(promise.state).toBe(PromiseState.FULFILLED)
  })

  it('connects', async () => {
    let connected: void | FetchError

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
    let promise: DeferredPromise<Message>, send: FCMAPIDefinitions.SendResponseData | FetchError, message: Message

    promise = new DeferredPromise()

    client.on('message', (message: Message) => promise.resolve(message))

    await client.connect()

    send = await postFCMSend(import.meta.env.VITE_FCM_SERVER_KEY, import.meta.env.VITE_FCM_TOKEN, {})
    if (send instanceof Error) throw send

    message = await promise.instance

    expect(message.id).toBeTypeOf('string')
  })

  it('emits the message-data event', async () => {
    let promise: DeferredPromise<MessageData>, send: FCMAPIDefinitions.SendResponseData | FetchError, data: MessageData

    promise = new DeferredPromise()

    client.on('message-data', (data: MessageData) => promise.resolve(data))

    await client.connect()

    send = await postFCMSend(import.meta.env.VITE_FCM_SERVER_KEY, import.meta.env.VITE_FCM_TOKEN, {})
    if (send instanceof Error) throw send

    data = await promise.instance

    expect(data.from).toBe(import.meta.env.VITE_FCM_SENDER_ID)
  })
})
