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
    searchFollowers = true
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = searchFollowers
      ? { followingId: userId }
      : { userId }

    if (query.search) {
      const targetField = searchFollowers ? 'user' : 'following'

      where.OR = [
        {
          [targetField]: {
            username: { contains: query.search, mode: 'insensitive' }
          }
        },
        {
          [targetField]: {
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
    searchFollowers = true
  ) {
    const { data: dataDb, total } = await paginate({
      model: 'subscription',
      prisma: this.prisma,
      include: searchFollowers
        ? { user: { include: { profile: { include: { avatar: true } } } } }
        : {
            following: { include: { profile: { include: { avatar: true } } } }
          },
      where: this.getWhereSubscriptionParam(userId, query, searchFollowers),
      ...query
    })

    const data = dataDb.map((record) => {
      if (record.following) {
        const { following, ...rest } = record

        return { user: following, ...rest }
      }

      return record
    })

    return { data, total }
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

    const exists = await this.prisma.subscription.findFirst({
      where: { userId, followingId: idToFollow }
    })
    if (exists) {
      throw new BadRequestException('This user already has this follower')
    }

    await this.prisma.subscription.create({
      data: { userId, followingId: idToFollow }
    })

    return {}
  }

  async unfollow(userId: number, idToUnfollow: number) {
    const exists = await this.prisma.subscription.findFirst({
      where: { userId, followingId: idToUnfollow }
    })
    if (!exists) {
      throw new BadRequestException('You do not following this user')
    }

    await this.prisma.subscription.delete({
      where: {
        userId_followingId: { userId, followingId: idToUnfollow }
      }
    })

    return {}
  }
}
