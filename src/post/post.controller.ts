import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { CreatePostDto } from 'prisma/swagger/models/create-post.dto'
import { PostDto } from 'prisma/swagger/models/post.dto'
import { Post as PostEntity } from 'prisma/swagger/models/post.entity'

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'

import { UpdatePostDto } from './dto/update-post.dto'
import { PostService } from './post.service'

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOkResponseWrapped(PostDto)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto)
  }

  @Get()
  @ApiPaginated(PostEntity)
  findAll() {
    return this.postService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }
}
