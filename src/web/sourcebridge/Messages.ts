/**
 * on-the-wire JSON-stringified representations of the message payloads
 */

import { EventEnvelope, ResponseEnvelope } from './Envelope'
import { MessageType } from './MessageType'

type Response<TType extends MessageType, TPayload> = ResponseEnvelope & {
  type: TType
  payload: TPayload
}

type Event<TType extends MessageType, TPayload> = EventEnvelope & {
  type: TType
  payload: TPayload
}

export interface ContextPayload {
  member?: string
}

export interface AuthPayload {
  token: string
  application: string
  view_key: string
  expires_at: string
}

interface HelloPayload {
  context: ContextPayload
  auth: AuthPayload
}

export type HelloResponse = Response<'hello', HelloPayload>

export type ContextEvent = Event<'context', ContextPayload>

export type AuthenticationEvent = Event<'authentication', AuthPayload>
