import { FetchError, encodeBase64URL, serializeURLSearchParams } from '@aracna/core'
import { AcgAPI } from '../apis/acg-api.js'
import { AcgApiDefinitions } from '../definitions/apis/acg-api-definitions.js'
import { ACG_REGISTER_CHROME_VERSION, ACG_REGISTER_SENDER } from '../definitions/constants.js'
import { AcgCheckinResponse } from '../definitions/interfaces.js'
import { AndroidCheckinDefinitions } from '../definitions/proto/android-checkin-definitions.js'
import { CheckinDefinitions } from '../definitions/proto/checkin-definitions.js'
import { RequestLogger } from '../loggers/request-logger.js'
import { CheckinProto } from '../proto/checkin-proto.js'
import { parseLong } from '../utils/long-utils.js'
import { decodeProtoType } from '../utils/proto-utils.js'

export async function postAcgCheckin(id: bigint = 0n, securityToken: bigint = 0n): Promise<AcgCheckinResponse | FetchError> {
  let request: Partial<CheckinDefinitions.AndroidCheckinRequest>,
    body: Uint8Array,
    headers: HeadersInit,
    response: AcgApiDefinitions.CheckinResponse | FetchError,
    data: CheckinDefinitions.AndroidCheckinResponse,
    result: AcgCheckinResponse

  request = {
    account_cookie: [],
    checkin: {
      cell_operator: '',
      chrome_build: {
        channel: AndroidCheckinDefinitions.ChromeBuildProtoChannel.CHANNEL_STABLE,
        chrome_version: ACG_REGISTER_CHROME_VERSION,
        platform: AndroidCheckinDefinitions.ChromeBuildProtoPlatform.PLATFORM_MAC
      },
      last_checkin_msec: parseLong(0n),
      roaming: '',
      sim_operator: '',
      type: AndroidCheckinDefinitions.DeviceType.DEVICE_CHROME_BROWSER,
      user_number: 0
    },
    desired_build: '',
    digest: '',
    fragment: 0,
    id: parseLong(id, true),
    locale: '',
    logging_id: parseLong(0n),
    mac_addr: [],
    mac_addr_type: [],
    market_checkin: '',
    ota_cert: [],
    security_token: parseLong(securityToken, true),
    time_zone: '',
    user_name: '',
    user_serial_number: 0,
    version: 3
  }
  RequestLogger.verbose('postAcgCheckin', `The request has been created.`, request)

  body = CheckinProto.Request.encode(request).finish()

  headers = {
    'content-type': 'application/x-protobuf'
  }

  response = await AcgAPI.post('checkin', body, { headers })
  if (response instanceof Error) return response

  data = decodeProtoType(CheckinProto.Response, new Uint8Array(response.data))
  RequestLogger.info('postAcgCheckin', `The response data has been decoded.`, data)

  result = {
    ...data,
    android_id: BigInt(data.android_id.toString()),
    security_token: BigInt(data.security_token.toString())
  }
  RequestLogger.info('postAcgCheckin', `The checkin response has been defined.`, result)

  return result
}

export async function postAcgRegister(device: bigint, securityToken: bigint, subtype: string): Promise<string | FetchError> {
  let body: URLSearchParams, headers: HeadersInit, response: AcgApiDefinitions.RegisterResponse | FetchError, token: string

  body = serializeURLSearchParams<AcgApiDefinitions.RegisterRequestBody>({
    app: 'org.chromium.linux',
    device,
    sender: encodeBase64URL(ACG_REGISTER_SENDER, { pad: false }),
    'X-subtype': subtype
  })

  headers = {
    authorization: `AidLogin ${device}:${securityToken}`
  }

  response = await AcgAPI.post('c2dm/register3', body, { headers })
  if (response instanceof Error) return response

  if (!response.data.startsWith('token=')) {
    RequestLogger.error('postAcgRegister', `The response data does not contain the token.`, [response.data])
    return FetchError.from(response)
  }

  token = response.data.slice(6).trim()
  RequestLogger.info('postAcgRegister', `The token has been defined.`, [token])

  return token
}
