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
import { plainToInstance } from 'class-transformer'

import { UpdatePostDto } from 'prisma/swagger/models/update-post.dto'

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'
import { type AuthRequest, FindAllQueryDto } from '@/common/dtos'

import { CreatePostDto, ResponsePostDto } from './dto'
import { PostService } from './post.service'

@Controller('posts')
@Authorization()
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiPaginated(ResponsePostDto)
  async findAll(@Query() query: FindAllQueryDto<ResponsePostDto>) {
    return plainToInstance(
      ResponsePostDto,
      (await this.postService.findAll(query)).data
    )
  }

  @Get(':id')
  @ApiOkResponseWrapped(ResponsePostDto)
  async findOne(@Param('id') id: string) {
    return plainToInstance(ResponsePostDto, await this.postService.findOne(+id))
  }

  @Post()
  @ApiOkResponseWrapped(ResponsePostDto)
  async create(@Req() req: AuthRequest, @Body() dto: CreatePostDto) {
    return plainToInstance(
      ResponsePostDto,
      await this.postService.create(req.user.id, dto)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponsePostDto)
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return plainToInstance(
      ResponsePostDto,
      await this.postService.update(+id, dto)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }
}
