import { BadRequestException, Injectable } from '@nestjs/common'

import { sanitizeHtmlContent } from '@/common/utils'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateMessageDto } from './dto'

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async createMessage(senderId: number, dto: CreateMessageDto) {
    const { receiverId, content, fileIds } = dto

    if (!content && (!fileIds || fileIds.length === 0)) {
      throw new BadRequestException('Message content or files are required')
    }

    await this.userService.findOne(receiverId)

    const sanitizedContent = content ? sanitizeHtmlContent(content) : ''

    const uniqueFileIds = fileIds ? [...new Set(fileIds)] : []
    if (uniqueFileIds.length) {
      const existing = await this.prisma.file.findMany({
        select: { id: true },
        where: { id: { in: uniqueFileIds } }
      })
      if (existing.length !== uniqueFileIds.length) {
        throw new BadRequestException('Some files were not found')
      }
    }

    if (!sanitizedContent && uniqueFileIds.length === 0) {
      throw new BadRequestException('Message content or files are required')
    }

    const message = await this.prisma.message.create({
      data: {
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
}
