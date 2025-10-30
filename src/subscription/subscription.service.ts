import { BadRequestException, Injectable } from '@nestjs/common'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { ResponseSubscriptionDto } from './dto'

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  private getWhereSubscriptionParam(
    userId: number,
    query: FindAllQueryDto<ResponseSubscriptionDto>,
    searchFollowers: boolean = true
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = searchFollowers ? { followingId: userId } : { userId }

    if (query.search) {
      where.OR = [
        { user: { username: { contains: query.search, mode: 'insensitive' } } },
        {
          user: {
            profile: {
              fullName: { contains: query.search, mode: 'insensitive' }
            }
          }
        }
      ]
    }

    return where
  }

  async findAllSubscriptions(
    userId: number,
    query: FindAllQueryDto<ResponseSubscriptionDto>,
    searchFollowers: boolean = true
  ) {
    return paginate({
      model: 'subscription',
      prisma: this.prisma,
      include: { user: { include: { profile: true } } },
      where: this.getWhereSubscriptionParam(userId, query, searchFollowers),
      ...query
    })
  }

  async findOneSubscriptionCount(userId: number) {
    const [followers, following] = await Promise.all([
      this.prisma.subscription.count({
        where: this.getWhereSubscriptionParam(userId, {})
      }),
      this.prisma.subscription.count({
        where: this.getWhereSubscriptionParam(userId, {}, false)
      })
    ])

    return { followers, following }
  }

  async follow(userId: number, idToFollow: number) {
    if (userId === idToFollow) {
      throw new BadRequestException('You cannot follow yourself')
    }

    const follower = await this.prisma.subscription.findFirst({
      where: { userId, followingId: idToFollow }
    })
    if (follower) {
      throw new BadRequestException('This user already has this follower')
    }

    await this.prisma.subscription.create({
      data: { userId, followingId: idToFollow }
    })
  }

  async unfollow(userId: number, idToUnfollow: number) {
    await this.prisma.subscription.delete({
      where: {
        userId_followingId: { userId: userId, followingId: idToUnfollow }
      }
    })
  }
}
