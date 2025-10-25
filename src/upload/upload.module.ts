import { Module } from '@nestjs/common'

import { CloudinaryModule } from '@/cloudinary/cloudinary.module'

import { ProfileModule } from '@/profile/profile.module'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  imports: [CloudinaryModule, ProfileModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
