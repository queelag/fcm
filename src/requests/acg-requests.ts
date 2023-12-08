import { FetchError, encodeBase64URL, serializeURLSearchParams } from '@aracna/core'
import { ACGAPI } from '../apis/acg-api.js'
import { ACGAPIDefinitions } from '../definitions/acg-api-definitions.js'
import { ACG_REGISTER_CHROME_VERSION, ACG_REGISTER_SENDER } from '../definitions/constants.js'
import { ACGLogger } from '../loggers/acg-logger.js'
import { ChromeBuildProto_Channel, ChromeBuildProto_Platform, DeviceType } from '../protos/android_checkin.js'
import { AndroidCheckinRequest, AndroidCheckinResponse } from '../protos/checkin.js'

export async function ACGCheckinRequest(id: bigint = 0n, securityToken: bigint = 0n): Promise<AndroidCheckinResponse | FetchError> {
  let body: Uint8Array, headers: HeadersInit, response: ACGAPIDefinitions.CheckinResponse | FetchError, data: AndroidCheckinResponse

  body = AndroidCheckinRequest.encode({
    accountCookie: [],
    checkin: {
      cellOperator: '',
      chromeBuild: {
        channel: ChromeBuildProto_Channel.CHANNEL_STABLE,
        chromeVersion: ACG_REGISTER_CHROME_VERSION,
        platform: ChromeBuildProto_Platform.PLATFORM_MAC
      },
      lastCheckinMsec: 0n,
      roaming: '',
      simOperator: '',
      type: DeviceType.DEVICE_CHROME_BROWSER,
      userNumber: 0
    },
    desiredBuild: '',
    digest: '',
    esn: '',
    fragment: 0,
    id,
    imei: '',
    locale: '',
    loggingId: 0n,
    macAddr: [],
    macAddrType: [],
    marketCheckin: '',
    meid: '',
    otaCert: [],
    securityToken,
    serialNumber: '',
    timeZone: '',
    userName: '',
    userSerialNumber: 0,
    version: 3
  }).finish()

  headers = {
    'content-type': 'application/x-protobuf'
  }

  response = await ACGAPI.post('checkin', body, { headers })
  if (response instanceof Error) return response

  data = AndroidCheckinResponse.decode(new Uint8Array(response.data))
  ACGLogger.debug('ACGCheckinRequest', `The response data has been decoded.`, data)

  return data
}

export async function ACGRegisterRequest(appID: string, androidID: bigint, securityToken: bigint): Promise<string | FetchError> {
  let body: URLSearchParams, headers: HeadersInit, response: ACGAPIDefinitions.RegisterResponse | FetchError

  body = serializeURLSearchParams<ACGAPIDefinitions.RegisterRequestBody>({
    app: 'org.chromium.linux',
    device: androidID,
    sender: encodeBase64URL(ACG_REGISTER_SENDER, { pad: false }),
    'X-subtype': appID
  })

  headers = {
    authorization: `AidLogin ${androidID}:${securityToken}`
  }

  response = await ACGAPI.post('c2dm/register3', body, { headers })
  if (response instanceof Error) return response

  if (!response.data.startsWith('token=')) {
    return FetchError.from(response)
  }

  return response.data.replace('token=', '').trim()
}
