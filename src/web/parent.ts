interface Context {
  member?: string
}

interface Auth {
  token: string
  application: string
  user: string
}

interface HelloResponse {
  type: 'hello'
  id: string
  context: Context
  auth: Auth
}

function createHelloResponse(messageId: string): HelloResponse {
  return {
    type: 'hello',
    id: messageId,
    context: {
      member: 'mem_123',
    },
    auth: {
      token: 'thisisasjwt',
      application: 'app_123',
      user: 'usr_123',
    },
  }
}

export function init() {
  console.log('Hello world, this is the parent app')
  // Default iframe base url is same as the parent, which works in Glitch
  var iframeOrigin = window.location.protocol + '//' + window.location.host
  if (window.location.host === 'localhost:3000') {
    // If the parent is loaded from localhost, we can use the localho.st trick
    // to load the iframe from a different origin, to test cross-domain config.
    iframeOrigin = 'http://plugin.localho.st:3000'
  }

  var iframe = document.createElement('iframe')
  iframe.id = 'iframe1'
  iframe.src = iframeOrigin + '/iframe.html'
  iframe.width = '800px'
  iframe.height = '400px'
  iframe.sandbox.add('allow-forms', 'allow-popups', 'allow-scripts', 'allow-same-origin')
  var container = document.querySelector('#placeholder')
  if (!container) {
    console.error('Could not find #placeholder')
    return
  }
  container.appendChild(iframe)

  var destination = iframe.contentWindow

  iframe.addEventListener('load', function (e) {
    console.log('[parent] iframe load complete')
  })

  window.addEventListener('message', (event) => {
    if (!destination) {
      console.error('Could not find iframe window handle')
      return
    }
    if (event.source === destination) {
      if (event.origin !== iframeOrigin) {
        console.warn("[parent] Ew, I don't trust this message", event)
        return
      }
      console.log('[parent] Received message from iframe1: ' + event.data)
      var message = JSON.parse(event.data)
      if (message.type === 'hello') {
        var response = createHelloResponse(message.id)
        console.log("[parent] sending 'hello' response")
        destination.postMessage(JSON.stringify(response), iframeOrigin)
      } else if (message.type === 'complete') {
        console.log("[parent] received 'complete' from iframe1")
      }
    }
  })
}

init()
