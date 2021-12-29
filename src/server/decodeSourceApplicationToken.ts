import { importJWK, JWK, JWTPayload, jwtVerify } from 'jose'
import { PublicJwk } from './config'

const SOURCE_ISSUER = 'sourcehealth' as const

interface SourceJwtPayload extends JWTPayload {
  purpose: string
  usr: string
  app: string
  iss: string
  exp: number
}

interface SourceToken {
  orig: string
  purpose: string
  user: string
  expiresAt: Date
  application: string
}

interface ExpectedValues {
  application?: string
}

export async function decodeSourceApplicationToken(
  jwt: string,
  publicJwk: PublicJwk,
  expected?: ExpectedValues,
): Promise<SourceToken> {
  const publicKey = await importJWK(publicJwk as JWK)
  const decoded = await jwtVerify(jwt, publicKey)
  const payload = decoded.payload as SourceJwtPayload

  if (payload.iss !== SOURCE_ISSUER) {
    throw new Error(
      `Invalid issuer in Source token. Expected ${SOURCE_ISSUER}, received ${payload.iss}`,
    )
  }
  if (expected?.application && payload.app !== expected.application) {
    throw new Error(
      `Invalid application ID in Source token. Expected ${expected.application}, received ${payload.app}`,
    )
  }
  return {
    purpose: payload.purpose,
    application: payload.app,
    user: payload.usr,
    expiresAt: new Date(payload.exp * 1000),
    orig: jwt,
  }
}
