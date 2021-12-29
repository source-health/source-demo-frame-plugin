/**
 * Parse out a JWT as bearer token from an Authorization header
 */
export function parseAuthorizationHeader(auth?: string): string | null {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }
  return auth.substring(7)
}
