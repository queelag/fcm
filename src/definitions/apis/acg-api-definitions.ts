import { FetchResponse } from '@aracna/core'

export namespace AcgApiDefinitions {
  export interface CheckinResponse extends FetchResponse<ArrayBuffer> {}

  export interface RegisterRequestBody {
    app: string
    device: bigint
    sender: string
    'X-subtype': string
  }

  export interface RegisterResponse extends FetchResponse<string> {}
}
