import { FetchError } from '@aracna/core'
import { Socket } from 'net'
import { TLSSocket } from 'tls'
import { ACG_REGISTER_CHROME_VERSION, MTALK_GOOGLE_HOST, MTALK_GOOGLE_PORT } from '../definitions/constants.js'
import { FCMClientACG } from '../definitions/interfaces.js'
import { ACGCheckinRequest, AndroidCheckinResponse } from '../index.js'
import { LoginRequest, LoginRequest_AuthService } from '../protos/mcs.js'

export class FCMClient {
  acg: FCMClientACG
  socket: TLSSocket

  constructor(acg: FCMClientACG) {
    this.acg = acg
    this.socket = new TLSSocket(new Socket())

    this.socket.enableTrace()
    this.socket.setKeepAlive(true)

    this.socket.on('close', this.onSocketClose)
    this.socket.on('connect', this.onSocketConnect)
    this.socket.on('data', this.onSocketData)
    this.socket.on('drain', this.onSocketDrain)
    this.socket.on('end', this.onSocketEnd)
    this.socket.on('error', this.onSocketError)
    this.socket.on('lookup', this.onSocketLookup)
    this.socket.on('ready', this.onSocketReady)
    this.socket.on('timeout', this.onSocketTimeout)

    this.socket.on('keylog', this.onSocketKeylog)
    this.socket.on('OCSPResponse', this.onSocketOCSPResponse)
    this.socket.on('secureConnect', this.onSocketSecureConnect)
    this.socket.on('session', this.onSocketSession)
  }

  async connect() {
    let checkin: AndroidCheckinResponse | FetchError

    checkin = await ACGCheckinRequest(this.acg.id, this.acg.securityToken)
    if (checkin instanceof Error) return

    this.socket.connect({ host: MTALK_GOOGLE_HOST, port: MTALK_GOOGLE_PORT })
    this.socket.write(
      Buffer.concat([
        Buffer.from([41, 2]),
        LoginRequest.encode({
          accountId: 0n,
          adaptiveHeartbeat: false,
          authService: LoginRequest_AuthService.ANDROID_ID,
          authToken: this.acg.securityToken.toString(),
          clientEvent: [],
          deviceId: `android-${this.acg.id}`,
          domain: 'mcs.android.com',
          id: `chrome-${ACG_REGISTER_CHROME_VERSION}`,
          lastRmqId: 0n,
          networkType: 1,
          receivedPersistentId: [],
          resource: this.acg.id.toString(),
          setting: [{ name: 'new_vc', value: '1' }],
          status: 0n,
          user: this.acg.id.toString(),
          useRmq2: true
        }).finish()
      ])
    )
  }

  onSocketClose(error: boolean) {
    console.log('close', error)
  }

  onSocketConnect() {
    console.log('connect')
  }

  onSocketData(data: Buffer) {
    console.log('data', data)
  }

  onSocketDrain() {
    console.log('drain')
  }

  onSocketEnd() {
    console.log('end')
  }

  onSocketError(error: Error) {
    console.log('error', error)
  }

  onSocketKeylog(line: Buffer) {
    console.log('keylog', line)
  }

  onSocketLookup(error: Error, address: string, family: string, host: string) {
    console.log('lookup', error, address, family, host)
  }

  onSocketOCSPResponse(response: Buffer) {
    console.log('OCSPResponse', response)
  }

  onSocketReady() {
    console.log('ready')
  }

  onSocketSecureConnect() {
    console.log('secureConnect')
  }

  onSocketSession(session: Buffer) {
    console.log('session', session)
  }

  onSocketTimeout() {
    console.log('timeout')
  }
}
