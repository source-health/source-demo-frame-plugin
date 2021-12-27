function init() {
  console.log('Hello world, this is the iframe app')
  var hello = {
    type: 'hello',
    id: '123',
  }

  function sendComplete() {
    var complete = {
      type: 'complete',
      id: '456',
    }
    parent.postMessage(JSON.stringify(complete), '*')
  }

  window.addEventListener('load', () => {
    console.log('[iframe] I am loaded')
    console.log("[iframe] sending 'hello' message to parent")
    parent.postMessage(JSON.stringify(hello), '*')
  })

  window.addEventListener('message', (event) => {
    var contentDiv = document.querySelector('#content')
    if (!contentDiv) {
      console.error('Could not find #content div')
      return
    }
    if (event.source === parent) {
      console.log('[iframe] Message was from parent: ' + event.data)
      var message = JSON.parse(event.data)
      if (message.type === 'hello') {
        contentDiv.innerHTML = `Context: ${JSON.stringify(
          message.context,
        )}<br>Auth: ${JSON.stringify(message.auth)}`
      }
      // Here's where we would hit the customer's API to load some data
      // Then send the 'I am fully loaded' message
      setTimeout(sendComplete, 500)
    } else {
      console.warn('Received message from non-parent')
    }
  })
}

init()
