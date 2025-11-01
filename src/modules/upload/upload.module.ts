import { Module } from '@nestjs/common'

import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module'

import { ProfileModule } from '@/modules/profile/profile.module'

import { UserModule } from '@/modules/user/user.module'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  imports: [CloudinaryModule, ProfileModule, UserModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
