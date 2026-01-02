import { ForbiddenException, Injectable } from '@nestjs/common'

import type { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'

import type { ResponseMessageDto } from '@/modules/message/dto'
import type { MessageService } from '@/modules/message/message.service'
import type { PrismaService } from '@/prisma/prisma.service'

import type { CreateConversationDto, ResponseConversationDto } from './dto'

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageService: MessageService
  ) {}

  async findAll(
    userId: number,
    query: FindAllQueryDto<ResponseConversationDto>
  ) {
    return paginate({
      prisma: this.prisma,
      model: 'conversation',
      ...query,
      where: {
        AND: [
          query.search ?? {},
          { OR: [{ senderId: userId }, { receiverId: userId }] }
        ]
      },
      include: {
        receiver: { include: { profile: { include: { avatar: true } } } }
      },
      ordering: query.ordering ? query.ordering : '-updatedAt'
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
        id,
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: { include: { profile: { include: { avatar: true } } } },
        receiver: { include: { profile: { include: { avatar: true } } } }
      }
    })

    if (!conversation) {
      throw new ForbiddenException('Access denied')
    }

    return conversation
  }

  async create(senderId: number, dto: CreateConversationDto) {
    return this.prisma.conversation.create({ data: { senderId, ...dto } })
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

    return this.prisma.conversation.delete({ where: { id } })
  }
}
