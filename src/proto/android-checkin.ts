import protobuf from 'protobufjs'
import JSON from '../assets/android-checkin.json'
import { PROTOBUF_ROOT } from '../definitions/constants.js'

protobuf.Root.fromJSON(JSON, PROTOBUF_ROOT)

export const AndroidCheckinProto = {
  AndroidCheckin: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinProto'),
  ChromeBuild: PROTOBUF_ROOT.lookupType('checkin_proto.ChromeBuildProto')
}
