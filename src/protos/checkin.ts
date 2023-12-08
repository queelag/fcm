/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal.js'
import { AndroidCheckinProto } from './android_checkin.js'

export const protobufPackage = 'checkin_proto'

/** A concrete name/value pair sent to the device's Gservices database. */
export interface GservicesSetting {
  name: Uint8Array
  value: Uint8Array
}

/** Devices send this every few hours to tell us how they're doing. */
export interface AndroidCheckinRequest {
  /**
   * IMEI (used by GSM phones) is sent and stored as 15 decimal
   * digits; the 15th is a check digit.
   */
  imei: string
  /**
   * MEID (used by CDMA phones) is sent and stored as 14 hexadecimal
   * digits (no check digit).
   */
  meid: string
  /**
   * MAC address (used by non-phone devices).  12 hexadecimal digits;
   * no separators (eg "0016E6513AC2", not "00:16:E6:51:3A:C2").
   */
  macAddr: string[]
  /**
   * An array parallel to mac_addr, describing the type of interface.
   * Currently accepted values: "wifi", "ethernet", "bluetooth".  If
   * not present, "wifi" is assumed.
   */
  macAddrType: string[]
  /**
   * Serial number (a manufacturer-defined unique hardware
   * identifier).  Alphanumeric, case-insensitive.
   */
  serialNumber: string
  /** Older CDMA networks use an ESN (8 hex digits) instead of an MEID. */
  esn: string
  /** Android device ID, not logged */
  id: bigint
  /** Pseudonymous logging ID for Sawmill */
  loggingId: bigint
  /** Digest of device provisioning, not logged. */
  digest: string
  /** Current locale in standard (xx_XX) format */
  locale: string
  checkin?: AndroidCheckinProto | undefined
  /** DEPRECATED, see AndroidCheckinProto.requested_group */
  desiredBuild: string
  /** Blob of data from the Market app to be passed to Market API server */
  marketCheckin: string
  /** SID cookies of any google accounts stored on the phone.  Not logged. */
  accountCookie: string[]
  /** Time zone.  Not currently logged. */
  timeZone: string
  /**
   * Security token used to validate the checkin request.
   * Required for android IDs issued to Froyo+ devices, not for legacy IDs.
   */
  securityToken: bigint
  /**
   * Version of checkin protocol.
   *
   * There are currently two versions:
   *
   * - version field missing: android IDs are assigned based on
   *   hardware identifiers.  unsecured in the sense that you can
   *   "unregister" someone's phone by sending a registration request
   *   with their IMEI/MEID/MAC.
   *
   * - version=2: android IDs are assigned randomly.  The device is
   *   sent a security token that must be included in all future
   *   checkins for that android id.
   *
   * - version=3: same as version 2, but the 'fragment' field is
   *   provided, and the device understands incremental updates to the
   *   gservices table (ie, only returning the keys whose values have
   *   changed.)
   *
   * (version=1 was skipped to avoid confusion with the "missing"
   * version field that is effectively version 1.)
   */
  version: number
  /**
   * OTA certs accepted by device (base-64 SHA-1 of cert files).  Not
   * logged.
   */
  otaCert: string[]
  /**
   * A single CheckinTask on the device may lead to multiple checkin
   * requests if there is too much log data to upload in a single
   * request.  For version 3 and up, this field will be filled in with
   * the number of the request, starting with 0.
   */
  fragment: number
  /**
   * For devices supporting multiple users, the name of the current
   * profile (they all check in independently, just as if they were
   * multiple physical devices).  This may not be set, even if the
   * device is using multiuser.  (checkin.user_number should be set to
   * the ordinal of the user.)
   */
  userName: string
  /**
   * For devices supporting multiple user profiles, the serial number
   * for the user checking in.  Not logged.  May not be set, even if
   * the device supportes multiuser.  checkin.user_number is the
   * ordinal of the user (0, 1, 2, ...), which may be reused if users
   * are deleted and re-created.  user_serial_number is never reused
   * (unless the device is wiped).
   */
  userSerialNumber: number
}

