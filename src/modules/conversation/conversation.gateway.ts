/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

import { TokenService } from '@/modules/token/token.service'

import { CONVERSATION_NAMESPACE, SERVER_TO_CLIENT } from './constants'
import { ConversationResponsePayload, ConversationWithUsers } from './types'

@WebSocketGateway({ namespace: CONVERSATION_NAMESPACE })
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server

  constructor(private readonly tokenService: TokenService) {}

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

  public emitNew(conversation: ConversationWithUsers) {
    const senderPayload = this.mapConversationForUser(
      conversation,
      conversation.senderId
    )
    const receiverPayload = this.mapConversationForUser(
      conversation,
      conversation.receiverId
    )

    this.server
      .to(this.getUserRoom(conversation.senderId))
      .emit(SERVER_TO_CLIENT.NEW, senderPayload)

    this.server
      .to(this.getUserRoom(conversation.receiverId))
      .emit(SERVER_TO_CLIENT.NEW, receiverPayload)
  }

  public emitDeleted(conversation: {
    id: number
    senderId: number
    receiverId: number
  }) {
    const payload = { deletedConversationId: conversation.id }

    this.server
      .to(this.getUserRoom(conversation.senderId))
      .emit(SERVER_TO_CLIENT.DELETED, payload)

    this.server
      .to(this.getUserRoom(conversation.receiverId))
      .emit(SERVER_TO_CLIENT.DELETED, payload)
  }

  private mapConversationForUser(
    conversation: ConversationWithUsers,
    userId: number
  ): ConversationResponsePayload {
    const receiver =
      conversation.senderId === userId
        ? conversation.receiver
        : conversation.sender

    return {
      id: conversation.id,
      receiver,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
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
