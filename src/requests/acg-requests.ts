import { FetchError, FetchResponse, encodeBase64URL, parseBigInt, serializeURLSearchParams, sleep } from '@aracna/core'
import { AcgAPI } from '../apis/acg-api.js'
import { AcgApiDefinitions } from '../definitions/apis/acg-api-definitions.js'
import {
  ACG_REGISTER_CHROME_VERSION,
  ACG_REGISTER_SENDER,
  DEFAULT_ACG_REGISTER_MAX_RETRIES,
  DEFAULT_ACG_REGISTER_RETRY_DELAY
} from '../definitions/constants.js'
import { AcgCheckinResponse, PostAcgRegisterOptions } from '../definitions/interfaces.js'
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
    android_id: parseBigInt(data.android_id?.toString()),
    security_token: parseBigInt(data.security_token?.toString())
  }
  RequestLogger.info('postAcgCheckin', `The checkin response has been defined.`, result)

  return result
}

export async function postAcgRegister(
  device: bigint,
  securityToken: bigint,
  subtype: string,
  options?: PostAcgRegisterOptions,
  retries: number = 0
): Promise<string | FetchError> {
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

  if (response instanceof Error || !response.data.startsWith('token=')) {
    let delay: number, max: number

    delay = options?.retry?.delay ?? DEFAULT_ACG_REGISTER_RETRY_DELAY
    max = options?.retry?.max ?? DEFAULT_ACG_REGISTER_MAX_RETRIES

    if (response instanceof Error) {
      RequestLogger.error('postAcgRegister', `The request failed.`, [response])
    }

    if (response instanceof FetchResponse) {
      RequestLogger.error('postAcgRegister', `The response data does not contain the token.`, [response.data])
    }

    if (retries < max) {
      RequestLogger.verbose('postAcgRegister', `Waiting ${delay}ms before trying again...`)
      await sleep(delay)

      RequestLogger.verbose('postAcgRegister', `Trying again...`, [retries + 1, max])
      return postAcgRegister(device, securityToken, subtype, options, retries + 1)
    }

    return response instanceof Error ? response : FetchError.from(response)
  }

  token = response.data.slice(6).trim()
  RequestLogger.info('postAcgRegister', `The token has been defined.`, [token])

  return token
}
