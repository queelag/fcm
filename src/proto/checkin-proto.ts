import protobuf from 'protobufjs'
import { CHECKIN_PROTO_JSON } from '../assets/checkin-proto-json.js'
import { PROTOBUF_ROOT } from '../definitions/constants.js'

protobuf.Root.fromJSON(CHECKIN_PROTO_JSON, PROTOBUF_ROOT)

export const CheckinProto = {
  GservicesSetting: PROTOBUF_ROOT.lookupType('checkin_proto.GservicesSetting'),
  Request: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinRequest'),
  Response: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinResponse')
}
