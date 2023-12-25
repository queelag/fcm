import protobuf from 'protobufjs'
import { ANDROID_CHECKIN_PROTO_JSON } from '../assets/android-checkin-proto-json.js'
import { PROTOBUF_ROOT } from '../definitions/constants.js'

protobuf.Root.fromJSON(ANDROID_CHECKIN_PROTO_JSON, PROTOBUF_ROOT)

export const AndroidCheckinProto = {
  AndroidCheckin: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinProto'),
  ChromeBuild: PROTOBUF_ROOT.lookupType('checkin_proto.ChromeBuildProto')
}