/** The response to the device. */
export interface AndroidCheckinResponse {
  /** Whether statistics were recorded properly. */
  statsOk: boolean
  /** Time of day from server (Java epoch). */
  timeMsec: bigint
  /**
   * Provisioning is sent if the request included an obsolete digest.
   *
   * For version <= 2, 'digest' contains the digest that should be
   * sent back to the server on the next checkin, and 'setting'
   * contains the entire gservices table (which replaces the entire
   * current table on the device).
   *
   * for version >= 3, 'digest' will be absent.  If 'settings_diff'
   * is false, then 'setting' contains the entire table, as in version
   * 2.  If 'settings_diff' is true, then 'delete_setting' contains
   * the keys to delete, and 'setting' contains only keys to be added
   * or for which the value has changed.  All other keys in the
   * current table should be left untouched.  If 'settings_diff' is
   * absent, don't touch the existing gservices table.
   */
  digest: string
  settingsDiff: boolean
  deleteSetting: string[]
  setting: GservicesSetting[]
  /** If Market got the market_checkin data OK. */
  marketOk: boolean
  /** From the request, or newly assigned */
  androidId: bigint
  /** The associated security token */
  securityToken: bigint
  /** NEXT TAG: 12 */
  versionInfo: string
}

function createBaseGservicesSetting(): GservicesSetting {
  return { name: new Uint8Array(0), value: new Uint8Array(0) }
}

