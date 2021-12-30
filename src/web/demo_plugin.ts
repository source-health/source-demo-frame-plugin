/**
 * The main bundle for iframe.e2e.html, which is a simple plugin that helps us write E2E
 * tests of the plugin functionality.
 *
 * Rather than hitting a demo backend, this plugin just displays the data received from the
 * parent window.
 */

import { SourceBridge } from '@source-health/sourcebridge'

async function replaceContent(data: Record<string, unknown>): Promise<void> {
  var contentDiv = document.querySelector('#content')
  if (!contentDiv) {
    console.error('Could not find #content div')
    return
  }

  contentDiv.innerHTML = `Data that was passed from the parent window<br><pre id='data'>${JSON.stringify(
    data,
    null,
    2,
  )}</pre>`
}

interface Config {
  initDelay: number
  readyDelay: number
}

function getIntParam(key: string): number {
  const urlParams = new URLSearchParams(window.location.search)
  const value = urlParams.get(key)
  if (value) {
    return parseInt(value, 10)
  }
  return 0
}

/**
 * Depending on query params, we will add a delay before calling init() and/or ready(),
 * for testing our error handling of these cases.
 */
function getConfig(): Config {
  return {
    initDelay: getIntParam('initDelay'),
    readyDelay: getIntParam('readyDelay'),
  }
}

async function init() {
  const { initDelay, readyDelay } = getConfig()
  // Subscribe to updates from the parent window.
  await SourceBridge.onContextUpdate(async (context) => {
    // Display the data we got from the parent window
    replaceContent({
      info: SourceBridge.info(),
      context,
      token: await SourceBridge.currentToken(),
    })

    if (readyDelay) {
      console.log(`[iframe] Delaying ready() by ${readyDelay}ms`)
    }
    setTimeout(async () => {
      // Call ready() to clear the loading state for the plugin
      SourceBridge.ready()
    }, readyDelay)
  })

  if (initDelay) {
    console.log(`[iframe] Delaying init() by ${initDelay}ms`)
  }
  setTimeout(async () => {
    // Kick off the initial handshake, which will lead to the context update callback being called.
    const info = await SourceBridge.init()
  }, initDelay)
}

init()
