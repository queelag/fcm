import protobuf from 'protobufjs'
import { PROTOBUF_ROOT } from '../definitions/constants.js'
import JSON from './android-checkin.json'

protobuf.Root.fromJSON(JSON, PROTOBUF_ROOT)

export const AndroidCheckinProto = {
  AndroidCheckin: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinProto'),
  ChromeBuild: PROTOBUF_ROOT.lookupType('checkin_proto.ChromeBuildProto')
}
