import { exportJWK, generateKeyPair, importJWK } from 'jose'

/**
 * This script can be used to create a test keypair for testing.
 * In this demo application we have already created one and set it in config.ts.
 * Usage:
 *  npx ts-node src/server/generateKeyPair.ts
 */
async function main(): Promise<void> {
  const { publicKey, privateKey } = await generateKeyPair('EdDSA', { crv: 'Ed25519' })
  const publicJwk = await exportJWK(publicKey)
  const privateJwk = await exportJWK(privateKey)
  console.log(publicJwk)
  console.log(privateJwk)

  await importJWK(privateJwk, 'EdDSA')
}

main()
