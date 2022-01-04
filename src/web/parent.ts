/**
 * This is a testing / demo scaffold that simulates the Source web application
 * loading an iframe plugin. It's super hacky and hard-coded, but it is just enough
 * to get an iframe plugin bootstrapped and communicating over the SourceBridge API.
 */

const APPLICATION_ID = 'app_123' // matches the demo server's dummy config

function generateRequestId(): string {
  return Math.random().toString(32).substring(2)
}

interface Context {
  member?: string
}
interface Auth {
  token: string
  expires_at: Date
}

interface PluginInfo {
  application: string
  view_key: string
  surface: string
}

interface HelloResponse {
  type: 'hello'
  id: string
  in_reply_to: string
  ok: boolean
  payload: {
    context: Context
    auth: Auth
    plugin_info: PluginInfo
  }
}

interface AuthEvent {
  type: 'authentication'
  id: string
  payload: Auth
}

async function createHelloResponse(messageId: string): Promise<HelloResponse> {
  return {
    type: 'hello',
    id: generateRequestId(),
    in_reply_to: messageId,
    ok: true,
    payload: {
      context: {
        member: 'mem_123',
      },
      auth: await authPayload(),
      plugin_info: {
        application: APPLICATION_ID,
        view_key: 'summary',
        surface: 'main_tab',
      },
    },
  }
}

async function createAuthEvent(): Promise<AuthEvent> {
  return {
    type: 'authentication',
    id: generateRequestId(),
    payload: await authPayload(),
  }
}

async function authPayload(): Promise<Auth> {
  const response = await fetch('/api/token')
  const token = await response.json()
  return {
    token: token.token,
    expires_at: token.expires_at,
  }
}

export async function init() {
  var iframeHtml = '/demo_plugin.html'
  if (window.location.href.includes('backend')) {
    iframeHtml = '/backend_demo_plugin.html'
  }

  // Default iframe base url is same as the parent, which works in Glitch
  var iframeOrigin = window.location.protocol + '//' + window.location.host
  if (window.location.host === 'localhost:3001') {
    // If the parent is loaded from localhost, we can use the localho.st trick
    // to load the iframe from a different origin, to test cross-domain config.
    iframeOrigin = 'http://plugin.localho.st:3001'
  }

  var iframeUrl = new URL(iframeOrigin + iframeHtml)

  // Pass through the query params
  const urlParams = new URLSearchParams(window.location.search)
  for (const entry of urlParams.entries()) {
    iframeUrl.searchParams.append(entry[0], entry[1])
  }

  var iframe = document.createElement('iframe')
  iframe.id = 'iframe1'
  iframe.src = iframeUrl.href
  iframe.width = '100%'
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
    console.log('[parent] iframe load complete', iframeUrl.href)
  })

  window.addEventListener('message', async (event) => {
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
        var response = await createHelloResponse(message.id)
        console.log("[parent] sending 'hello' response")
        destination.postMessage(JSON.stringify(response), iframeOrigin)
      } else if (message.type === 'complete') {
        console.log("[parent] received 'complete' from iframe1")
      } else {
        console.log(`[parent] unknown message type ${message.type}`)
      }
    }
  })

  setInterval(async () => {
    if (!destination) {
      console.error('Could not find iframe window handle')
      return
    }

    const event = await createAuthEvent()
    destination.postMessage(JSON.stringify(event), iframeOrigin)
  }, 10000)
}

init()
