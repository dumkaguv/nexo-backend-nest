import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { selectFieldsWithoutPassword } from '@/user/constants'

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(userId: number) {
    return this.prisma.profile.findFirstOrThrow({
      include: { user: { select: selectFieldsWithoutPassword } },
      where: { userId }
    })
  }

  create(userId: number, fullName: string) {
    return this.prisma.profile.create({
      data: { userId, fullName }
    })
  }
}
