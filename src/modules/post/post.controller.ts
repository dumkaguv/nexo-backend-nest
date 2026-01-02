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

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'
import { FindAllQueryDto } from '@/common/dtos'
import { type AuthRequest, EmptyResponseDto } from '@/common/dtos'

import { sendPaginatedResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import {
  ResponsePostCommentDto,
  ResponsePostDto,
  ResponsePostLikeDto
} from './dto'

import { CreatePostCommentDto, CreatePostDto, UpdatePostDto } from './dto'
import { PostService } from './post.service'

@Controller('posts')
@Authorization()
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiPaginated(ResponsePostDto)
  async findAll(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponsePostDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostDto,
      await this.postService.findAll(req.user.id, query)
    )
  }

  @Get(':id/comments')
  @ApiPaginated(ResponsePostCommentDto)
  async findAllComments(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponsePostCommentDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostCommentDto,
      await this.postService.findAllComments(+id, query)
    )
  }

  @Get(':id/likes')
  @ApiPaginated(ResponsePostLikeDto)
  async findAllLikes(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponsePostLikeDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostLikeDto,
      await this.postService.findAllLikes(+id, req.user.id, query)
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

  @Post(':id/comments')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async createComment(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CreatePostCommentDto
  ) {
    return plainToInstance(
      EmptyResponseDto,
      await this.postService.createComment(req.user.id, +id, dto)
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

  @Patch(':id/comments/:commentId')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async updateComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: CreatePostCommentDto
  ) {
    return plainToInstance(
      EmptyResponseDto,
      await this.postService.updateComment(+id, +commentId, dto)
    )
  }

  @Post(':id/likes')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async createLike(@Req() req: AuthRequest, @Param('id') id: string) {
    return plainToInstance(
      EmptyResponseDto,
      await this.postService.createLike(req.user.id, +id)
    )
  }

  @Delete(':id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLike(@Req() req: AuthRequest, @Param('id') id: string) {
    return plainToInstance(
      EmptyResponseDto,
      await this.postService.removeLike(req.user.id, +id)
    )
  }

  @Delete(':id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeComment(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Param('commentId') commentId: string
  ) {
    return plainToInstance(
      EmptyResponseDto,
      await this.postService.removeComment(req.user.id, +id, +commentId)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }
}
