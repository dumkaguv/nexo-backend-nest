import { Module } from '@nestjs/common'

import { FileModule } from '@/modules/file/file.module'
import { UserModule } from '@/modules/user/user.module'

import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [UserModule, FileModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
