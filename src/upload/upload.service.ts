import { Injectable } from '@nestjs/common'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { ProfileService } from '@/profile/profile.service'

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly profileService: ProfileService
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

    return this.profileService.update(userId, { avatarUrl: secure_url })
  }
}
