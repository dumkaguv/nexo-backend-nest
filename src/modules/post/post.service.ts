import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdatePostDto } from 'prisma/swagger/models/update-post.dto'

import { FindAllQueryDto } from '@/common/dtos'
import { getUserSearchWhere, paginate } from '@/common/utils'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import {
  CreatePostCommentDto,
  CreatePostDto,
  ResponsePostCommentDto,
  ResponsePostDto,
  ResponsePostLikeDto
} from './dto'

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async findAll(userId: number, query: FindAllQueryDto<ResponsePostDto>) {
    return await paginate({
      prisma: this.prisma,
      model: 'post',
      include: {
        user: { include: { profile: true } },
        files: true
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
      include: { user: { include: { profile: true } } },
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
        isFollowing: ({ user: { id } }) => followingUserIds.has(id)
      }
    })
  }

  findOne(id: number) {
    return this.prisma.post.findFirstOrThrow({
      where: { id }
    })
  }

  create(userId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: { userId, ...dto }
    })
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
    await this.prisma.postComment.create({
      data: { userId, postId, ...dto }
    })

    return {}
  }

  update(id: number, dto: UpdatePostDto) {
    return this.prisma.post.update({
      data: dto,
      where: { id }
    })
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
    const existingPost = await this.prisma.postComment.findFirstOrThrow({
      where: { id: commentId }
    })

    const isMyPost = existingPost.userId === postId
    if (!isMyPost) {
      throw new BadRequestException('You are not owner of this comment')
    }

    return await this.prisma.postComment.delete({
      where: { id: commentId, userId, postId }
    })
  }
}
