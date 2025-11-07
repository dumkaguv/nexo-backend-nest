import { Module } from '@nestjs/common'

import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module'

import { FileModule } from '@/modules/file/file.module'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  imports: [CloudinaryModule, FileModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
