import protobuf from 'protobufjs'
import JSON from '../assets/mcs.json'
import { PROTOBUF_ROOT } from '../definitions/constants.js'

protobuf.Root.fromJSON(JSON, PROTOBUF_ROOT)

export const MCSProto = {
  HeartbeatPing: PROTOBUF_ROOT.lookupType('mcs_proto.HeartbeatPing'),
  HeartbeatAck: PROTOBUF_ROOT.lookupType('mcs_proto.HeartbeatAck'),
  LoginRequest: PROTOBUF_ROOT.lookupType('mcs_proto.LoginRequest'),
  LoginResponse: PROTOBUF_ROOT.lookupType('mcs_proto.LoginResponse'),
  Close: PROTOBUF_ROOT.lookupType('mcs_proto.Close'),
  IqStanza: PROTOBUF_ROOT.lookupType('mcs_proto.IqStanza'),
  DataMessageStanza: PROTOBUF_ROOT.lookupType('mcs_proto.DataMessageStanza')
}
