import { Module } from '@nestjs/common'

import { FileModule } from '@/modules/file/file.module'
import { UserModule } from '@/modules/user/user.module'

import { PostCommentsController } from './controllers/post-comments.controller'
import { PostLikesController } from './controllers/post-likes.controller'
import { PostsController } from './controllers/posts.controller'
import { PostCommentsService } from './services/post-comments.service'
import { PostLikesService } from './services/post-likes.service'
import { PostsService } from './services/posts.service'

@Module({
  imports: [UserModule, FileModule],
  controllers: [PostsController, PostCommentsController, PostLikesController],
  providers: [PostsService, PostCommentsService, PostLikesService]
})
export class PostModule {}
