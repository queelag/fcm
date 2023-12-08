import { FetchError, FetchResponse, encodeBase64URL, serializeFormData } from '@aracna/core'
import { ACGAPI } from '../apis/acg-api.js'
import { ACG_REGISTER_SENDER } from '../definitions/constants.js'
import { AndroidCheckinResponse } from '../proto/checkin.js'

export async function ACGRegister(appID: string, androidID: bigint, securityToken: bigint): Promise<string | FetchError> {
  let body: FormData, headers: HeadersInit, response: FetchResponse<string> | FetchError, data: AndroidCheckinResponse

  body = serializeFormData({
    app: 'org.chromium.linux',
    device: androidID.toString(),
    sender: encodeBase64URL(ACG_REGISTER_SENDER, { pad: false }),
    'X-subtype': appID
  })

  headers = {
    authorization: `AidLogin ${androidID}:${securityToken}`
  }

  response = await ACGAPI.post('c2dm/register3', body, { headers })
  if (response instanceof Error) return response

  return response.data.replace('token=', '')
}
