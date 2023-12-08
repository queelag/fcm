/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal.js'

export const protobufPackage = 'checkin_proto'

/**
 * enum values correspond to the type of device.
 * Used in the AndroidCheckinProto and Device proto.
 */
export enum DeviceType {
  /** DEVICE_ANDROID_OS - Android Device */
  DEVICE_ANDROID_OS = 1,
  /** DEVICE_IOS_OS - Apple IOS device */
  DEVICE_IOS_OS = 2,
  /** DEVICE_CHROME_BROWSER - Chrome browser - Not Chrome OS.  No hardware records. */
  DEVICE_CHROME_BROWSER = 3,
  /** DEVICE_CHROME_OS - Chrome OS */
  DEVICE_CHROME_OS = 4,
  UNRECOGNIZED = -1
}

export function deviceTypeFromJSON(object: any): DeviceType {
  switch (object) {
    case 1:
    case 'DEVICE_ANDROID_OS':
      return DeviceType.DEVICE_ANDROID_OS
    case 2:
    case 'DEVICE_IOS_OS':
      return DeviceType.DEVICE_IOS_OS
    case 3:
    case 'DEVICE_CHROME_BROWSER':
      return DeviceType.DEVICE_CHROME_BROWSER
    case 4:
    case 'DEVICE_CHROME_OS':
      return DeviceType.DEVICE_CHROME_OS
    case -1:
    case 'UNRECOGNIZED':
    default:
      return DeviceType.UNRECOGNIZED
  }
}

