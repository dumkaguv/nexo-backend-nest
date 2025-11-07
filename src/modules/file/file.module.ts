import { Module } from '@nestjs/common'

import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module'

import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  imports: [CloudinaryModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
