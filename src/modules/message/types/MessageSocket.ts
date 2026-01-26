import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '../constants'
import { CreateMessageDto, DeleteMessageDto, UpdateMessageDto } from '../dto'

import type { Server, Socket } from 'socket.io'

type ServerToClientEvents = {
  [SERVER_TO_CLIENT.NEW]: (payload: unknown) => void
  [SERVER_TO_CLIENT.SENT]: (payload: unknown) => void
  [SERVER_TO_CLIENT.UPDATED]: (payload: unknown) => void
  [SERVER_TO_CLIENT.DELETED]: (payload: { deletedMessageId: number }) => void
}

type ClientToServerEvents = {
  [CLIENT_TO_SERVER.SEND]: (dto: CreateMessageDto) => void
  [CLIENT_TO_SERVER.UPDATE]: (dto: UpdateMessageDto) => void
  [CLIENT_TO_SERVER.DELETE]: (dto: DeleteMessageDto) => void
}

type InterServerEvents = Record<string, never>

type SocketData = {
  userId?: number
}

export type MessageServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

export type MessageSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
