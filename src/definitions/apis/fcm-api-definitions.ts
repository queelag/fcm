import { FetchError, FetchResponse } from '@aracna/core'

export namespace FcmApiDefinitions {
  export interface SubscribeRequestBody {
    authorized_entity: string
    encryption_auth: string
    encryption_key: string
    endpoint: string
  }

  export interface SubscribeResponse extends FetchResponse<SubscribeResponseData> {}

  export interface SubscribeResponseData {
    pushSet: string
    token: string
  }

  export namespace V1 {
    export interface AndroidConfig<T extends object = object> {
      /**
       * An identifier of a group of messages that can be collapsed, so that only the last message gets sent when delivery can be resumed. A maximum of 4 different collapse keys is allowed at any given time.
       */
      collapse_key?: string
      /**
       * Arbitrary key/value payload. If present, it will [override google.firebase.fcm.v1.Message.data](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Message.FIELDS.data).
       *
       * An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1.3kg", "count": "3" }.
       */
      data?: Record<string, string>
      /**
       * If set to true, messages will be allowed to be delivered to the app while the device is in direct boot mode. See [Support Direct Boot mode](https://developer.android.com/training/articles/direct-boot).
       */
      direct_boot_ok?: boolean
      /**
       * Options for features provided by the FCM SDK for Android.
       */
      fcm_options?: AndroidFcmOptions
      /**
       * Notification to send to android devices.
       */
      notification?: Notification<T>
      /**
       * Message priority. Can take "normal" and "high" values. For more information, see [Setting the priority of a message](https://goo.gl/GjONJv).
       */
      priority?: AndroidMessagePriority
      /**
       * Package name of the application where the registration token must match in order to receive the message.
       */
      restricted_package_name?: string
      /**
       * How long (in seconds) the message should be kept in FCM storage if the device is offline. The maximum time to live supported is 4 weeks, and the default value is 4 weeks if not set. Set it to 0 if want to send the message immediately. In JSON format, the Duration type is encoded as a string rather than an object, where the string ends in the suffix "s" (indicating seconds) and is preceded by the number of seconds, with nanoseconds expressed as fractional seconds. For example, 3 seconds with 0 nanoseconds should be encoded in JSON format as "3s", while 3 seconds and 1 nanosecond should be expressed in JSON format as "3.000000001s". The ttl will be rounded down to the nearest second.
       *
       * A duration in seconds with up to nine fractional digits, ending with 's'. Example: "3.5s".
       */
      ttl?: string
    }

    export interface AndroidFcmOptions extends FcmOptions {}

    export enum AndroidMessagePriority {
      /**
       * Default priority for data messages. Normal priority messages won't open network connections on a sleeping device, and their delivery may be delayed to conserve the battery. For less time-sensitive messages, such as notifications of new email or other data to sync, choose normal delivery priority.
       */
      NORMAL = 'NORMAL',
      /**
       * Default priority for notification messages. FCM attempts to deliver high priority messages immediately, allowing the FCM service to wake a sleeping device when possible and open a network connection to your app server. Apps with instant messaging, chat, or voice call alerts, for example, generally need to open a network connection and make sure FCM delivers the message to the device without delay. Set high priority if the message is time-critical and requires the user's immediate interaction, but beware that setting your messages to high priority contributes more to battery drain compared with normal priority messages.
       */
      HIGH = 'HIGH'
    }

