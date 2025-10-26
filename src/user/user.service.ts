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

import {
  selectFieldsWithoutPassword,
  selectUserWithRelations
} from './constants'
import { CreateUserDto, UpdateUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
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

    const hashPassword = hashSync(password, 10)
    const activationLink = v4()

    const userWithProfile = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        activationLink,
        profile: { create: { fullName } }
      },
      select: { ...selectFieldsWithoutPassword, profile: true }
    })

    // todo: email service

    return userWithProfile
  }

  findAll(query: FindAllQueryDto) {
    return paginate({
      prisma: this.prisma,
      model: 'user',
      select: { ...selectFieldsWithoutPassword, profile: true },
      ...query
    })
  }

  findOne(id: number) {
    return this.prisma.user.findFirstOrThrow({
      select: { ...selectFieldsWithoutPassword, profile: true },
      where: { id }
    })
  }

  findOneWithRelations(id: number) {
    return this.prisma.user.findFirstOrThrow({
      select: selectUserWithRelations,
      where: { id }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto & { password?: string }) {
    return this.prisma.user.update({
      select: { ...selectFieldsWithoutPassword, profile: true },
      where: { id },
      data: { ...updateUserDto }
    })
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    })
  }

  async comparePasswords(password: string, email?: string, userId?: number) {
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

    const { password: passwordFromDb, ...userWithoutPassword } =
      await this.prisma.user.findFirstOrThrow({
        include: { profile: true },
        where: whereCondition
      })

    const isValidPassword = compareSync(password, passwordFromDb)
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return userWithoutPassword
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ) {
    await this.comparePasswords(oldPassword, undefined, userId)

    return this.update(userId, { password: newPassword })
  }
}
