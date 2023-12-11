import protobuf from 'protobufjs'
import JSON from '../assets/checkin.json'
import { PROTOBUF_ROOT } from '../definitions/constants.js'

protobuf.Root.fromJSON(JSON, PROTOBUF_ROOT)

export const CheckinProto = {
  GservicesSetting: PROTOBUF_ROOT.lookupType('checkin_proto.GservicesSetting'),
  Request: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinRequest'),
  Response: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinResponse')
}
