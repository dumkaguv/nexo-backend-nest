/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

import { TokenService } from '@/modules/token/token.service'

import {
  CLIENT_TO_SERVER,
  MESSAGE_NAMESPACE,
  SERVER_TO_CLIENT
} from './constants'

import { CreateMessageDto, DeleteMessageDto, UpdateMessageDto } from './dto'
import { MessageService } from './message.service'

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

  @SubscribeMessage(CLIENT_TO_SERVER.SEND)
  public async handleSend(
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
      .emit(SERVER_TO_CLIENT.NEW, message)

    this.server
      .to(this.getUserRoom(message.senderId))
      .emit(SERVER_TO_CLIENT.SENT, message)

    return message
  }

  @SubscribeMessage(CLIENT_TO_SERVER.UPDATE)
  public async handleUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: UpdateMessageDto
  ) {
    const senderId = client.data.userId as number | undefined

    if (!senderId) {
      throw new WsException('Unauthorized')
    }

    const message = await this.messageService.update(senderId, dto.id, dto)

    this.server
      .to(this.getUserRoom(message.receiverId))
      .emit(SERVER_TO_CLIENT.UPDATED, message)

    this.server
      .to(this.getUserRoom(message.senderId))
      .emit(SERVER_TO_CLIENT.UPDATED, message)

    return message
  }

  @SubscribeMessage(CLIENT_TO_SERVER.DELETE)
  public async handleDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: DeleteMessageDto
  ) {
    const senderId = client.data.userId as number | undefined

    if (!senderId) {
      throw new WsException('Unauthorized')
    }

    const message = await this.messageService.delete(senderId, dto.id)

    this.server
      .to(this.getUserRoom(message.receiverId))
      .emit(SERVER_TO_CLIENT.DELETED, { deletedMessageId: message.id })

    this.server
      .to(this.getUserRoom(message.senderId))
      .emit(SERVER_TO_CLIENT.DELETED, { deletedMessageId: message.id })
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
    } catch {
      client.disconnect()
    }
  }

  public handleDisconnect(client: Socket) {
    const userId = client.data.userId as number | undefined

    if (userId) {
      void client.leave(this.getUserRoom(userId))
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
