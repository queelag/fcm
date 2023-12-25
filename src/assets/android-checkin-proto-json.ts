import type { INamespace } from 'protobufjs'

export const ANDROID_CHECKIN_PROTO_JSON: INamespace = {
  options: {
    optimize_for: 'LITE_RUNTIME'
  },
  nested: {
    checkin_proto: {
      nested: {
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
