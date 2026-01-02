import { BadRequestException, Injectable } from '@nestjs/common'

import type { FindAllQueryDto } from '@/common/dtos'
import {
  getUserSearchWhere,
  paginate,
  sanitizeHtmlContent
} from '@/common/utils'
import type { FileService } from '@/modules/file/file.service'
import type { UserService } from '@/modules/user/user.service'
import type { PrismaService } from '@/prisma/prisma.service'

import type {
  CreatePostCommentDto,
  CreatePostDto,
  ResponsePostCommentDto,
  ResponsePostDto,
  ResponsePostLikeDto,
  UpdatePostDto
} from './dto'

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  async findAll(userId: number, query: FindAllQueryDto<ResponsePostDto>) {
    return await paginate({
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
        likesCount: async ({ id }, { prisma }) =>
          await prisma.postLike.count({ where: { postId: id } }),
        commentsCount: async ({ id }, { prisma }) =>
          await prisma.postComment.count({ where: { postId: id } })
      },
      context: { userId }
    })
  }

  async findAllComments(
    postId: number,
    query: FindAllQueryDto<ResponsePostCommentDto>
  ) {
    return await paginate({
      prisma: this.prisma,
      model: 'postComment',
      include: {
        user: { include: { profile: { include: { avatar: true } } } }
      },
      where: { postId, ...getUserSearchWhere(query) },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt'
    })
  }

  async findAllLikes(
    postId: number,
    userId: number,
    query: FindAllQueryDto<ResponsePostLikeDto>
  ) {
    const followingUserIds = await this.userService.findFollowingUserIds(userId)

    return await paginate({
      prisma: this.prisma,
      model: 'postLike',
      include: { user: { include: { profile: true } } },
      where: { postId, ...getUserSearchWhere(query) },
      ...query,
      computed: {
        user: ({ user }) => ({
          ...user,
          isFollowing: followingUserIds.has(user.id)
        })
      }
    })
  }

  findOne(id: number) {
    return this.prisma.post.findFirstOrThrow({
      where: { id }
    })
  }

  async create(userId: number, dto: CreatePostDto) {
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

  async createLike(userId: number, postId: number) {
    await this.prisma.postLike.create({
      data: { userId, postId }
    })

    return {}
  }

  async createComment(
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

  async update(id: number, dto: UpdatePostDto) {
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

  async updateComment(
    id: number,
    commentId: number,
    dto: CreatePostCommentDto
  ) {
    const sanitizedContent = sanitizeHtmlContent(dto.content)

    await this.prisma.postComment.update({
      data: { content: sanitizedContent },
      where: { id: commentId, postId: id }
    })

    return {}
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } })
  }

  async removeLike(userId: number, postId: number) {
    return await this.prisma.postLike.delete({
      where: { userId_postId: { userId, postId } }
    })
  }

  async removeComment(userId: number, postId: number, commentId: number) {
    const existingComment = await this.prisma.postComment.findFirstOrThrow({
      where: { id: commentId, postId }
    })

    const isMyPost = existingComment.userId === userId

    if (!isMyPost) {
      throw new BadRequestException('You are not owner of this comment')
    }

    return await this.prisma.postComment.delete({
      where: { id: commentId, userId, postId }
    })
  }
}
