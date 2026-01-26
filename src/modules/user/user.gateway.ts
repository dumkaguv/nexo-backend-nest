/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { TokenService } from '@/modules/token/token.service'
import { PrismaService } from '@/prisma/prisma.service'

import { CLIENT_TO_SERVER, SERVER_TO_CLIENT, USER_NAMESPACE } from './constants'

@WebSocketGateway({ namespace: USER_NAMESPACE })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server
  private readonly onlineUsers = new Map<number, string>()

  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService
  ) {}

  @SubscribeMessage(CLIENT_TO_SERVER.ONLINE_LIST_REQUEST)
  public handleOnlineListRequest(@ConnectedSocket() client: Socket) {
    this.emitOnlineList(client)
  }

  public async handleConnection(client: Socket) {
    const token = this.extractToken(client)

    if (!token) {
      client.disconnect()

      return
    }

    try {
      const payload = await this.tokenService.validateAccessToken(token)

      client.data.userId = payload.id
      void client.join(this.getUserRoom(payload.id))
      this.emitOnline(client)
      this.emitOnlineList(client)
    } catch {
      client.disconnect()
    }
  }

  public handleDisconnect(client: Socket) {
    const userId = client.data.userId as number | undefined

    if (userId) {
      this.emitOffline(client)
      this.emitOnlineList(client)
      void client.leave(this.getUserRoom(userId))
    }
  }

  public emitOnline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId as number | undefined

    if (!userId) {
      return
    }

    const existingSocketId = this.onlineUsers.get(userId)

    this.onlineUsers.set(userId, client.id)

    if (existingSocketId) {
      return
    }

    this.server.emit(SERVER_TO_CLIENT.ONLINE, userId)
  }

  public emitOffline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId as number | undefined

    if (!userId) {
      return
    }

    const existingSocketId = this.onlineUsers.get(userId)

    if (!existingSocketId || existingSocketId !== client.id) {
      return
    }

    this.onlineUsers.delete(userId)

    this.server.emit(SERVER_TO_CLIENT.OFFLINE, userId)
    void this.updateLastActivity(userId)
  }

  private emitOnlineList(client: Socket) {
    const onlineUserIds = Array.from(this.onlineUsers.keys())

    client.emit(SERVER_TO_CLIENT.ONLINE_LIST, onlineUserIds)
  }

  private async updateLastActivity(userId: number) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastActivityAt: new Date() }
      })
    } catch {
      // Ignore update failures to avoid breaking disconnect flow
    }
  }

  private extractToken(client: Socket) {
    const auth = client.handshake.auth as { token?: string } | undefined

    if (auth?.token) {
      return auth.token
    }

    const header = client.handshake.headers.authorization

    if (!header) {
      return null
    }

    const [type, token] = header.split(' ')

    if (type?.toLowerCase() !== 'bearer') {
      return null
    }

    return token
  }

  private getUserRoom(userId: number) {
    return `user:${userId}`
  }
}
