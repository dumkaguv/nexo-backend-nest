import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets'

import type { TokenService } from '@/modules/token/token.service'

import { MESSAGE_EVENTS, MESSAGE_NAMESPACE } from './constants'

import type { CreateMessageDto } from './dto'
import type { MessageService } from './message.service'
import type {
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import type { Server, Socket } from 'socket.io'

@WebSocketGateway({ namespace: MESSAGE_NAMESPACE })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server

  constructor(
    private readonly tokenService: TokenService,
    private readonly messageService: MessageService
  ) {}

  async handleConnection(client: Socket) {
    const token = this.extractToken(client)

    if (!token) {
      client.disconnect()

      return
    }

    try {
      const payload = await this.tokenService.validateAccessToken(token)

      client.data.userId = payload.id
      client.join(this.getUserRoom(payload.id))
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId as number | undefined

    if (userId) {
      client.leave(this.getUserRoom(userId))
    }
  }

  @SubscribeMessage(MESSAGE_EVENTS.SEND)
  async handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateMessageDto
  ) {
    const senderId = client.data.userId as number | undefined

    if (!senderId) {
      throw new WsException('Unauthorized')
    }

    const message = await this.messageService.create(senderId, dto)

    this.server
      .to(this.getUserRoom(message.receiverId))
      .emit('message:new', message)
    this.server
      .to(this.getUserRoom(message.senderId))
      .emit('message:sent', message)

    return message
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
