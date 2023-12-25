import type { INamespace } from 'protobufjs'

export const CHECKIN_PROTO_JSON: INamespace = {
  options: {
    optimize_for: 'LITE_RUNTIME'
  },
  nested: {
    checkin_proto: {
      nested: {
        GservicesSetting: {
          fields: {
            name: {
              rule: 'required',
              type: 'bytes',
              id: 1
            },
            value: {
              rule: 'required',
              type: 'bytes',
              id: 2
            }
          }
        },
        AndroidCheckinRequest: {
          fields: {
            imei: {
              type: 'string',
              id: 1
            },
            meid: {
              type: 'string',
              id: 10
            },
            mac_addr: {
              rule: 'repeated',
              type: 'string',
              id: 9
            },
            mac_addr_type: {
              rule: 'repeated',
              type: 'string',
              id: 19
            },
            serial_number: {
              type: 'string',
              id: 16
            },
            esn: {
              type: 'string',
              id: 17
            },
            id: {
              type: 'int64',
              id: 2
            },
            logging_id: {
              type: 'int64',
              id: 7
            },
            digest: {
              type: 'string',
              id: 3
            },
            locale: {
              type: 'string',
              id: 6
            },
            checkin: {
              rule: 'required',
              type: 'AndroidCheckinProto',
              id: 4
            },
            desired_build: {
              type: 'string',
              id: 5
            },
            market_checkin: {
              type: 'string',
              id: 8
            },
            account_cookie: {
              rule: 'repeated',
              type: 'string',
              id: 11
            },
            time_zone: {
              type: 'string',
              id: 12
            },
            security_token: {
              type: 'fixed64',
              id: 13
            },
            version: {
              type: 'int32',
              id: 14
            },
            ota_cert: {
              rule: 'repeated',
              type: 'string',
              id: 15
            },
            fragment: {
              type: 'int32',
              id: 20
            },
            user_name: {
              type: 'string',
              id: 21
            },
            user_serial_number: {
              type: 'int32',
              id: 22
            }
          }
        },
        AndroidCheckinResponse: {
          fields: {
            stats_ok: {
              rule: 'required',
              type: 'bool',
              id: 1
            },
            time_msec: {
              type: 'int64',
              id: 3
            },
            digest: {
              type: 'string',
              id: 4
            },
            settings_diff: {
              type: 'bool',
              id: 9
            },
            delete_setting: {
              rule: 'repeated',
              type: 'string',
              id: 10
            },
            setting: {
              rule: 'repeated',
              type: 'GservicesSetting',
              id: 5
            },
            market_ok: {
              type: 'bool',
              id: 6
            },
            android_id: {
              type: 'fixed64',
              id: 7
            },
            security_token: {
              type: 'fixed64',
              id: 8
            },
            version_info: {
              type: 'string',
              id: 11
            }
          }
        },
        ChromeBuildProto: {
          fields: {
            platform: {
              type: 'Platform',
              id: 1
            },
            chrome_version: {
              type: 'string',
              id: 2
            },
            channel: {
              type: 'Channel',
              id: 3
            }
          },
          nested: {
            Platform: {
              values: {
                PLATFORM_WIN: 1,
                PLATFORM_MAC: 2,
                PLATFORM_LINUX: 3,
                PLATFORM_CROS: 4,
                PLATFORM_IOS: 5,
                PLATFORM_ANDROID: 6
              }
            },
            Channel: {
              values: {
                CHANNEL_STABLE: 1,
                CHANNEL_BETA: 2,
                CHANNEL_DEV: 3,
                CHANNEL_CANARY: 4,
                CHANNEL_UNKNOWN: 5
              }
            }
          }
        },
        AndroidCheckinProto: {
          fields: {
            last_checkin_msec: {
              type: 'int64',
              id: 2
            },
            cell_operator: {
              type: 'string',
              id: 6
            },
            sim_operator: {
              type: 'string',
              id: 7
            },
            roaming: {
              type: 'string',
              id: 8
            },
            user_number: {
              type: 'int32',
              id: 9
            },
            type: {
              type: 'DeviceType',
              id: 12,
              options: {
                default: 'DEVICE_ANDROID_OS'
              }
            },
            chrome_build: {
              type: 'checkin_proto.ChromeBuildProto',
              id: 13
            }
          }
        },
        DeviceType: {
          values: {
            DEVICE_ANDROID_OS: 1,
            DEVICE_IOS_OS: 2,
            DEVICE_CHROME_BROWSER: 3,
            DEVICE_CHROME_OS: 4
          }
        }
      }
    }
  }
}
