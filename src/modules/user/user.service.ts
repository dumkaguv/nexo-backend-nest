import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { compareSync, hashSync } from 'bcrypt'
import { v4 } from 'uuid'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { includeUserWithRelations } from './constants'

import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto) {
    const { username, fullName, email, password } = createUserDto

    const candidate = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (candidate) {
      throw new BadRequestException(
        `User with such email or username already exist: (${email}, ${username})`
      )
    }

    const hashPassword = this.hashPassword(password)
    const activationLink = v4()

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        activationLink,
        profile: { create: { fullName } }
      },
      include: includeUserWithRelations
    })
    // todo: email service

    return { ...user, followingCount: 0, followersCount: 0 }
  }

  public async findFollowingUserIds(userId: number) {
    const following = await this.prisma.subscription.findMany({
      where: { userId },
      select: { followingId: true }
    })

    return new Set(following.map(({ followingId }) => followingId))
  }

  public async findAll(
    query: FindAllQueryDto<ResponseUserDto>,
    userId: number
  ) {
    const followingIdsSet = await this.findFollowingUserIds(userId)

    return paginate({
      prisma: this.prisma,
      model: 'user',
      include: { profile: { include: { avatar: true } }, following: true },
      where: { id: { not: userId } },
      ...query,
      computed: {
        isFollowing: ({ id }) => followingIdsSet.has(id)
      }
    })
  }

  public async findOne(id: number, viewerId?: number) {
    const [user, followingCount, followersCount, isFollowing] =
      await Promise.all([
        this.prisma.user.findFirstOrThrow({
          include: { profile: { include: { avatar: true } } },
          where: { id }
        }),
        this.prisma.subscription.count({
          where: { userId: id }
        }),
        this.prisma.subscription.count({
          where: { followingId: id }
        }),
        viewerId
          ? this.prisma.subscription.findFirst({
              where: { userId: viewerId, followingId: id },
              select: { id: true }
            })
          : null
      ])

    return {
      ...user,
      followingCount,
      followersCount,
      isFollowing: !!isFollowing
    }
  }

  public async findOneWithRelations(id: number, viewerId?: number) {
    const [user, followingCount, followersCount, isFollowing] =
      await Promise.all([
        this.prisma.user.findFirstOrThrow({
          include: includeUserWithRelations,
          where: { id }
        }),
        this.prisma.subscription.count({
          where: { userId: id }
        }),
        this.prisma.subscription.count({
          where: { followingId: id }
        }),
        viewerId
          ? this.prisma.subscription.findFirst({
              where: { userId: viewerId, followingId: id },
              select: { id: true }
            })
          : null
      ])

    return {
      ...user,
      followingCount,
      followersCount,
      isFollowing: !!isFollowing
    }
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto & { password?: string }
  ) {
    await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto }
    })

    const user = await this.findOneWithRelations(id)

    return user
  }

  public remove(id: number) {
    return this.prisma.user.delete({ where: { id } })
  }

  public async comparePasswords(
    password: string,
    email?: string,
    userId?: number
  ) {
    const whereCondition = {
      OR: [] as Record<string, string | number>[]
    }

    if (email) {
      whereCondition.OR.push({ email })
    }

    if (userId) {
      whereCondition.OR.push({ id: userId })
    }

    if (whereCondition.OR.length === 0) {
      throw new BadRequestException('Email or userId must be provided')
    }

    const user = await this.prisma.user.findFirstOrThrow({
      include: includeUserWithRelations,
      where: whereCondition
    })

    const isValidPassword = compareSync(password, user.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  public async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ) {
    await this.comparePasswords(oldPassword, undefined, userId)
    const hashedPassword = this.hashPassword(newPassword)

    return this.update(userId, { password: hashedPassword })
  }

  public async updateLastActivity(userId: number, date: Date = new Date()) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastActivityAt: date }
    })
  }

  private hashPassword(password: string, rounds: number = 10) {
    return hashSync(password, rounds)
  }
}
