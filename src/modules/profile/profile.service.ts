import { Injectable } from '@nestjs/common'

import { connectOrDisconnect } from '@/common/utils'
import { FileService } from '@/modules/file/file.service'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { UpdateProfileDto } from './dto'

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  findOne(userId: number) {
    return this.userService.findOne(userId)
  }

  async findOneDetailed(userId: number) {
    return { user: await this.userService.findOneWithRelations(userId) }
  }

  create(userId: number, fullName: string) {
    return this.prisma.profile.create({
      data: { userId, fullName }
    })
  }

  async update(userId: number, dto: UpdateProfileDto) {
    const { avatar, ...rest } = dto

    let avatarFileId: number | undefined

    if (avatar) {
      const avatarFile = await this.fileService.findOne(avatar)

      avatarFileId = avatarFile.id
    }

    return await this.prisma.profile.update({
      data: { ...rest, avatar: connectOrDisconnect(avatarFileId) },
      where: { userId }
    })
  }
}
