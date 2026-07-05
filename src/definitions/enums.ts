import { FcmApiDefinitions } from './apis/fcm-api-definitions.js'

export const FcmApiAndroidErrorCode: typeof FcmApiDefinitions.V1.ErrorCode = FcmApiDefinitions.V1.ErrorCode
export const FcmApiAndroidMessagePriority: typeof FcmApiDefinitions.V1.AndroidMessagePriority = FcmApiDefinitions.V1.AndroidMessagePriority
export const FcmApiAndroidNotificationPriority: typeof FcmApiDefinitions.V1.NotificationPriority = FcmApiDefinitions.V1.NotificationPriority
export const FcmApiAndroidVisibility: typeof FcmApiDefinitions.V1.Visibility = FcmApiDefinitions.V1.Visibility

export enum LoggerName {
  Class = 'FCM_CLASS',
  Function = 'FCM_FUNCTION',
  Request = 'FCM_REQUEST'
}

export enum McsState {
  VersionTagAndSize = 0,
  TagAndSize = 1,
  Size = 2,
  Bytes = 3
}

export enum McsTag {
  HeartbeatPing = 0,
  HeartbeatAck = 1,
  LoginRequest = 2,
  LoginResponse = 3,
  Close = 4,
  //   MessageStanza,
  //   PresenceStanza,
  IqStanza = 7,
  DataMessageStanza = 8
  //   BatchPresenceStanza,
  //   StreamErrorStanza,
  //   HttpRequest,
  //   HttpResponse,
  //   BindAccountRequest,
  //   BindAccountResponse,
  //   TalkMetadata,
  //   NumProtoTypes
}
