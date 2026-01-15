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

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'
import {
  type AuthRequest,
  EmptyResponseDto,
  FindAllQueryDto
} from '@/common/dtos'

import { sendPaginatedResponse, sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import {
  CreatePostCommentDto,
  CreatePostDto,
  ResponsePostCommentDto,
  ResponsePostDto,
  ResponsePostLikeDto,
  UpdatePostDto
} from './dto'

import { PostService } from './post.service'

@Controller('posts')
@Authorization()
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiPaginated(ResponsePostDto)
  public findAll(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponsePostDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostDto,
      this.postService.findAll(req.user.id, query)
    )
  }

  @Get('my')
  @ApiPaginated(ResponsePostDto)
  public findAllMy(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponsePostDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostDto,
      this.postService.findAllMy(req.user.id, query)
    )
  }

  @Get(':id/comments')
  @ApiPaginated(ResponsePostCommentDto)
  public findAllComments(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponsePostCommentDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostCommentDto,
      this.postService.findAllComments(+id, query)
    )
  }

  @Get(':id/likes')
  @ApiPaginated(ResponsePostLikeDto)
  public findAllLikes(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponsePostLikeDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostLikeDto,
      this.postService.findAllLikes(+id, req.user.id, query)
    )
  }

  @Get(':id')
  @ApiOkResponseWrapped(ResponsePostDto)
  public findOne(@Param('id') id: string) {
    return sendResponse(ResponsePostDto, this.postService.findOne(+id))
  }

  @Post()
  @ApiOkResponseWrapped(ResponsePostDto)
  public create(@Req() req: AuthRequest, @Body() dto: CreatePostDto) {
    return sendResponse(
      ResponsePostDto,
      this.postService.create(req.user.id, dto)
    )
  }

  @Post(':id/comments')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public createComment(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CreatePostCommentDto
  ) {
    return sendResponse(
      EmptyResponseDto,
      this.postService.createComment(req.user.id, +id, dto)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponsePostDto)
  public update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return sendResponse(ResponsePostDto, this.postService.update(+id, dto))
  }

  @Patch(':id/comments/:commentId')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public updateComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: CreatePostCommentDto
  ) {
    return sendResponse(
      EmptyResponseDto,
      this.postService.updateComment(+id, +commentId, dto)
    )
  }

  @Post(':id/likes')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public createLike(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      EmptyResponseDto,
      this.postService.createLike(req.user.id, +id)
    )
  }

  @Delete(':id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeLike(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      EmptyResponseDto,
      this.postService.removeLike(req.user.id, +id)
    )
  }

  @Delete(':id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeComment(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Param('commentId') commentId: string
  ) {
    return sendResponse(
      EmptyResponseDto,
      this.postService.removeComment(req.user.id, +id, +commentId)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }
}