    export type AndroidNotification<T extends object = object> = Notification<T> & {
      /**
       * The notification's body text. If present, it will override [google.firebase.fcm.v1.Notification.body](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.body).
       */
      body?: string
      /**
       * Variable string values to be used in place of the format specifiers in body_loc_key to use to localize the body text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information.
       */
      body_loc_args?: string
      /**
       * The key to the body string in the app's string resources to use to localize the body text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information.
       */
      body_loc_key?: string
      /**
       * The [notification's channel id](https://developer.android.com/guide/topics/ui/notifiers/notifications#ManageChannels) (new in Android O). The app must create a channel with this channel ID before any notification with this channel ID is received. If you don't send this channel ID in the request, or if the channel ID provided has not yet been created by the app, FCM uses the channel ID specified in the app manifest.
       */
      channel_id?: string
      /**
       * The action associated with a user click on the notification. If specified, an activity with a matching intent filter is launched when a user clicks on the notification.
       */
      click_action?: string
      /**
       * The notification's icon color, expressed in #rrggbb format.
       */
      color?: string
      /**
       * If set to true, use the Android framework's default LED light settings for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). If default_light_settings is set to true and light_settings is also set, the user-specified light_settings is used instead of the default value.
       */
      default_light_settings?: boolean
      /**
       * If set to true, use the Android framework's default sound for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml).
       */
      default_sound?: boolean
      /**
       * If set to true, use the Android framework's default vibrate pattern for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). If default_vibrate_timings is set to true and vibrate_timings is also set, the default value is used instead of the user-specified vibrate_timings.
       */
      default_vibrate_timings?: boolean
      /**
       * Set the time that the event in the notification occurred. Notifications in the panel are sorted by this time. A point in time is represented using [protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Timestamp).
       *
       * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
       */
      event_time?: string
      /**
       * The notification's icon. Sets the notification icon to myicon for drawable resource myicon. If you don't send this key in the request, FCM displays the launcher icon specified in your app manifest.
       */
      icon?: string
      /**
       * Contains the URL of an image that is going to be displayed in a notification. If present, it will override [google.firebase.fcm.v1.Notification.image](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.image).
       */
      image?: string
      /**
       * Settings to control the notification's LED blinking rate and color if LED is available on the device. The total blinking time is controlled by the OS.
       */
      light_settings?: LightSettings
      /**
       * Set whether or not this notification is relevant only to the current device. Some notifications can be bridged to other devices for remote display, such as a Wear OS watch. This hint can be set to recommend this notification not be bridged. See [Wear OS guides](https://developer.android.com/training/wearables/notifications/bridger#existing-method-of-preventing-bridging)
       */
      local_only?: boolean
      /**
       * Sets the number of items this notification represents. May be displayed as a badge count for launchers that support badging. See [Notification Badge](https://developer.android.com/training/notify-user/badges). For example, this might be useful if you're using just one notification to represent multiple new messages but you want the count here to represent the number of total new messages. If zero or unspecified, systems that support badging use the default, which is to increment a number displayed on the long-press menu each time a new notification arrives.
       */
      notification_count?: number
      /**
       * Set the relative priority for this notification. Priority is an indication of how much of the user's attention should be consumed by this notification. Low-priority notifications may be hidden from the user in certain situations, while the user might be interrupted for a higher-priority notification. The effect of setting the same priorities may differ slightly on different platforms. Note this priority differs from AndroidMessagePriority. This priority is processed by the client after the message has been delivered, whereas [AndroidMessagePriority](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#androidmessagepriority) is an FCM concept that controls when the message is delivered.
       */
      notification_priority?: NotificationPriority
      /**
       * The sound to play when the device receives the notification. Supports "default" or the filename of a sound resource bundled in the app. Sound files must reside in /res/raw/.
       */
      sound?: string
      /**
       * When set to false or unset, the notification is automatically dismissed when the user clicks it in the panel. When set to true, the notification persists even when the user clicks it.
       */
      sticky?: boolean
      /**
       * Identifier used to replace existing notifications in the notification drawer. If not specified, each request creates a new notification. If specified and a notification with the same tag is already being shown, the new notification replaces the existing one in the notification drawer.
       */
      tag?: string
      /**
       * Sets the "ticker" text, which is sent to accessibility services. Prior to API level 21 (Lollipop), sets the text that is displayed in the status bar when the notification first arrives.
       */
      ticker?: string
      /**
       * The notification's title. If present, it will override [google.firebase.fcm.v1.Notification.title](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.title).
       */
      title?: string
      /**
       * Variable string values to be used in place of the format specifiers in title_loc_key to use to localize the title text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information.
       */
      title_loc_args?: string
      /**
       * The key to the title string in the app's string resources to use to localize the title text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information.
       */
      title_loc_key?: string
      /**
       * Set the vibration pattern to use. Pass in an array of [protobuf.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) to turn on or off the vibrator. The first value indicates the Duration to wait before turning the vibrator on. The next value indicates the Duration to keep the vibrator on. Subsequent values alternate between Duration to turn the vibrator off and to turn the vibrator on. If vibrate_timings is set and default_vibrate_timings is set to true, the default value is used instead of the user-specified vibrate_timings.
       *
       * A duration in seconds with up to nine fractional digits, ending with 's'. Example: "3.5s".
       */
      vibrate_timings?: string
      /**
       * Set the [Notification.visibility](https://developer.android.com/reference/android/app/Notification.html#visibility) of the notification.
       */
      visibility?: Visibility
    }

    export interface ApnsConfig {
      /**
       * Options for features provided by the FCM SDK for iOS.
       */
      fcm_options?: ApnsFcmOptions
      /**
       * HTTP request headers defined in Apple Push Notification Service. Refer to [APNs request headers](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns) for supported headers such as apns-expiration and apns-priority.
       *
       * The backend sets a default value for apns-expiration of 30 days and a default value for apns-priority of 10 if not explicitly set.
       *
       * An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1.3kg", "count": "3" }.
       */
      headers?: Record<string, string>
      /**
       * APNs payload as a JSON object, including both aps dictionary and custom payload. See [Payload Key Reference](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification). If present, it overrides [google.firebase.fcm.v1.Notification.title](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.title) and [google.firebase.fcm.v1.Notification.body](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.body).
       */
      payload?: Record<string, any>
    }

