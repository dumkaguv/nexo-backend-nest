import {
  BadRequestException,
  Injectable,
  NotFoundException
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
    const { userName, fullName, email, password } = createUserDto

    const candidate = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { userName }]
      }
    })
    if (candidate) {
      throw new BadRequestException(
        `User with such email or username already exist: (${email}, ${userName})`
      )
    }

    const hashPassword = hashSync(password, 10)
    const activationLink = v4()

    const userWithProfile = await this.prisma.user.create({
      data: {
        userName,
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

  update(id: number, updateUserDto: UpdateUserDto) {
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

  async comparePasswords(email: string, password: string) {
    const { password: passwordFromDb, ...userWithoutPassword } =
      await this.prisma.user.findUniqueOrThrow({
        include: { profile: true },
        where: { email }
      })
    const isValidPassword = compareSync(password, passwordFromDb)
    if (!isValidPassword) {
      throw new NotFoundException()
    }

    return userWithoutPassword
  }
}
