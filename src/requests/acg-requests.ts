import { FetchError, encodeBase64URL, serializeURLSearchParams } from '@aracna/core'
import { ACGAPI } from '../apis/acg-api.js'
import { ACGAPIDefinitions } from '../definitions/apis/acg-api-definitions.js'
import { ACG_REGISTER_CHROME_VERSION, ACG_REGISTER_SENDER } from '../definitions/constants.js'
import { ACGCheckinResponse } from '../definitions/interfaces.js'
import { AndroidCheckin } from '../definitions/proto/android-checkin.js'
import { Checkin } from '../definitions/proto/checkin.js'
import { ACGLogger } from '../loggers/acg-logger.js'
import { CheckinProto } from '../proto/checkin.js'
import { parseLong } from '../utils/long-utils.js'
import { decodeProtoType } from '../utils/proto-utils.js'

export async function postACGCheckin(id: bigint = 0n, securityToken: bigint = 0n): Promise<ACGCheckinResponse | FetchError> {
  let request: Partial<Checkin.AndroidCheckinRequest>,
    body: Uint8Array,
    headers: HeadersInit,
    response: ACGAPIDefinitions.CheckinResponse | FetchError,
    data: Checkin.AndroidCheckinResponse

  request = {
    account_cookie: [],
    checkin: {
      cell_operator: '',
      chrome_build: {
        channel: AndroidCheckin.ChromeBuildProtoChannel.CHANNEL_STABLE,
        chrome_version: ACG_REGISTER_CHROME_VERSION,
        platform: AndroidCheckin.ChromeBuildProtoPlatform.PLATFORM_MAC
      },
      last_checkin_msec: parseLong(0n),
      roaming: '',
      sim_operator: '',
      type: AndroidCheckin.DeviceType.DEVICE_CHROME_BROWSER,
      user_number: 0
    },
    desired_build: '',
    digest: '',
    // esn: '',
    fragment: 0,
    id: parseLong(id, true),
    // imei: '',
    locale: '',
    logging_id: parseLong(0n),
    mac_addr: [],
    mac_addr_type: [],
    market_checkin: '',
    // meid: '',
    ota_cert: [],
    security_token: parseLong(securityToken, true),
    // serial_number: '',
    time_zone: '',
    user_name: '',
    user_serial_number: 0,
    version: 3
  }
  ACGLogger.verbose('ACGCheckinRequest', `The request has been created.`, request)

  body = CheckinProto.Request.encode(request).finish()
  ACGLogger.debug('ACGCheckinRequest', `The request data has been encoded.`, body)

  headers = {
    'content-type': 'application/x-protobuf'
  }

  response = await ACGAPI.post('checkin', body, { headers })
  if (response instanceof Error) return response

  data = decodeProtoType(CheckinProto.Response, new Uint8Array(response.data))
  ACGLogger.debug('ACGCheckinRequest', `The response data has been decoded.`, data)

  return {
    ...data,
    android_id: BigInt(data.android_id.toString()),
    security_token: BigInt(data.security_token.toString())
  }
}

export async function postACGRegister(device: bigint, securityToken: bigint, subtype: string): Promise<string | FetchError> {
  let body: URLSearchParams, headers: HeadersInit, response: ACGAPIDefinitions.RegisterResponse | FetchError

  body = serializeURLSearchParams<ACGAPIDefinitions.RegisterRequestBody>({
    app: 'org.chromium.linux',
    device,
    sender: encodeBase64URL(ACG_REGISTER_SENDER, { pad: false }),
    'X-subtype': subtype
  })

  headers = {
    authorization: `AidLogin ${device}:${securityToken}`
  }

  response = await ACGAPI.post('c2dm/register3', body, { headers })
  if (response instanceof Error) return response

  if (!response.data.startsWith('token=')) {
    return FetchError.from(response)
  }

  return response.data.replace('token=', '').trim()
}
