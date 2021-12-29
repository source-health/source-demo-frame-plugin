import { SourceBridge } from './sourcebridge/SourceBridge'

/**
 * The main script bundle for 'iframe.html', which is a demo plugin that runs within
 * parent.html and hits the demo backend inside this codebase
 */

async function callEcho(): Promise<void> {
  var contentDiv = document.querySelector('#content')
  if (!contentDiv) {
    console.error('Could not find #content div')
    return
  }

  // Here we assume that the backend API is on the same domain as the iframe
  // This could be separate with an appropriate CORS policy on the API.
  const response = await fetch(`/echo`, {
    headers: {
      Authorization: `Bearer ${SourceBridge.currentToken().token}`,
    },
  })
  const token = await response.json()
  contentDiv.innerHTML = `Result of our API verifying the JWT:<br><pre>${JSON.stringify(
    token,
    null,
    2,
  )}</pre>`
}

async function init() {
  // Subscribe to context updates from the parent window:w
  await SourceBridge.onContextUpdate(async (context) => {
    // Hit the demo backend with the token provided by the parent window
    await callEcho()

    // Call ready() to clear the loading state for the plugin
    SourceBridge.ready()

    // Ongoing: keep calling the demo backend with the token that should be refreshed automatically
    setInterval(async () => {
      callEcho()
    }, 2_000)
  })

  console.log('[iframe] calling init()')
  // Kick off the handshake (which will lead to the context update callback being called)
  await SourceBridge.init()
}

init()
