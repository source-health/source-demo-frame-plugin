import { MessageType } from './MessageType'

export interface EventEnvelope {
  id: string
  type: MessageType
  in_reply_to?: string
}

export interface ResponseEnvelope extends EventEnvelope {
  in_reply_to: string
  ok: boolean
  error?: unknown
}
