/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal.js'
import type { AndroidCheckinDefinitions } from './android-checkin-definitions.js'

export namespace CheckinDefinitions {
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
    mac_addr: string[]
    /**
     * An array parallel to mac_addr, describing the type of interface.
     * Currently accepted values: "wifi", "ethernet", "bluetooth".  If
     * not present, "wifi" is assumed.
     */
    mac_addr_type: string[]
    /**
     * Serial number (a manufacturer-defined unique hardware
     * identifier).  Alphanumeric, case-insensitive.
     */
    serial_number: string
    /** Older CDMA networks use an ESN (8 hex digits) instead of an MEID. */
    esn: string
    /** Android device ID, not logged */
    id: Long
    /** Pseudonymous logging ID for Sawmill */
    logging_id: Long
    /** Digest of device provisioning, not logged. */
    digest: string
    /** Current locale in standard (xx_XX) format */
    locale: string
    checkin: AndroidCheckinDefinitions.AndroidCheckinProto | undefined
    /** DEPRECATED, see AndroidCheckinProto.requested_group */
    desired_build: string
    /** Blob of data from the Market app to be passed to Market API server */
    market_checkin: string
    /** SID cookies of any google accounts stored on the phone.  Not logged. */
    account_cookie: string[]
    /** Time zone.  Not currently logged. */
    time_zone: string
    /**
     * Security token used to validate the checkin request.
     * Required for android IDs issued to Froyo+ devices, not for legacy IDs.
     */
    security_token: Long
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
    ota_cert: string[]
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
    user_name: string
    /**
     * For devices supporting multiple user profiles, the serial number
     * for the user checking in.  Not logged.  May not be set, even if
     * the device supportes multiuser.  checkin.user_number is the
     * ordinal of the user (0, 1, 2, ...), which may be reused if users
     * are deleted and re-created.  user_serial_number is never reused
     * (unless the device is wiped).
     */
    user_serial_number: number
  }

  /** The response to the device. */
  export interface AndroidCheckinResponse {
    /** Whether statistics were recorded properly. */
    stats_ok: boolean
    /** Time of day from server (Java epoch). */
    time_msec: Long
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
    settings_diff: boolean
    delete_setting: string[]
    setting: GservicesSetting[]
    /** If Market got the market_checkin data OK. */
    market_ok: boolean
    /** From the request, or newly assigned */
    android_id: Long
    /** The associated security token */
    security_token: Long
    /** NEXT TAG: 12 */
    version_info: string
  }
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