export const GservicesSetting = {
  encode(message: GservicesSetting, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name.length !== 0) {
      writer.uint32(10).bytes(message.name)
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GservicesSetting {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGservicesSetting()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.name = reader.bytes()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.value = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): GservicesSetting {
    return {
      name: isSet(object.name) ? bytesFromBase64(object.name) : new Uint8Array(0),
      value: isSet(object.value) ? bytesFromBase64(object.value) : new Uint8Array(0)
    }
  },

  toJSON(message: GservicesSetting): unknown {
    const obj: any = {}
    if (message.name.length !== 0) {
      obj.name = base64FromBytes(message.name)
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<GservicesSetting>, I>>(base?: I): GservicesSetting {
    return GservicesSetting.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<GservicesSetting>, I>>(object: I): GservicesSetting {
    const message = createBaseGservicesSetting()
    message.name = object.name ?? new Uint8Array(0)
    message.value = object.value ?? new Uint8Array(0)
    return message
  }
}

function createBaseAndroidCheckinRequest(): AndroidCheckinRequest {
  return {
    imei: '',
    meid: '',
    macAddr: [],
    macAddrType: [],
    serialNumber: '',
    esn: '',
    id: BigInt('0'),
    loggingId: BigInt('0'),
    digest: '',
    locale: '',
    checkin: undefined,
    desiredBuild: '',
    marketCheckin: '',
    accountCookie: [],
    timeZone: '',
    securityToken: BigInt('0'),
    version: 0,
    otaCert: [],
    fragment: 0,
    userName: '',
    userSerialNumber: 0
  }
}

export const AndroidCheckinRequest = {
  encode(message: AndroidCheckinRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.imei !== '') {
      writer.uint32(10).string(message.imei)
    }
    if (message.meid !== '') {
      writer.uint32(82).string(message.meid)
    }
    for (const v of message.macAddr) {
      writer.uint32(74).string(v!)
    }
    for (const v of message.macAddrType) {
      writer.uint32(154).string(v!)
    }
    if (message.serialNumber !== '') {
      writer.uint32(130).string(message.serialNumber)
    }
    if (message.esn !== '') {
      writer.uint32(138).string(message.esn)
    }
    if (message.id !== BigInt('0')) {
      if (BigInt.asIntN(64, message.id) !== message.id) {
        throw new Error('value provided for field message.id of type int64 too large')
      }
      writer.uint32(16).int64(message.id.toString())
    }
    if (message.loggingId !== BigInt('0')) {
      if (BigInt.asIntN(64, message.loggingId) !== message.loggingId) {
        throw new Error('value provided for field message.loggingId of type int64 too large')
      }
      writer.uint32(56).int64(message.loggingId.toString())
    }
    if (message.digest !== '') {
      writer.uint32(26).string(message.digest)
    }
    if (message.locale !== '') {
      writer.uint32(50).string(message.locale)
    }
    if (message.checkin !== undefined) {
      AndroidCheckinProto.encode(message.checkin, writer.uint32(34).fork()).ldelim()
    }
    if (message.desiredBuild !== '') {
      writer.uint32(42).string(message.desiredBuild)
    }
    if (message.marketCheckin !== '') {
      writer.uint32(66).string(message.marketCheckin)
    }
    for (const v of message.accountCookie) {
      writer.uint32(90).string(v!)
    }
    if (message.timeZone !== '') {
      writer.uint32(98).string(message.timeZone)
    }
    if (message.securityToken !== BigInt('0')) {
      if (BigInt.asUintN(64, message.securityToken) !== message.securityToken) {
        throw new Error('value provided for field message.securityToken of type fixed64 too large')
      }
      writer.uint32(105).fixed64(message.securityToken.toString())
    }
    if (message.version !== 0) {
      writer.uint32(112).int32(message.version)
    }
    for (const v of message.otaCert) {
      writer.uint32(122).string(v!)
    }
    if (message.fragment !== 0) {
      writer.uint32(160).int32(message.fragment)
    }
    if (message.userName !== '') {
      writer.uint32(170).string(message.userName)
    }
    if (message.userSerialNumber !== 0) {
      writer.uint32(176).int32(message.userSerialNumber)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AndroidCheckinRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAndroidCheckinRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.imei = reader.string()
          continue
        case 10:
          if (tag !== 82) {
            break
          }

          message.meid = reader.string()
          continue
        case 9:
          if (tag !== 74) {
            break
          }

          message.macAddr.push(reader.string())
          continue
        case 19:
          if (tag !== 154) {
            break
          }

          message.macAddrType.push(reader.string())
          continue
        case 16:
          if (tag !== 130) {
            break
          }

          message.serialNumber = reader.string()
          continue
        case 17:
          if (tag !== 138) {
            break
          }

          message.esn = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.id = longToBigint(reader.int64() as Long)
          continue
        case 7:
          if (tag !== 56) {
            break
          }

          message.loggingId = longToBigint(reader.int64() as Long)
          continue
        case 3:
          if (tag !== 26) {
            break
          }

          message.digest = reader.string()
          continue
        case 6:
          if (tag !== 50) {
            break
          }

          message.locale = reader.string()
          continue
        case 4:
          if (tag !== 34) {
            break
          }

          message.checkin = AndroidCheckinProto.decode(reader, reader.uint32())
          continue
        case 5:
          if (tag !== 42) {
            break
          }

          message.desiredBuild = reader.string()
          continue
        case 8:
          if (tag !== 66) {
            break
          }

          message.marketCheckin = reader.string()
          continue
        case 11:
          if (tag !== 90) {
            break
          }

          message.accountCookie.push(reader.string())
          continue
        case 12:
          if (tag !== 98) {
            break
          }

          message.timeZone = reader.string()
          continue
        case 13:
          if (tag !== 105) {
            break
          }

          message.securityToken = longToBigint(reader.fixed64() as Long)
          continue
        case 14:
          if (tag !== 112) {
            break
          }

          message.version = reader.int32()
          continue
        case 15:
          if (tag !== 122) {
            break
          }

          message.otaCert.push(reader.string())
          continue
        case 20:
          if (tag !== 160) {
            break
          }

          message.fragment = reader.int32()
          continue
        case 21:
          if (tag !== 170) {
            break
          }

          message.userName = reader.string()
          continue
        case 22:
          if (tag !== 176) {
            break
          }

          message.userSerialNumber = reader.int32()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): AndroidCheckinRequest {
    return {
      imei: isSet(object.imei) ? globalThis.String(object.imei) : '',
      meid: isSet(object.meid) ? globalThis.String(object.meid) : '',
      macAddr: globalThis.Array.isArray(object?.macAddr) ? object.macAddr.map((e: any) => globalThis.String(e)) : [],
      macAddrType: globalThis.Array.isArray(object?.macAddrType) ? object.macAddrType.map((e: any) => globalThis.String(e)) : [],
      serialNumber: isSet(object.serialNumber) ? globalThis.String(object.serialNumber) : '',
      esn: isSet(object.esn) ? globalThis.String(object.esn) : '',
      id: isSet(object.id) ? BigInt(object.id) : BigInt('0'),
      loggingId: isSet(object.loggingId) ? BigInt(object.loggingId) : BigInt('0'),
      digest: isSet(object.digest) ? globalThis.String(object.digest) : '',
      locale: isSet(object.locale) ? globalThis.String(object.locale) : '',
      checkin: isSet(object.checkin) ? AndroidCheckinProto.fromJSON(object.checkin) : undefined,
      desiredBuild: isSet(object.desiredBuild) ? globalThis.String(object.desiredBuild) : '',
      marketCheckin: isSet(object.marketCheckin) ? globalThis.String(object.marketCheckin) : '',
      accountCookie: globalThis.Array.isArray(object?.accountCookie) ? object.accountCookie.map((e: any) => globalThis.String(e)) : [],
      timeZone: isSet(object.timeZone) ? globalThis.String(object.timeZone) : '',
      securityToken: isSet(object.securityToken) ? BigInt(object.securityToken) : BigInt('0'),
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      otaCert: globalThis.Array.isArray(object?.otaCert) ? object.otaCert.map((e: any) => globalThis.String(e)) : [],
      fragment: isSet(object.fragment) ? globalThis.Number(object.fragment) : 0,
      userName: isSet(object.userName) ? globalThis.String(object.userName) : '',
      userSerialNumber: isSet(object.userSerialNumber) ? globalThis.Number(object.userSerialNumber) : 0
    }
  },

  toJSON(message: AndroidCheckinRequest): unknown {
    const obj: any = {}
    if (message.imei !== '') {
      obj.imei = message.imei
    }
    if (message.meid !== '') {
      obj.meid = message.meid
    }
    if (message.macAddr?.length) {
      obj.macAddr = message.macAddr
    }
    if (message.macAddrType?.length) {
      obj.macAddrType = message.macAddrType
    }
    if (message.serialNumber !== '') {
      obj.serialNumber = message.serialNumber
    }
    if (message.esn !== '') {
      obj.esn = message.esn
    }
    if (message.id !== BigInt('0')) {
      obj.id = message.id.toString()
    }
    if (message.loggingId !== BigInt('0')) {
      obj.loggingId = message.loggingId.toString()
    }
    if (message.digest !== '') {
      obj.digest = message.digest
    }
    if (message.locale !== '') {
      obj.locale = message.locale
    }
    if (message.checkin !== undefined) {
      obj.checkin = AndroidCheckinProto.toJSON(message.checkin)
    }
    if (message.desiredBuild !== '') {
      obj.desiredBuild = message.desiredBuild
    }
    if (message.marketCheckin !== '') {
      obj.marketCheckin = message.marketCheckin
    }
    if (message.accountCookie?.length) {
      obj.accountCookie = message.accountCookie
    }
    if (message.timeZone !== '') {
      obj.timeZone = message.timeZone
    }
    if (message.securityToken !== BigInt('0')) {
      obj.securityToken = message.securityToken.toString()
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version)
    }
    if (message.otaCert?.length) {
      obj.otaCert = message.otaCert
    }
    if (message.fragment !== 0) {
      obj.fragment = Math.round(message.fragment)
    }
    if (message.userName !== '') {
      obj.userName = message.userName
    }
    if (message.userSerialNumber !== 0) {
      obj.userSerialNumber = Math.round(message.userSerialNumber)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<AndroidCheckinRequest>, I>>(base?: I): AndroidCheckinRequest {
    return AndroidCheckinRequest.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<AndroidCheckinRequest>, I>>(object: I): AndroidCheckinRequest {
    const message = createBaseAndroidCheckinRequest()
    message.imei = object.imei ?? ''
    message.meid = object.meid ?? ''
    message.macAddr = object.macAddr?.map((e) => e) || []
    message.macAddrType = object.macAddrType?.map((e) => e) || []
    message.serialNumber = object.serialNumber ?? ''
    message.esn = object.esn ?? ''
    message.id = object.id ?? BigInt('0')
    message.loggingId = object.loggingId ?? BigInt('0')
    message.digest = object.digest ?? ''
    message.locale = object.locale ?? ''
    message.checkin = object.checkin !== undefined && object.checkin !== null ? AndroidCheckinProto.fromPartial(object.checkin) : undefined
    message.desiredBuild = object.desiredBuild ?? ''
    message.marketCheckin = object.marketCheckin ?? ''
    message.accountCookie = object.accountCookie?.map((e) => e) || []
    message.timeZone = object.timeZone ?? ''
    message.securityToken = object.securityToken ?? BigInt('0')
    message.version = object.version ?? 0
    message.otaCert = object.otaCert?.map((e) => e) || []
    message.fragment = object.fragment ?? 0
    message.userName = object.userName ?? ''
    message.userSerialNumber = object.userSerialNumber ?? 0
    return message
  }
}

function createBaseAndroidCheckinResponse(): AndroidCheckinResponse {
  return {
    statsOk: false,
    timeMsec: BigInt('0'),
    digest: '',
    settingsDiff: false,
    deleteSetting: [],
    setting: [],
    marketOk: false,
    androidId: BigInt('0'),
    securityToken: BigInt('0'),
    versionInfo: ''
  }
}

export const AndroidCheckinResponse = {
  encode(message: AndroidCheckinResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statsOk === true) {
      writer.uint32(8).bool(message.statsOk)
    }
    if (message.timeMsec !== BigInt('0')) {
      if (BigInt.asIntN(64, message.timeMsec) !== message.timeMsec) {
        throw new Error('value provided for field message.timeMsec of type int64 too large')
      }
      writer.uint32(24).int64(message.timeMsec.toString())
    }
    if (message.digest !== '') {
      writer.uint32(34).string(message.digest)
    }
    if (message.settingsDiff === true) {
      writer.uint32(72).bool(message.settingsDiff)
    }
    for (const v of message.deleteSetting) {
      writer.uint32(82).string(v!)
    }
    for (const v of message.setting) {
      GservicesSetting.encode(v!, writer.uint32(42).fork()).ldelim()
    }
    if (message.marketOk === true) {
      writer.uint32(48).bool(message.marketOk)
    }
    if (message.androidId !== BigInt('0')) {
      if (BigInt.asUintN(64, message.androidId) !== message.androidId) {
        throw new Error('value provided for field message.androidId of type fixed64 too large')
      }
      writer.uint32(57).fixed64(message.androidId.toString())
    }
    if (message.securityToken !== BigInt('0')) {
      if (BigInt.asUintN(64, message.securityToken) !== message.securityToken) {
        throw new Error('value provided for field message.securityToken of type fixed64 too large')
      }
      writer.uint32(65).fixed64(message.securityToken.toString())
    }
    if (message.versionInfo !== '') {
      writer.uint32(90).string(message.versionInfo)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AndroidCheckinResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAndroidCheckinResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.statsOk = reader.bool()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.timeMsec = longToBigint(reader.int64() as Long)
          continue
        case 4:
          if (tag !== 34) {
            break
          }

          message.digest = reader.string()
          continue
        case 9:
          if (tag !== 72) {
            break
          }

          message.settingsDiff = reader.bool()
          continue
        case 10:
          if (tag !== 82) {
            break
          }

          message.deleteSetting.push(reader.string())
          continue
        case 5:
          if (tag !== 42) {
            break
          }

          message.setting.push(GservicesSetting.decode(reader, reader.uint32()))
          continue
        case 6:
          if (tag !== 48) {
            break
          }

          message.marketOk = reader.bool()
          continue
        case 7:
          if (tag !== 57) {
            break
          }

          message.androidId = longToBigint(reader.fixed64() as Long)
          continue
        case 8:
          if (tag !== 65) {
            break
          }

          message.securityToken = longToBigint(reader.fixed64() as Long)
          continue
        case 11:
          if (tag !== 90) {
            break
          }

          message.versionInfo = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): AndroidCheckinResponse {
    return {
      statsOk: isSet(object.statsOk) ? globalThis.Boolean(object.statsOk) : false,
      timeMsec: isSet(object.timeMsec) ? BigInt(object.timeMsec) : BigInt('0'),
      digest: isSet(object.digest) ? globalThis.String(object.digest) : '',
      settingsDiff: isSet(object.settingsDiff) ? globalThis.Boolean(object.settingsDiff) : false,
      deleteSetting: globalThis.Array.isArray(object?.deleteSetting) ? object.deleteSetting.map((e: any) => globalThis.String(e)) : [],
      setting: globalThis.Array.isArray(object?.setting) ? object.setting.map((e: any) => GservicesSetting.fromJSON(e)) : [],
      marketOk: isSet(object.marketOk) ? globalThis.Boolean(object.marketOk) : false,
      androidId: isSet(object.androidId) ? BigInt(object.androidId) : BigInt('0'),
      securityToken: isSet(object.securityToken) ? BigInt(object.securityToken) : BigInt('0'),
      versionInfo: isSet(object.versionInfo) ? globalThis.String(object.versionInfo) : ''
    }
  },

  toJSON(message: AndroidCheckinResponse): unknown {
    const obj: any = {}
    if (message.statsOk === true) {
      obj.statsOk = message.statsOk
    }
    if (message.timeMsec !== BigInt('0')) {
      obj.timeMsec = message.timeMsec.toString()
    }
    if (message.digest !== '') {
      obj.digest = message.digest
    }
    if (message.settingsDiff === true) {
      obj.settingsDiff = message.settingsDiff
    }
    if (message.deleteSetting?.length) {
      obj.deleteSetting = message.deleteSetting
    }
    if (message.setting?.length) {
      obj.setting = message.setting.map((e) => GservicesSetting.toJSON(e))
    }
    if (message.marketOk === true) {
      obj.marketOk = message.marketOk
    }
    if (message.androidId !== BigInt('0')) {
      obj.androidId = message.androidId.toString()
    }
    if (message.securityToken !== BigInt('0')) {
      obj.securityToken = message.securityToken.toString()
    }
    if (message.versionInfo !== '') {
      obj.versionInfo = message.versionInfo
    }
    return obj
  },

  create<I extends Exact<DeepPartial<AndroidCheckinResponse>, I>>(base?: I): AndroidCheckinResponse {
    return AndroidCheckinResponse.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<AndroidCheckinResponse>, I>>(object: I): AndroidCheckinResponse {
    const message = createBaseAndroidCheckinResponse()
    message.statsOk = object.statsOk ?? false
    message.timeMsec = object.timeMsec ?? BigInt('0')
    message.digest = object.digest ?? ''
    message.settingsDiff = object.settingsDiff ?? false
    message.deleteSetting = object.deleteSetting?.map((e) => e) || []
    message.setting = object.setting?.map((e) => GservicesSetting.fromPartial(e)) || []
    message.marketOk = object.marketOk ?? false
    message.androidId = object.androidId ?? BigInt('0')
    message.securityToken = object.securityToken ?? BigInt('0')
    message.versionInfo = object.versionInfo ?? ''
    return message
  }
}

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, 'base64'))
  } else {
    const bin = globalThis.atob(b64)
    const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i)
    }
    return arr
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString('base64')
  } else {
    const bin: string[] = []
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte))
    })
    return globalThis.btoa(bin.join(''))
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin ? P : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never }

function longToBigint(long: Long) {
  return BigInt(long.toString())
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
