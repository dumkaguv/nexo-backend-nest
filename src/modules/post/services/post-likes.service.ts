import { Injectable } from '@nestjs/common'

import { Prisma } from '@prisma/client'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { ResponsePostLikeDto } from '../dto'

@Injectable()
export class PostLikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  public async findAllLikes(
    postId: number,
    userId: number,
    query: FindAllQueryDto<ResponsePostLikeDto>
  ) {
    const followingUserIds = await this.userService.findFollowingUserIds(userId)

    return paginate({
      prisma: this.prisma,
      model: 'postLike',
      include: { user: { include: { profile: true } } },
      where: { postId, ...this.getUserSearchWhere(query) },
      ...query,
      computed: {
        user: ({ user }) => ({
          ...user,
          isFollowing: followingUserIds.has(user.id)
        })
      }
    })
  }

  public async createLike(userId: number, postId: number) {
    await this.prisma.postLike.create({
      data: { userId, postId }
    })

    return {}
  }

  public removeLike(userId: number, postId: number) {
    return this.prisma.postLike.delete({
      where: { userId_postId: { userId, postId } }
    })
  }

  private getUserSearchWhere({ search }: FindAllQueryDto, userId?: number) {
    const where: Prisma.PostLikeWhereInput = { userId }

    if (search) {
      where.OR = [
        {
          user: {
            username: { contains: search, mode: Prisma.QueryMode.insensitive }
          }
        },
        {
          user: {
            profile: {
              fullName: { contains: search, mode: Prisma.QueryMode.insensitive }
            }
          }
        }
      ]
    }

    return where
  }
}
