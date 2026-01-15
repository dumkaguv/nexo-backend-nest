import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate, sanitizeHtmlContent } from '@/common/utils'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateMessageDto, ResponseMessageDto, UpdateMessageDto } from './dto'

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  public findAll(userId: number, query: FindAllQueryDto<ResponseMessageDto>) {
    return paginate({
      prisma: this.prisma,
      model: 'message',
      where: { receiverId: userId },
      include: { files: { include: { file: true } } },
      ...query,
      computed: {
        files: ({ files }) => files?.map(({ file }) => file) ?? []
      }
    })
  }

  public findAllMyMessages(
    userId: number,
    conversationId: number,
    query: FindAllQueryDto
  ) {
    return paginate({
      prisma: this.prisma,
      model: 'message',
      where: {
        conversationId,
        conversation: {
          OR: [{ senderId: userId }, { receiverId: userId }]
        }
      },
      include: { files: { include: { file: true } } },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt',
      computed: {
        files: ({ files }) => files?.map(({ file }) => file) ?? []
      }
    })
  }

  public findOne(id: number) {
    return this.prisma.message.findUnique({
      where: { id },
      include: { files: { include: { file: true } } }
    })
  }

  public async create(senderId: number, dto: CreateMessageDto) {
    const { receiverId, conversationId, content, fileIds } = dto

    if (!content && (!fileIds || fileIds.length === 0)) {
      throw new BadRequestException('Message content or files are required')
    }

    await this.userService.findOne(receiverId)

    const sanitizedContent = sanitizeHtmlContent(content)

    const uniqueFileIds = await this.validateFileIds(fileIds)

    if (!sanitizedContent && uniqueFileIds.length === 0) {
      throw new BadRequestException('Message content or files are required')
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        receiverId,
        content: sanitizedContent || null,
        files: uniqueFileIds.length
          ? {
              createMany: {
                data: uniqueFileIds.map((fileId) => ({ fileId }))
              }
            }
          : undefined
      },
      include: {
        files: {
          include: { file: true }
        }
      }
    })

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      createdAt: message.createdAt,
      files: message?.files?.map(({ file: { id, url, type, uploadedAt } }) => ({
        id,
        url,
        type,
        uploadedAt
      }))
    }
  }

  public async update(senderId: number, id: number, dto: UpdateMessageDto) {
    const message = await this.findOne(id)

    if (!message || message.senderId !== senderId) {
      throw new ForbiddenException('You are not allowed to update this message')
    }

    const { content, fileIds, ...rest } = dto

    const uniqueFileIds = await this.validateFileIds(fileIds)

    if (uniqueFileIds.length) {
      await this.createMessageFiles(id, uniqueFileIds)
    }

    const data = {
      ...rest,
      content: sanitizeHtmlContent(content)
    }

    return this.prisma.message.update({
      data: { ...data, isEdited: true },
      where: { id },
      include: { files: { include: { file: true } } }
    })
  }

  public async delete(senderId: number, id: number) {
    const message = await this.findOne(id)

    if (!message || message.senderId !== senderId) {
      throw new ForbiddenException('You are not allowed to delete this message')
    }

    return this.prisma.message.delete({ where: { id } })
  }

  private async validateFileIds(fileIds?: number[] | null) {
    const uniqueFileIds = fileIds ? [...new Set(fileIds)] : []

    if (uniqueFileIds.length === 0) {
      return []
    }

    const existing = await this.prisma.file.findMany({
      select: { id: true },
      where: { id: { in: uniqueFileIds } }
    })

    if (existing.length !== uniqueFileIds.length) {
      throw new BadRequestException('Some files were not found')
    }

    return uniqueFileIds
  }

  private createMessageFiles(messageId: number, fileIds: number[]) {
    return this.prisma.messageFile.createMany({
      data: fileIds.map((fileId) => ({
        messageId,
        fileId
      })),
      skipDuplicates: true
    })
  }
}
