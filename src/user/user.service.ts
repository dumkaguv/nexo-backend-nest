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

import { ProfileService } from '@/profile/profile.service'

import { selectFieldsWithoutPassword } from './constants'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService
  ) {}

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

    const user = await this.prisma.user.create({
      data: { userName, email, password: hashPassword, activationLink },
      select: selectFieldsWithoutPassword
    })
    const profile = await this.profileService.create(user.id, fullName)

    // todo: email service

    return { user, profile }
  }

  findAll(query: FindAllQueryDto) {
    return paginate({
      prisma: this.prisma,
      model: 'user',
      select: selectFieldsWithoutPassword,
      ...query
    })
  }

  findOne(id: number) {
    return this.prisma.user.findFirstOrThrow({
      select: selectFieldsWithoutPassword,
      where: { id }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      select: selectFieldsWithoutPassword,
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
        where: { email }
      })
    const isValidPassword = compareSync(password, passwordFromDb)
    if (!isValidPassword) {
      throw new NotFoundException()
    }

    return userWithoutPassword
  }
}
