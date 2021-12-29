import { SourceBridge } from './sourcebridge/SourceBridge'

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
  console.log('Hello world, this is the iframe app')

  // Note - ideally we'd be calling this after the update subscription
  await SourceBridge.init()

  await SourceBridge.onContextUpdate(async (context) => {
    await callEcho()

    console.log('[iframe] calling ready()')
    // Call ready() to clear the loading state for the plugin
    SourceBridge.ready()

    setInterval(async () => {
      callEcho()
    }, 2_000)
  })
}

init()
