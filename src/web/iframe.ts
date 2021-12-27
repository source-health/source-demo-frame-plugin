import { SourceBridge } from './sourcebridge/SourceBridge'

async function init() {
  console.log('Hello world, this is the iframe app')
  await SourceBridge.init()

  await SourceBridge.onContextUpdate(async (context) => {
    var contentDiv = document.querySelector('#content')
    if (!contentDiv) {
      console.error('Could not find #content div')
      return
    }
    contentDiv.innerHTML = `Context: ${JSON.stringify(context)}<br>Auth: ${JSON.stringify(
      SourceBridge.currentToken(),
    )}`

    // Simulate hitting our backend by sleeping
    setTimeout(() => {
      console.log('[iframe] calling ready()')
      SourceBridge.ready()
    }, 500)
  })
}

init()
