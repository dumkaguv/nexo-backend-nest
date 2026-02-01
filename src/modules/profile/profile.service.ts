import { Injectable } from '@nestjs/common'

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

  public findOne(userId: number) {
    return this.userService.findOne(userId)
  }

  public async findOneDetailed(userId: number) {
    return { user: await this.userService.findOneWithRelations(userId) }
  }

  public create(userId: number, fullName: string) {
    return this.prisma.profile.create({
      data: { userId, fullName }
    })
  }

  public async update(userId: number, dto: UpdateProfileDto) {
    const { avatar, ...rest } = dto

    let avatarFileId: number | undefined

    if (avatar) {
      const avatarFile = await this.fileService.findOneForUser(avatar, userId)

      avatarFileId = avatarFile.id
    }

    return this.prisma.profile.update({
      data: {
        ...rest,
        ...(avatarFileId ? { avatar: { connect: { id: avatarFileId } } } : {})
      },
      where: { userId }
    })
  }
}