    export interface ApnsError {
      /**
       * Failure reason in the response from APNs. See [values](https://goo.gl/oFSRPg) for explanations of possible values.
       */
      reason: string
      /**
       * Status code in the response from APNs. See [APNs status codes](https://goo.gl/BtPJLj) for explanations of possible values.
       */
      status_code: number
    }

    export interface ApnsFcmOptions extends FcmOptions {
      /**
       * Contains the URL of an image that is going to be displayed in a notification. If present, it will override [google.firebase.fcm.v1.Notification.image](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.image).
       */
      image?: string
    }

    export interface Color {
      /**
       * The fraction of this color that should be applied to the pixel. That is, the final pixel color is defined by the equation:
       *
       * pixel color = alpha * (this color) + (1.0 - alpha) * (background color)
       *
       * This means that a value of 1.0 corresponds to a solid color, whereas a value of 0.0 corresponds to a completely transparent color. This uses a wrapper message rather than a simple float scalar so that it is possible to distinguish between a default value and the value being unset. If omitted, this color object is rendered as a solid color (as if the alpha value had been explicitly given a value of 1.0).
       */
      alpha: number
      /**
       * The amount of blue in the color as a value in the interval [0, 1].
       */
      blue: number
      /**
       * The amount of green in the color as a value in the interval [0, 1].
       */
      green: number
      /**
       * The amount of red in the color as a value in the interval [0, 1].
       */
      red: number
    }

    export interface Error extends FetchError<ApnsError | FcmError> {}

    export enum ErrorCode {
      /**
       * No more information is available about this error.
       */
      UNSPECIFIED_ERROR = 'UNSPECIFIED_ERROR',
      /**
       * (HTTP error code = 400) Request parameters were invalid. An extension of type google.rpc.BadRequest is returned to specify which field was invalid.
       */
      INVALID_ARGUMENT = 'INVALID_ARGUMENT',
      /**
       * (HTTP error code = 404) App instance was unregistered from FCM. This usually means that the token used is no longer valid and a new one must be used.
       */
      UNREGISTERED = 'UNREGISTERED',
      /**
       * (HTTP error code = 403) The authenticated sender ID is different from the sender ID for the registration token.
       */
      SENDER_ID_MISMATCH = 'SENDER_ID_MISMATCH',
      /**
       * (HTTP error code = 429) Sending limit exceeded for the message target. An extension of type google.rpc.QuotaFailure is returned to specify which quota was exceeded.
       */
      QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
      /**
       * (HTTP error code = 503) The server is overloaded.
       */
      UNAVAILABLE = 'UNAVAILABLE',
      /**
       * (HTTP error code = 500) An unknown internal error occurred.
       */
      INTERNAL = 'INTERNAL',
      /**
       * (HTTP error code = 401) APNs certificate or web push auth key was invalid or missing.
       */
      THIRD_PARTY_AUTH_ERROR = 'THIRD_PARTY_AUTH_ERROR'
    }

    export interface FcmError {
      error_code: ErrorCode
    }

    export interface FcmOptions {
      /**
       * Label associated with the message's analytics data.
       */
      analytics_label?: string
    }

    export interface LightSettings {
      /**
       * Required. Set color of the LED with [google.type.Color](https://github.com/googleapis/googleapis/blob/master/google/type/color.proto).
       */
      color: Color
      /**
       * Required. Along with light_on_duration, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration)
       *
       * A duration in seconds with up to nine fractional digits, ending with 's'. Example: "3.5s".
       */
      light_off_duration: string
      /**
       * Required. Along with light_off_duration, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration)
       *
       * A duration in seconds with up to nine fractional digits, ending with 's'. Example: "3.5s".
       */
      light_on_duration: string
    }

    export interface Message<T extends object = object> {
      /**
       * Input only. Android specific options for messages sent through [FCM connection server](https://goo.gl/4GLdUl).
       */
      android?: AndroidConfig<T>
      /**
       * Input only. [Apple Push Notification Service](https://goo.gl/MXRTPa) specific options.
       */
      apns?: ApnsConfig
      /**
       * Input only. Arbitrary key/value payload, which must be UTF-8 encoded. The key should not be a reserved word ("from", "message_type", or any word starting with "google" or "gcm"). When sending payloads containing only data fields to iOS devices, only normal priority ("apns-priority": "5") is allowed in [ApnsConfig](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#apnsconfig).
       *
       * An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1.3kg", "count": "3" }.
       */
      data?: Record<string, string>
      /**
       * Input only. Template for FCM SDK feature options to use across all platforms.
       */
      fcm_options?: FcmOptions
      /**
       * Output Only. The identifier of the message sent, in the format of projects/{project_id}/messages/{message_id}.
       */
      name?: string
      /**
       * Input only. Basic notification template to use across all platforms.
       */
      notification?: Notification<T>
      /**
       * Input only. [Webpush protocol](https://tools.ietf.org/html/rfc8030) options.
       */
      webpush?: WebpushConfig
    }

