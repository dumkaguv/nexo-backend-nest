import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { UpdatePayloadProfileDto } from './dto/update-payload-profile.dto'

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  findOne(userId: number) {
    return this.userService.findOneWithRelations(userId)
  }

  create(userId: number, fullName: string) {
    return this.prisma.profile.create({
      data: { userId, fullName }
    })
  }

  update(userId: number, dto: UpdatePayloadProfileDto) {
    return this.prisma.profile.update({
      data: dto,
      where: { userId }
    })
  }
}
