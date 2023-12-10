/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal.js'

export namespace AndroidCheckin {
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

  /** Build characteristics unique to the Chrome browser, and Chrome OS */
  export interface ChromeBuildProto {
    /** The platform of the device. */
    platform: ChromeBuildProtoPlatform
    /** The Chrome instance's version. */
    chrome_version: string
    /** The Channel (build type) of Chrome. */
    channel: ChromeBuildProtoChannel
  }

  export enum ChromeBuildProtoPlatform {
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

  export enum ChromeBuildProtoChannel {
    CHANNEL_STABLE = 1,
    CHANNEL_BETA = 2,
    CHANNEL_DEV = 3,
    CHANNEL_CANARY = 4,
    /** CHANNEL_UNKNOWN - for tip of tree or custom builds */
    CHANNEL_UNKNOWN = 5,
    UNRECOGNIZED = -1
  }

  /** Information sent by the device in a "checkin" request. */
  export interface AndroidCheckinProto {
    /** Miliseconds since the Unix epoch of the device's last successful checkin. */
    last_checkin_msec: Long
    /** The current MCC+MNC of the mobile device's current cell. */
    cell_operator: string
    /**
     * The MCC+MNC of the SIM card (different from operator if the
     * device is roaming, for instance).
     */
    sim_operator: string
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
    user_number: number
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
    chrome_build: ChromeBuildProto | undefined
  }
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
