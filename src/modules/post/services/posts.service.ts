import { ForbiddenException, Injectable } from '@nestjs/common'

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
        files: { include: { file: true } },
        _count: { select: { likes: true, comments: true } }
      },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt',
      computedBatch: async (records, { prisma, context }) => {
        const ids = records.map((record) => record.id)

        if (ids.length === 0) {
          return records.map(() => ({
            isLiked: false,
            likesCount: 0,
            commentsCount: 0
          }))
        }

        const liked = await prisma.postLike.findMany({
          where: { postId: { in: ids }, userId: context.userId },
          select: { postId: true }
        })
        const likedSet = new Set(liked.map((row) => row.postId))

        return records.map((record) => ({
          isLiked: likedSet.has(record.id),
          likesCount: record._count?.likes ?? 0,
          commentsCount: record._count?.comments ?? 0
        }))
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
        files: { include: { file: true } },
        _count: { select: { likes: true, comments: true } }
      },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt',
      computedBatch: async (records, { prisma, context }) => {
        const ids = records.map((record) => record.id)

        if (ids.length === 0) {
          return records.map(() => ({
            isLiked: false,
            likesCount: 0,
            commentsCount: 0
          }))
        }

        const liked = await prisma.postLike.findMany({
          where: { postId: { in: ids }, userId: context.userId },
          select: { postId: true }
        })
        const likedSet = new Set(liked.map((row) => row.postId))

        return records.map((record) => ({
          isLiked: likedSet.has(record.id),
          likesCount: record._count?.likes ?? 0,
          commentsCount: record._count?.comments ?? 0
        }))
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

  public async update(userId: number, id: number, dto: UpdatePostDto) {
    const existing = await this.prisma.post.findFirst({
      where: { id, userId },
      select: { id: true }
    })

    if (!existing) {
      throw new ForbiddenException('You are not allowed to update this post')
    }

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

  public async remove(userId: number, id: number) {
    const existing = await this.prisma.post.findFirst({
      where: { id, userId },
      select: { id: true }
    })

    if (!existing) {
      throw new ForbiddenException('You are not allowed to delete this post')
    }

    return this.prisma.post.delete({ where: { id } })
  }
}
