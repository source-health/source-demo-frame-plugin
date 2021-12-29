export interface PublicJwk {
  alg: string
  crv: string
  x: string
  kty: string
}

export interface PrivateJwk {
  alg: string
  crv: string
  x: string
  d: string
  kty: string
}

export interface Config {
  publicKey: PublicJwk
  privateKey: PrivateJwk
  applicationId: string
}

export const config: Config = {
  publicKey: {
    alg: 'EdDSA',
    crv: 'Ed25519',
    x: 'w7qoYFFUnaPKSaduO_ZV2wGpJPnZcuOtTlz5a5M9dv4',
    kty: 'OKP',
  },
  privateKey: {
    alg: 'EdDSA',
    crv: 'Ed25519',
    d: '199j_11jiNQP5Gs27369ccKkCALZaZdpFtc202QSs8I',
    x: 'w7qoYFFUnaPKSaduO_ZV2wGpJPnZcuOtTlz5a5M9dv4',
    kty: 'OKP',
  },
  applicationId: 'app_123',
}
