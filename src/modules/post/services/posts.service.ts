import { Injectable } from '@nestjs/common'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate, sanitizeHtmlContent } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { CreatePostDto, ResponsePostDto, UpdatePostDto } from '../dto'

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  public findAll(userId: number, query: FindAllQueryDto<ResponsePostDto>) {
    return paginate({
      prisma: this.prisma,
      model: 'post',
      include: {
        user: { include: { profile: { include: { avatar: true } } } },
        files: { include: { file: true } }
      },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt',
      computed: {
        isLiked: async ({ id }, { prisma, context }) =>
          !!(await prisma.postLike.findFirst({
            where: { postId: id, userId: context.userId }
          })),
        likesCount: ({ id }, { prisma }) =>
          prisma.postLike.count({ where: { postId: id } }),
        commentsCount: ({ id }, { prisma }) =>
          prisma.postComment.count({ where: { postId: id } })
      },
      context: { userId }
    })
  }

  public findAllMy(userId: number, query: FindAllQueryDto<ResponsePostDto>) {
    return paginate({
      prisma: this.prisma,
      model: 'post',
      where: { userId },
      include: {
        user: { include: { profile: { include: { avatar: true } } } },
        files: { include: { file: true } }
      },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt',
      computed: {
        isLiked: async ({ id }, { prisma, context }) =>
          !!(await prisma.postLike.findFirst({
            where: { postId: id, userId: context.userId }
          })),
        likesCount: ({ id }, { prisma }) =>
          prisma.postLike.count({ where: { postId: id } }),
        commentsCount: ({ id }, { prisma }) =>
          prisma.postComment.count({ where: { postId: id } })
      },
      context: { userId }
    })
  }

  public findOne(id: number) {
    return this.prisma.post.findFirstOrThrow({
      where: { id }
    })
  }

  public async create(userId: number, dto: CreatePostDto) {
    const { files, content, ...rest } = dto
    const sanitizedContent = sanitizeHtmlContent(content)

    const post = await this.prisma.post.create({
      data: { userId, content: sanitizedContent, ...rest }
    })

    if (files?.length) {
      await this.prisma.postFile.createMany({
        data: files.map((fileId) => ({
          postId: post.id,
          fileId: fileId
        })),
        skipDuplicates: true
      })
    }

    return post
  }

  public async update(id: number, dto: UpdatePostDto) {
    const { files, content, ...rest } = dto

    if (files?.length) {
      await this.prisma.postFile.createMany({
        data: files.map((fileId) => ({
          postId: id,
          fileId: fileId
        })),
        skipDuplicates: true
      })
    }

    const sanitizedContent = sanitizeHtmlContent(content)

    return this.prisma.post.update({
      data: { content: sanitizedContent, ...rest },
      where: { id }
    })
  }

  public remove(id: number) {
    return this.prisma.post.delete({ where: { id } })
  }
}
