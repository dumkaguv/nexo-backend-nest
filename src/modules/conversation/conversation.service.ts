import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'

import { ResponseMessageDto } from '@/modules/message/dto'
import { MessageService } from '@/modules/message/message.service'
import { ResponseUserProfileDto } from '@/modules/user/dto'
import { PrismaService } from '@/prisma/prisma.service'

import { ConversationGateway } from './conversation.gateway'
import { CreateConversationDto, ResponseConversationDto } from './dto'

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageService: MessageService,
    private readonly conversationGateway: ConversationGateway
  ) {}

  async findAll(
    userId: number,
    query: FindAllQueryDto<ResponseConversationDto>
  ) {
    const result = await paginate({
      prisma: this.prisma,
      model: 'conversation',
      ...query,
      where: {
        AND: [{ OR: [{ senderId: userId }, { receiverId: userId }] }]
      },
      include: {
        sender: { include: { profile: { include: { avatar: true } } } },
        receiver: { include: { profile: { include: { avatar: true } } } }
      },
      ordering: query.ordering ? query.ordering : '-updatedAt'
    })

    const data = result.data.map((conversation) => ({
      ...conversation,
      receiver:
        conversation.senderId === userId
          ? conversation.receiver
          : conversation.sender
    }))

    return { ...result, data }
  }

  async findAllSuggestions(
    userId: number,
    query: FindAllQueryDto<ResponseUserProfileDto>
  ) {
    return paginate({
      prisma: this.prisma,
      model: 'user',
      ...query,
      where: {
        AND: [
          { id: { not: userId } },

          {
            NOT: {
              OR: [
                {
                  conversationsAsReceiver: {
                    some: { senderId: userId }
                  }
                },
                {
                  conversationsAsSender: {
                    some: { receiverId: userId }
                  }
                }
              ]
            }
          }
        ]
      },
      include: {
        profile: { include: { avatar: true } }
      }
    })
  }

  async findAllConversationMessages(
    userId: number,
    conversationId: number,
    query: FindAllQueryDto<ResponseMessageDto>
  ) {
    return await this.messageService.findAllMyMessages(
      userId,
      conversationId,
      query
    )
  }

  async findOne(userId: number, id: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [{ id }, { OR: [{ senderId: userId }, { receiverId: userId }] }]
      },
      include: {
        sender: { include: { profile: { include: { avatar: true } } } },
        receiver: { include: { profile: { include: { avatar: true } } } }
      }
    })

    if (!conversation) {
      throw new ForbiddenException('Access denied')
    }

    return {
      ...conversation,
      receiver:
        conversation.senderId === userId
          ? conversation.receiver
          : conversation.sender
    }
  }

  async findOneByUserId(userId: number, otherUserId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      include: {
        sender: { include: { profile: { include: { avatar: true } } } },
        receiver: { include: { profile: { include: { avatar: true } } } }
      }
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    return {
      ...conversation,
      receiver:
        conversation.senderId === userId
          ? conversation.receiver
          : conversation.sender
    }
  }

  async create(senderId: number, dto: CreateConversationDto) {
    const conversation = await this.prisma.conversation.create({
      data: { senderId, ...dto },
      include: {
        sender: { include: { profile: { include: { avatar: true } } } },
        receiver: { include: { profile: { include: { avatar: true } } } }
      }
    })

    this.conversationGateway.emitNew(conversation)

    return conversation
  }

  async remove(userId: number, id: number) {
    const exists = await this.prisma.conversation.findFirst({
      where: {
        id,
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      select: { id: true }
    })

    if (!exists) {
      throw new ForbiddenException('Access denied')
    }

    const conversation = await this.prisma.conversation.delete({
      where: { id }
    })

    this.conversationGateway.emitDeleted(conversation)

    return conversation
  }
}
