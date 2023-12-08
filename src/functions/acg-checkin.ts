import { FetchError, FetchResponse } from '@aracna/core'
import { ACGAPI } from '../apis/acg-api.js'
import { ChromeBuildProto_Channel, ChromeBuildProto_Platform, DeviceType } from '../proto/android_checkin.js'
import { AndroidCheckinRequest, AndroidCheckinResponse } from '../proto/checkin.js'

export async function ACGCheckin(): Promise<AndroidCheckinResponse | FetchError> {
  let body: Uint8Array, headers: HeadersInit, response: FetchResponse<ArrayBuffer> | FetchError, data: AndroidCheckinResponse

  body = AndroidCheckinRequest.encode({
    accountCookie: [],
    checkin: {
      cellOperator: '',
      chromeBuild: {
        channel: ChromeBuildProto_Channel.CHANNEL_STABLE,
        chromeVersion: '87.0.4280.66',
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
    id: 0n,
    imei: '',
    locale: '',
    loggingId: 0n,
    macAddr: [],
    macAddrType: [],
    marketCheckin: '',
    meid: '',
    otaCert: [],
    securityToken: 0n,
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
  // console.log(data)

  return data
}
