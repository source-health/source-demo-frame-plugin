import express, { Request, Response } from 'express'
import { config } from './config'
import { createUserJwt } from './createUserJwt'
import { decodeSourceApplicationToken } from './decodeSourceApplicationToken'
import { parseAuthorizationHeader } from './parseAuthorizationHeader'

const app = express()
const port = 3000

const USER_ID = 'usr_123'

// Serve static files from public/
app.use(express.static('public'))
app.use(express.static('dist'))
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  const html = `
  <html><body>
  <ul>
  <li><a href='parent.html'>parent.html</a> (loads demo iframe)</li>
  <li><a href='parent.html?e2e'>parent.html with e2e iframe</a></li>
  <li><a href='parent.html?e2e&initDelay=5000'>parent.html with e2e iframe and init delay</a></li>
  <li><a href='iframe.html'>iframe.html</a> (doesn't do anything)</li>
  <li><a href='e2e_iframe.html'>e2e_iframe.html</a> (used by Source E2E tests)</li>
  </body></html>
  `
  res.send(html)
})

/**
 * This endpoint emulates an endpoint in the Source backend that creates application tokens for the real
 * Source 'parent' window to load. In the real API this requires user authentication, but in this dummy
 * version we hand out a token for a fixed user ID.
 */
app.get('/token', async (req: Request, res: Response) => {
  const token = await createUserJwt({
    keyId: config.applicationId,
    userId: USER_ID,
    applicationId: config.applicationId,
    purpose: 'verification',
    privateKey: config.privateKey,
  })

  const data = {
    token: token.token,
    expires_at: token.expiresAt,
  }
  res.send(data)
})

/**
 * This endpoint illustrates how a customer's backend can validate and use the Source application
 * token in a request from a Source frame plugin.
 * Here the token is passed as a bearer token in the Authorization header, but the customer is free
 * to send that token via any means.
 */
app.get('/echo', async (req: Request, res: Response) => {
  const token = parseAuthorizationHeader(req.header('Authorization'))
  if (!token) {
    console.warn('Invalid Authorization header (should be a Bearer token')
    res.send({
      error: 'no valid auth header',
    })
    return
  }
  const sourceToken = await decodeSourceApplicationToken(token, config.publicKey, {
    application: config.applicationId,
  })
  console.log('sourceToken', sourceToken)
  console.log(`We can trust that the user ID is ${sourceToken.user}`)
  res.send(sourceToken)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
