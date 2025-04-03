import type { INamespace } from 'protobufjs'

export const MCS_PROTO_JSON: INamespace = {
  options: {
    syntax: 'proto2',
    optimize_for: 'LITE_RUNTIME'
  },
  nested: {
    mcs_proto: {
      nested: {
        HeartbeatPing: {
          fields: {
            stream_id: {
              type: 'int32',
              id: 1
            },
            last_stream_id_received: {
              type: 'int32',
              id: 2
            },
            status: {
              type: 'int64',
              id: 3
            }
          }
        },
        HeartbeatAck: {
          fields: {
            stream_id: {
              type: 'int32',
              id: 1
            },
            last_stream_id_received: {
              type: 'int32',
              id: 2
            },
            status: {
              type: 'int64',
              id: 3
            }
          }
        },
        ErrorInfo: {
          fields: {
            code: {
              rule: 'required',
              type: 'int32',
              id: 1
            },
            message: {
              type: 'string',
              id: 2
            },
            type: {
              type: 'string',
              id: 3
            },
            extension: {
              type: 'Extension',
              id: 4
            }
          }
        },
        Setting: {
          fields: {
            name: {
              rule: 'required',
              type: 'string',
              id: 1
            },
            value: {
              rule: 'required',
              type: 'string',
              id: 2
            }
          }
        },
        HeartbeatStat: {
          fields: {
            ip: {
              rule: 'required',
              type: 'string',
              id: 1
            },
            timeout: {
              rule: 'required',
              type: 'bool',
              id: 2
            },
            interval_ms: {
              rule: 'required',
              type: 'int32',
              id: 3
            }
          }
        },
        HeartbeatConfig: {
          fields: {
            upload_stat: {
              type: 'bool',
              id: 1
            },
            ip: {
              type: 'string',
              id: 2
            },
            interval_ms: {
              type: 'int32',
              id: 3
            }
          }
        },
        ClientEvent: {
          fields: {
            type: {
              type: 'Type',
              id: 1
            },
            number_discarded_events: {
              type: 'uint32',
              id: 100
            },
            network_type: {
              type: 'int32',
              id: 200
            },
            time_connection_started_ms: {
              type: 'uint64',
              id: 202
            },
            time_connection_ended_ms: {
              type: 'uint64',
              id: 203
            },
            error_code: {
              type: 'int32',
              id: 204
            },
            time_connection_established_ms: {
              type: 'uint64',
              id: 300
            }
          },
          reserved: [[201, 201]],
          nested: {
            Type: {
              values: {
                UNKNOWN: 0,
                DISCARDED_EVENTS: 1,
                FAILED_CONNECTION: 2,
                SUCCESSFUL_CONNECTION: 3
              }
            }
          }
        },
        LoginRequest: {
          fields: {
            id: {
              rule: 'required',
              type: 'string',
              id: 1
            },
            domain: {
              rule: 'required',
              type: 'string',
              id: 2
            },
            user: {
              rule: 'required',
              type: 'string',
              id: 3
            },
            resource: {
              rule: 'required',
              type: 'string',
              id: 4
            },
            auth_token: {
              rule: 'required',
              type: 'string',
              id: 5
            },
            device_id: {
              type: 'string',
              id: 6
            },
            last_rmq_id: {
              type: 'int64',
              id: 7
            },
            setting: {
              rule: 'repeated',
              type: 'Setting',
              id: 8
            },
            received_persistent_id: {
              rule: 'repeated',
              type: 'string',
              id: 10
            },
            adaptive_heartbeat: {
              type: 'bool',
              id: 12
            },
            heartbeat_stat: {
              type: 'HeartbeatStat',
              id: 13
            },
            use_rmq2: {
              type: 'bool',
              id: 14
            },
            account_id: {
              type: 'int64',
              id: 15
            },
            auth_service: {
              type: 'AuthService',
              id: 16
            },
            network_type: {
              type: 'int32',
              id: 17
            },
            status: {
              type: 'int64',
              id: 18
            },
            client_event: {
              rule: 'repeated',
              type: 'ClientEvent',
              id: 22
            }
          },
          reserved: [
            [19, 19],
            [20, 20],
            [21, 21]
          ],
          nested: {
            AuthService: {
              values: {
                ANDROID_ID: 2
              }
            }
          }
        },
        LoginResponse: {
          fields: {
            id: {
              rule: 'required',
              type: 'string',
              id: 1
            },
            jid: {
              type: 'string',
              id: 2
            },
            error: {
              type: 'ErrorInfo',
              id: 3
            },
            setting: {
              rule: 'repeated',
              type: 'Setting',
              id: 4
            },
            stream_id: {
              type: 'int32',
              id: 5
            },
            last_stream_id_received: {
              type: 'int32',
              id: 6
            },
            heartbeat_config: {
              type: 'HeartbeatConfig',
              id: 7
            },
            server_timestamp: {
              type: 'int64',
              id: 8
            }
          }
        },
        StreamErrorStanza: {
          fields: {
            type: {
              rule: 'required',
              type: 'string',
              id: 1
            },
            text: {
              type: 'string',
              id: 2
            }
          }
        },
        Close: {
          fields: {}
        },
        Extension: {
          fields: {
            id: {
              rule: 'required',
              type: 'int32',
              id: 1
            },
            data: {
              rule: 'required',
              type: 'bytes',
              id: 2
            }
          }
        },
        IqStanza: {
          fields: {
            rmq_id: {
              type: 'int64',
              id: 1
            },
            type: {
              rule: 'required',
              type: 'IqType',
              id: 2
            },
            id: {
              rule: 'required',
              type: 'string',
              id: 3
            },
            from: {
              type: 'string',
              id: 4
            },
            to: {
              type: 'string',
              id: 5
            },
            error: {
              type: 'ErrorInfo',
              id: 6
            },
            extension: {
              type: 'Extension',
              id: 7
            },
            persistent_id: {
              type: 'string',
              id: 8
            },
            stream_id: {
              type: 'int32',
              id: 9
            },
            last_stream_id_received: {
              type: 'int32',
              id: 10
            },
            account_id: {
              type: 'int64',
              id: 11
            },
            status: {
              type: 'int64',
              id: 12
            }
          },
          nested: {
            IqType: {
              values: {
                GET: 0,
                SET: 1,
                RESULT: 2,
                IQ_ERROR: 3
              }
            }
          }
        },
        AppData: {
          fields: {
            key: {
              rule: 'required',
              type: 'string',
              id: 1
            },
            value: {
              rule: 'required',
              type: 'string',
              id: 2
            }
          }
        },
        DataMessageStanza: {
          fields: {
            id: {
              type: 'string',
              id: 2
            },
            from: {
              rule: 'required',
              type: 'string',
              id: 3
            },
            to: {
              type: 'string',
              id: 4
            },
            category: {
              rule: 'required',
              type: 'string',
              id: 5
            },
            token: {
              type: 'string',
              id: 6
            },
            app_data: {
              rule: 'repeated',
              type: 'AppData',
              id: 7
            },
            from_trusted_server: {
              type: 'bool',
              id: 8
            },
            persistent_id: {
              type: 'string',
              id: 9
            },
            stream_id: {
              type: 'int32',
              id: 10
            },
            last_stream_id_received: {
              type: 'int32',
              id: 11
            },
            reg_id: {
              type: 'string',
              id: 13
            },
            device_user_id: {
              type: 'int64',
              id: 16
            },
            ttl: {
              type: 'int32',
              id: 17
            },
            sent: {
              type: 'int64',
              id: 18
            },
            queued: {
              type: 'int32',
              id: 19
            },
            status: {
              type: 'int64',
              id: 20
            },
            raw_data: {
              type: 'bytes',
              id: 21
            },
            immediate_ack: {
              type: 'bool',
              id: 24
            }
          }
        },
        StreamAck: {
          fields: {}
        },
        SelectiveAck: {
          fields: {
            id: {
              rule: 'repeated',
              type: 'string',
              id: 1
            }
          }
        }
      }
    }
  }
}
