import { Injectable } from '@nestjs/common'

import { UpdateProfileDto } from 'prisma/swagger/models/update-profile.dto'

import { PrismaService } from '@/prisma/prisma.service'
import { selectFieldsWithoutPassword } from '@/user/constants'
import { UserService } from '@/user/user.service'

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

  update(userId: number, dto: UpdateProfileDto) {
    return this.prisma.profile.update({
      data: dto,
      where: { userId },
      select: { user: { select: selectFieldsWithoutPassword } }
    })
  }
}
