import { BadRequestException, Injectable } from '@nestjs/common'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate, sanitizeHtmlContent } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { CreatePostCommentDto, ResponsePostCommentDto } from '../dto'

@Injectable()
export class PostCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  public findAllComments(
    postId: number,
    query: FindAllQueryDto<ResponsePostCommentDto>
  ) {
    return paginate({
      prisma: this.prisma,
      model: 'postComment',
      include: {
        user: { include: { profile: { include: { avatar: true } } } }
      },
      where: { postId, ...this.getUserSearchWhere(query) },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt'
    })
  }

  public async createComment(
    userId: number,
    postId: number,
    dto: CreatePostCommentDto
  ) {
    const sanitizedContent = sanitizeHtmlContent(dto.content)

    await this.prisma.postComment.create({
      data: { userId, postId, content: sanitizedContent }
    })

    return {}
  }

  public async updateComment(
    postId: number,
    commentId: number,
    dto: CreatePostCommentDto
  ) {
    const sanitizedContent = sanitizeHtmlContent(dto.content)

    await this.prisma.postComment.update({
      data: { content: sanitizedContent },
      where: { id: commentId, postId }
    })

    return {}
  }

  public async removeComment(
    userId: number,
    postId: number,
    commentId: number
  ) {
    const existingComment = await this.prisma.postComment.findFirstOrThrow({
      where: { id: commentId, postId }
    })

    const isMyPost = existingComment.userId === userId

    if (!isMyPost) {
      throw new BadRequestException('You are not owner of this comment')
    }

    return this.prisma.postComment.delete({
      where: { id: commentId, userId, postId }
    })
  }

  private getUserSearchWhere({ search }: FindAllQueryDto, userId?: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { userId }

    if (search) {
      where.OR = [
        {
          user: {
            username: { contains: search, mode: 'insensitive' }
          }
        },
        {
          user: {
            profile: {
              fullName: { contains: search, mode: 'insensitive' }
            }
          }
        }
      ]
    }

    return where
  }
}
