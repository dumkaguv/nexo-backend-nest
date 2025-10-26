import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { UpdatePostDto } from 'prisma/swagger/models/update-post.dto'

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'
import { type AuthRequest, FindAllQueryDto } from '@/common/dtos'

import { CreatePayloadPostDto, PostResponseDto } from './dto'
import { PostService } from './post.service'

@Controller('posts')
@Authorization()
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiPaginated(PostResponseDto)
  findAll(@Query() query: FindAllQueryDto<PostResponseDto>) {
    return this.postService.findAll(query)
  }

  @Get(':id')
  @ApiOkResponseWrapped(PostResponseDto)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @Post()
  @ApiOkResponseWrapped(PostResponseDto)
  create(@Req() req: AuthRequest, @Body() dto: CreatePayloadPostDto) {
    const userId = req.user.id

    return this.postService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOkResponseWrapped(PostResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(+id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }
}
