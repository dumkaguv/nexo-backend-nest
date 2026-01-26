import { SERVER_TO_CLIENT } from '../constants'

import type { ConversationResponsePayload } from './ConversationResponsePayload'
import type { Server, Socket } from 'socket.io'

type ServerToClientEvents = {
  [SERVER_TO_CLIENT.NEW]: (payload: ConversationResponsePayload) => void
  [SERVER_TO_CLIENT.DELETED]: (payload: {
    deletedConversationId: number
  }) => void
}
type ClientToServerEvents = Record<string, never>
type InterServerEvents = Record<string, never>
type SocketData = {
  userId?: number
}

export type ConversationServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

export type ConversationSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
