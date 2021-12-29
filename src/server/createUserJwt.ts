import { SignJWT, importJWK, JWK, generateKeyPair, exportJWK } from 'jose'
import * as jose from 'jose'

import { PrivateJwk } from './config'

export const APPLICATION_ID_PREFIX = 'app' as const

export const ED25519 = 'Ed25519' as const
export const JWT_KEY_TYPE = 'OKP' as const // ('Octet Key Pair')
export const JWT_ISSUER = 'sourcehealth' as const

// 15 mins, which is enough for the host UI to retrieve new tokens every 5 mins.
export const DEFAULT_USER_TOKEN_EXPIRATION_LENGTH = 1_000 * 60 * 15

interface UserJwtParams {
  keyId: string
  privateKey: PrivateJwk
  purpose: 'verification'
  userId?: string
  applicationId?: string
}

export interface Token {
  token: string
  expiresAt: Date
}

/**
 * Do the actual signing logic for assymmetric user JWTs.
 * 'purpose' indicates whether the token can be used to make calls back into the Source API.
 */
export async function createUserJwt(params: UserJwtParams): Promise<Token> {
  const privateKey = await importJWK(params.privateKey as JWK)
  const expiresAt = new Date(Date.now() + DEFAULT_USER_TOKEN_EXPIRATION_LENGTH)
  const expiresAtEpochSeconds = Math.floor(expiresAt.getTime() / 1000)

  const token = await new SignJWT({
    purpose: params.purpose,
    app: params.applicationId,
    usr: params.userId,
  })
    .setProtectedHeader({
      alg: params.privateKey.alg,
      crv: params.privateKey.crv,
      kid: params.keyId,
    })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(expiresAtEpochSeconds)
    .sign(privateKey)

  return { token, expiresAt }
}
