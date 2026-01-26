import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '../constants'

import type { Server, Socket } from 'socket.io'

type ServerToClientEvents = {
  [SERVER_TO_CLIENT.ONLINE]: (userId: number) => void
  [SERVER_TO_CLIENT.OFFLINE]: (userId: number) => void
  [SERVER_TO_CLIENT.ONLINE_LIST]: (userIds: number[]) => void
}

type ClientToServerEvents = {
  [CLIENT_TO_SERVER.ONLINE_LIST_REQUEST]: () => void
}

type InterServerEvents = Record<string, never>

type SocketData = {
  userId?: number
}

export type UserServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

export type UserSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
