import { FetchResponse } from '@aracna/core'

export namespace FirebaseInstallationsAPIDefinitions {
  export interface Heartbeat {
    heartbeats: void[]
    version: number
  }

  export interface InstallationsRequestBody {
    appId: string
    authVersion: string
    fid: string
    sdkVersion: string
  }

  export interface InstallationsResponseData {
    authToken: {
      expiresIn: string
      token: string
    }
    fid: string
    name: string
    refreshToken: string
  }

  export interface InstallationsResponse extends FetchResponse<InstallationsResponseData> {}
}
