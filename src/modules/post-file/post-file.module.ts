import { Module } from '@nestjs/common'

import { PostFileController } from './post-file.controller'
import { PostFileService } from './post-file.service'

@Module({
  controllers: [PostFileController],
  providers: [PostFileService],
  exports: [PostFileService]
})
export class PostFileModule {}