export function deviceTypeToJSON(object: DeviceType): string {
  switch (object) {
    case DeviceType.DEVICE_ANDROID_OS:
      return 'DEVICE_ANDROID_OS'
    case DeviceType.DEVICE_IOS_OS:
      return 'DEVICE_IOS_OS'
    case DeviceType.DEVICE_CHROME_BROWSER:
      return 'DEVICE_CHROME_BROWSER'
    case DeviceType.DEVICE_CHROME_OS:
      return 'DEVICE_CHROME_OS'
    case DeviceType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

/** Build characteristics unique to the Chrome browser, and Chrome OS */
export interface ChromeBuildProto {
  /** The platform of the device. */
  platform: ChromeBuildProto_Platform
  /** The Chrome instance's version. */
  chromeVersion: string
  /** The Channel (build type) of Chrome. */
  channel: ChromeBuildProto_Channel
}

export enum ChromeBuildProto_Platform {
  PLATFORM_WIN = 1,
  PLATFORM_MAC = 2,
  PLATFORM_LINUX = 3,
  PLATFORM_CROS = 4,
  PLATFORM_IOS = 5,
  /**
   * PLATFORM_ANDROID - Just a placeholder. Likely don't need it due to the presence of the
   * Android GCM on phone/tablet devices.
   */
  PLATFORM_ANDROID = 6,
  UNRECOGNIZED = -1
}

export function chromeBuildProto_PlatformFromJSON(object: any): ChromeBuildProto_Platform {
  switch (object) {
    case 1:
    case 'PLATFORM_WIN':
      return ChromeBuildProto_Platform.PLATFORM_WIN
    case 2:
    case 'PLATFORM_MAC':
      return ChromeBuildProto_Platform.PLATFORM_MAC
    case 3:
    case 'PLATFORM_LINUX':
      return ChromeBuildProto_Platform.PLATFORM_LINUX
    case 4:
    case 'PLATFORM_CROS':
      return ChromeBuildProto_Platform.PLATFORM_CROS
    case 5:
    case 'PLATFORM_IOS':
      return ChromeBuildProto_Platform.PLATFORM_IOS
    case 6:
    case 'PLATFORM_ANDROID':
      return ChromeBuildProto_Platform.PLATFORM_ANDROID
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ChromeBuildProto_Platform.UNRECOGNIZED
  }
}

export function chromeBuildProto_PlatformToJSON(object: ChromeBuildProto_Platform): string {
  switch (object) {
    case ChromeBuildProto_Platform.PLATFORM_WIN:
      return 'PLATFORM_WIN'
    case ChromeBuildProto_Platform.PLATFORM_MAC:
      return 'PLATFORM_MAC'
    case ChromeBuildProto_Platform.PLATFORM_LINUX:
      return 'PLATFORM_LINUX'
    case ChromeBuildProto_Platform.PLATFORM_CROS:
      return 'PLATFORM_CROS'
    case ChromeBuildProto_Platform.PLATFORM_IOS:
      return 'PLATFORM_IOS'
    case ChromeBuildProto_Platform.PLATFORM_ANDROID:
      return 'PLATFORM_ANDROID'
    case ChromeBuildProto_Platform.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum ChromeBuildProto_Channel {
  CHANNEL_STABLE = 1,
  CHANNEL_BETA = 2,
  CHANNEL_DEV = 3,
  CHANNEL_CANARY = 4,
  /** CHANNEL_UNKNOWN - for tip of tree or custom builds */
  CHANNEL_UNKNOWN = 5,
  UNRECOGNIZED = -1
}

export function chromeBuildProto_ChannelFromJSON(object: any): ChromeBuildProto_Channel {
  switch (object) {
    case 1:
    case 'CHANNEL_STABLE':
      return ChromeBuildProto_Channel.CHANNEL_STABLE
    case 2:
    case 'CHANNEL_BETA':
      return ChromeBuildProto_Channel.CHANNEL_BETA
    case 3:
    case 'CHANNEL_DEV':
      return ChromeBuildProto_Channel.CHANNEL_DEV
    case 4:
    case 'CHANNEL_CANARY':
      return ChromeBuildProto_Channel.CHANNEL_CANARY
    case 5:
    case 'CHANNEL_UNKNOWN':
      return ChromeBuildProto_Channel.CHANNEL_UNKNOWN
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ChromeBuildProto_Channel.UNRECOGNIZED
  }
}

export function chromeBuildProto_ChannelToJSON(object: ChromeBuildProto_Channel): string {
  switch (object) {
    case ChromeBuildProto_Channel.CHANNEL_STABLE:
      return 'CHANNEL_STABLE'
    case ChromeBuildProto_Channel.CHANNEL_BETA:
      return 'CHANNEL_BETA'
    case ChromeBuildProto_Channel.CHANNEL_DEV:
      return 'CHANNEL_DEV'
    case ChromeBuildProto_Channel.CHANNEL_CANARY:
      return 'CHANNEL_CANARY'
    case ChromeBuildProto_Channel.CHANNEL_UNKNOWN:
      return 'CHANNEL_UNKNOWN'
    case ChromeBuildProto_Channel.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

/** Information sent by the device in a "checkin" request. */
export interface AndroidCheckinProto {
  /** Miliseconds since the Unix epoch of the device's last successful checkin. */
  lastCheckinMsec: bigint
  /** The current MCC+MNC of the mobile device's current cell. */
  cellOperator: string
  /**
   * The MCC+MNC of the SIM card (different from operator if the
   * device is roaming, for instance).
   */
  simOperator: string
  /**
   * The device's current roaming state (reported starting in eclair builds).
   * Currently one of "{,not}mobile-{,not}roaming", if it is present at all.
   */
  roaming: string
  /**
   * For devices supporting multiple user profiles (which may be
   * supported starting in jellybean), the ordinal number of the
   * profile that is checking in.  This is 0 for the primary profile
   * (which can't be changed without wiping the device), and 1,2,3,...
   * for additional profiles (which can be added and deleted freely).
   */
  userNumber: number
  /**
   * Class of device.  Indicates the type of build proto
   * (IosBuildProto/ChromeBuildProto/AndroidBuildProto)
   * That is included in this proto
   */
  type: DeviceType
  /**
   * For devices running MCS on Chrome, build-specific characteristics
   * of the browser.  There are no hardware aspects (except for ChromeOS).
   * This will only be populated for Chrome builds/ChromeOS devices
   */
  chromeBuild?: ChromeBuildProto | undefined
}

function createBaseChromeBuildProto(): ChromeBuildProto {
  return { platform: 1, chromeVersion: '', channel: 1 }
}

export const ChromeBuildProto = {
  encode(message: ChromeBuildProto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platform !== 1) {
      writer.uint32(8).int32(message.platform)
    }
    if (message.chromeVersion !== '') {
      writer.uint32(18).string(message.chromeVersion)
    }
    if (message.channel !== 1) {
      writer.uint32(24).int32(message.channel)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChromeBuildProto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseChromeBuildProto()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.platform = reader.int32() as any
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.chromeVersion = reader.string()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.channel = reader.int32() as any
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): ChromeBuildProto {
    return {
      platform: isSet(object.platform) ? chromeBuildProto_PlatformFromJSON(object.platform) : 1,
      chromeVersion: isSet(object.chromeVersion) ? globalThis.String(object.chromeVersion) : '',
      channel: isSet(object.channel) ? chromeBuildProto_ChannelFromJSON(object.channel) : 1
    }
  },

  toJSON(message: ChromeBuildProto): unknown {
    const obj: any = {}
    if (message.platform !== 1) {
      obj.platform = chromeBuildProto_PlatformToJSON(message.platform)
    }
    if (message.chromeVersion !== '') {
      obj.chromeVersion = message.chromeVersion
    }
    if (message.channel !== 1) {
      obj.channel = chromeBuildProto_ChannelToJSON(message.channel)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<ChromeBuildProto>, I>>(base?: I): ChromeBuildProto {
    return ChromeBuildProto.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<ChromeBuildProto>, I>>(object: I): ChromeBuildProto {
    const message = createBaseChromeBuildProto()
    message.platform = object.platform ?? 1
    message.chromeVersion = object.chromeVersion ?? ''
    message.channel = object.channel ?? 1
    return message
  }
}

function createBaseAndroidCheckinProto(): AndroidCheckinProto {
  return {
    lastCheckinMsec: BigInt('0'),
    cellOperator: '',
    simOperator: '',
    roaming: '',
    userNumber: 0,
    type: 1,
    chromeBuild: undefined
  }
}

export const AndroidCheckinProto = {
  encode(message: AndroidCheckinProto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.lastCheckinMsec !== BigInt('0')) {
      if (BigInt.asIntN(64, message.lastCheckinMsec) !== message.lastCheckinMsec) {
        throw new Error('value provided for field message.lastCheckinMsec of type int64 too large')
      }
      writer.uint32(16).int64(message.lastCheckinMsec.toString())
    }
    if (message.cellOperator !== '') {
      writer.uint32(50).string(message.cellOperator)
    }
    if (message.simOperator !== '') {
      writer.uint32(58).string(message.simOperator)
    }
    if (message.roaming !== '') {
      writer.uint32(66).string(message.roaming)
    }
    if (message.userNumber !== 0) {
      writer.uint32(72).int32(message.userNumber)
    }
    if (message.type !== 1) {
      writer.uint32(96).int32(message.type)
    }
    if (message.chromeBuild !== undefined) {
      ChromeBuildProto.encode(message.chromeBuild, writer.uint32(106).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AndroidCheckinProto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAndroidCheckinProto()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 2:
          if (tag !== 16) {
            break
          }

          message.lastCheckinMsec = longToBigint(reader.int64() as Long)
          continue
        case 6:
          if (tag !== 50) {
            break
          }

          message.cellOperator = reader.string()
          continue
        case 7:
          if (tag !== 58) {
            break
          }

          message.simOperator = reader.string()
          continue
        case 8:
          if (tag !== 66) {
            break
          }

          message.roaming = reader.string()
          continue
        case 9:
          if (tag !== 72) {
            break
          }

          message.userNumber = reader.int32()
          continue
        case 12:
          if (tag !== 96) {
            break
          }

          message.type = reader.int32() as any
          continue
        case 13:
          if (tag !== 106) {
            break
          }

          message.chromeBuild = ChromeBuildProto.decode(reader, reader.uint32())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): AndroidCheckinProto {
    return {
      lastCheckinMsec: isSet(object.lastCheckinMsec) ? BigInt(object.lastCheckinMsec) : BigInt('0'),
      cellOperator: isSet(object.cellOperator) ? globalThis.String(object.cellOperator) : '',
      simOperator: isSet(object.simOperator) ? globalThis.String(object.simOperator) : '',
      roaming: isSet(object.roaming) ? globalThis.String(object.roaming) : '',
      userNumber: isSet(object.userNumber) ? globalThis.Number(object.userNumber) : 0,
      type: isSet(object.type) ? deviceTypeFromJSON(object.type) : 1,
      chromeBuild: isSet(object.chromeBuild) ? ChromeBuildProto.fromJSON(object.chromeBuild) : undefined
    }
  },

  toJSON(message: AndroidCheckinProto): unknown {
    const obj: any = {}
    if (message.lastCheckinMsec !== BigInt('0')) {
      obj.lastCheckinMsec = message.lastCheckinMsec.toString()
    }
    if (message.cellOperator !== '') {
      obj.cellOperator = message.cellOperator
    }
    if (message.simOperator !== '') {
      obj.simOperator = message.simOperator
    }
    if (message.roaming !== '') {
      obj.roaming = message.roaming
    }
    if (message.userNumber !== 0) {
      obj.userNumber = Math.round(message.userNumber)
    }
    if (message.type !== 1) {
      obj.type = deviceTypeToJSON(message.type)
    }
    if (message.chromeBuild !== undefined) {
      obj.chromeBuild = ChromeBuildProto.toJSON(message.chromeBuild)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<AndroidCheckinProto>, I>>(base?: I): AndroidCheckinProto {
    return AndroidCheckinProto.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<AndroidCheckinProto>, I>>(object: I): AndroidCheckinProto {
    const message = createBaseAndroidCheckinProto()
    message.lastCheckinMsec = object.lastCheckinMsec ?? BigInt('0')
    message.cellOperator = object.cellOperator ?? ''
    message.simOperator = object.simOperator ?? ''
    message.roaming = object.roaming ?? ''
    message.userNumber = object.userNumber ?? 0
    message.type = object.type ?? 1
    message.chromeBuild = object.chromeBuild !== undefined && object.chromeBuild !== null ? ChromeBuildProto.fromPartial(object.chromeBuild) : undefined
    return message
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
