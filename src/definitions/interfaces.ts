export interface FCMClientACG {
  id: bigint
  securityToken: bigint
}

export interface FCMSubscription {
  acg: {
    id: bigint
    securityToken: bigint
  }
  token: string
}