    export type MessageWithTarget<T extends object = object> =
      | (Message<T> & {
          /**
           * Registration token to send a message to.
           */
          token: string
        })
      | (Message<T> & {
          /**
           * Topic name to send a message to, e.g. "weather". Note: "/topics/" prefix should not be provided.
           */
          topic: string
        })
      | (Message<T> & {
          /**
           * Condition to send a message to, e.g. "'foo' in topics && 'bar' in topics".
           */
          condition: string
        })

    export type Notification<T extends object = object> = {
      /**
       * The notification's body text.
       */
      body?: string
      /**
       * Contains the URL of an image that is going to be downloaded on the device and displayed in a notification. JPEG, PNG, BMP have full support across platforms. Animated GIF and video only work on iOS. WebP and HEIF have varying levels of support across platforms and platform versions. Android has 1MB image size limit. Quota usage and implications/costs for hosting image on Firebase Storage: https://firebase.google.com/pricing
       */
      image?: string
      /**
       * The notification's title.
       */
      title?: string
    } & T

    export enum NotificationPriority {
      /**
       * If priority is unspecified, notification priority is set to PRIORITY_DEFAULT.
       */
      PRIORITY_UNSPECIFIED = 'PRIORITY_UNSPECIFIED',
      /**
       * Lowest notification priority. Notifications with this PRIORITY_MIN might not be shown to the user except under special circumstances, such as detailed notification logs.
       */
      PRIORITY_MIN = 'PRIORITY_MIN',
      /**
       * Lower notification priority. The UI may choose to show the notifications smaller, or at a different position in the list, compared with notifications with PRIORITY_DEFAULT.
       */
      PRIORITY_LOW = 'PRIORITY_LOW',
      /**
       * Default notification priority. If the application does not prioritize its own notifications, use this value for all notifications.
       */
      PRIORITY_DEFAULT = 'PRIORITY_DEFAULT',
      /**
       * Higher notification priority. Use this for more important notifications or alerts. The UI may choose to show these notifications larger, or at a different position in the notification lists, compared with notifications with PRIORITY_DEFAULT.
       */
      PRIORITY_HIGH = 'PRIORITY_HIGH',
      /**
       * Highest notification priority. Use this for the application's most important items that require the user's prompt attention or input.
       */
      PRIORITY_MAX = 'PRIORITY_MAX'
    }

    export interface WebpushConfig {
      /**
       * Arbitrary key/value payload. If present, it will [override google.firebase.fcm.v1.Message.data](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Message.FIELDS.data).
       *
       * An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1.3kg", "count": "3" }.
       */
      data?: Record<string, string>
      /**
       * Options for features provided by the FCM SDK for Web.
       */
      fcm_options?: FcmOptions
      /**
       * HTTP headers defined in webpush protocol. Refer to Webpush protocol for supported headers, e.g. "TTL": "15".
       *
       * An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1.3kg", "count": "3" }.
       */
      headers?: Record<string, string>
      /**
       * Web Notification options as a JSON object. Supports Notification instance properties as defined in [Web Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification). If present, "title" and "body" fields override [google.firebase.fcm.v1.Notification.title](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.title) and [google.firebase.fcm.v1.Notification.body](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification.FIELDS.body).
       */
      notification?: Record<string, any>
    }

    export interface WebpushFcmOptions extends FcmOptions {
      /**
       * The link to open when the user clicks on the notification. For all URL values, HTTPS is required.
       */
      link?: string
    }

    export interface SendRequestBody<T extends object = object> {
      message: MessageWithTarget<T>
      validate_only?: boolean
    }

    export interface SendResponse<T extends object = object> extends FetchResponse<Message<T>> {}

    export enum Visibility {
      /**
       * If unspecified, default to Visibility.PRIVATE.
       */
      VISIBILITY_UNSPECIFIED = 'VISIBILITY_UNSPECIFIED',
      /**
       * Show this notification on all lockscreens, but conceal sensitive or private information on secure lockscreens.
       */
      PRIVATE = 'PRIVATE',
      /**
       * Show this notification in its entirety on all lockscreens.
       */
      PUBLIC = 'PUBLIC',
      /**
       * Do not reveal any part of this notification on a secure lockscreen.
       */
      SECRET = 'SECRET'
    }
  }
}
