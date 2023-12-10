import protobuf from 'protobufjs'
import { PROTOBUF_ROOT } from '../definitions/constants.js'
import JSON from './checkin.json'

protobuf.Root.fromJSON(JSON, PROTOBUF_ROOT)

export const CheckinProto = {
  GservicesSetting: PROTOBUF_ROOT.lookupType('checkin_proto.GservicesSetting'),
  Request: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinRequest'),
  Response: PROTOBUF_ROOT.lookupType('checkin_proto.AndroidCheckinResponse')
}
