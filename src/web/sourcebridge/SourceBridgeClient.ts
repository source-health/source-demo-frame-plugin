import { MessageType } from './MessageType'
import { EventEnvelope, ResponseEnvelope } from './Envelope'

type ResolveFn<T> = (value: T) => void
type OnMessageFn = (envelope: EventEnvelope) => Promise<void>

export class SourceBridgeClient {
  // Map where we keep track of open requests and their promise resolve callbacks
  private openRequests: Map<string, ResolveFn<unknown>> = new Map()

  // Map where we keep track of event subscriptions
  private messageCallbacks: Map<MessageType, OnMessageFn[]> = new Map()

  constructor() {
    window.addEventListener('message', this.handleEnvelope.bind(this))
  }

  public sendEvent(message: EventEnvelope): void {
    console.log('[SourceBridge] sending message to parent:', message)
    parent.postMessage(JSON.stringify(message), '*')
  }

  public async sendRequest<TResponse>(message: EventEnvelope): Promise<TResponse> {
    const promise = new Promise<TResponse>((resolve, reject) => {
      this.openRequests.set(message.id, resolve as ResolveFn<unknown>)
    })
    console.log('[SourceBridge] sending request to parent:', message)
    parent.postMessage(JSON.stringify(message), '*')
    return promise
  }

  public onEvent(type: MessageType, callback: OnMessageFn): void {
    const callbacks = this.messageCallbacks.get(type)
    if (callbacks) {
      callbacks.push(callback)
    } else {
      this.messageCallbacks.set(type, [callback])
    }
  }

  private handleEnvelope(event: MessageEvent<unknown>): void {
    if (event.source !== parent) {
      console.log('[SourceBridge] Ignoring message event from non-parent')
      return
    }
    const envelope = JSON.parse(event.data as string) as Partial<ResponseEnvelope>
    // If we have in_reply_to set then this is a response
    if (envelope.in_reply_to) {
      this.handleResponse(envelope as ResponseEnvelope)
    } else {
      this.handleEvent(envelope as EventEnvelope)
    }
  }

  private handleEvent(message: EventEnvelope): void {
    const callbacks = this.messageCallbacks.get(message.type)
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback(message)
        } catch (error) {
          console.error('[SourceBridge] error thrown in event callback:', error)
        }
      }
    }
  }

  private handleResponse(message: ResponseEnvelope): void {
    const requestId = message.in_reply_to
    console.log(`[SourceBridge] handling response to ${requestId}`, message)
    const resolve = this.openRequests.get(requestId)
    if (!resolve) {
      console.error(`[SourceBridge] Did not find resolve for request ${requestId}`)
      return
    }
    this.openRequests.delete(requestId)
    resolve(message)
  }
}
