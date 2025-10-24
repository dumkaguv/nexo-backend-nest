import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { v4 } from 'uuid'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  private readonly selectFieldsWithoutPassword: Prisma.UserSelect

  constructor(private readonly prisma: PrismaService) {
    this.selectFieldsWithoutPassword = {
      id: true,
      email: true,
      userName: true,
      activationLink: true,
      createdAt: true,
      updatedAt: true
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { userName, email, password } = createUserDto

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

    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashPassword, activationLink },
      select: this.selectFieldsWithoutPassword
    })

    // todo: profile creation

    // todo: email service

    // todo: tokens

    return user
  }

  findAll(query: FindAllQueryDto) {
    return paginate({
      prisma: this.prisma,
      model: 'user',
      select: this.selectFieldsWithoutPassword,
      ...query
    })
  }

  findOne(id: number) {
    return this.prisma.user.findFirstOrThrow({
      select: this.selectFieldsWithoutPassword,
      where: { id }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      select: {
        id: true,
        email: true,
        userName: true,
        activationLink: true,
        createdAt: true,
        updatedAt: true
      },
      where: { id },
      data: { ...updateUserDto }
    })
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    })
  }
}
