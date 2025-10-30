import { Injectable } from '@nestjs/common'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { ProfileService } from '@/profile/profile.service'
import { UserService } from '@/user/user.service'

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly profileService: ProfileService,
    private readonly userService: UserService
  ) {}

  async uploadAvatar(
    file: Express.Multer.File,
    userId: number,
    folder?: string
  ) {
    const { secure_url } = await this.cloudinaryService.uploadFromBuffer(
      file,
      userId,
      folder
    )
    await this.profileService.update(userId, { avatarUrl: secure_url })

    return { user: await this.userService.findOneWithRelations(userId) }
  }
}
