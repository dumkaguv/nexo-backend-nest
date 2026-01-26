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
import { EmptyResponseDto, FindAllQueryDto } from '@/common/dtos'

import type { AuthRequest } from '@/common/types'
import { sendPaginatedResponse, sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { CreatePostCommentDto, ResponsePostCommentDto } from '../dto'
import { PostCommentsService } from '../services/post-comments.service'

@Controller('posts')
@Authorization()
@ApiTags('Posts')
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Get(':id/comments')
  @ApiPaginated(ResponsePostCommentDto)
  public findAllComments(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponsePostCommentDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostCommentDto,
      this.postCommentsService.findAllComments(+id, query)
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
      this.postCommentsService.createComment(req.user.id, +id, dto)
    )
  }

  @Patch(':id/comments/:commentId')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public updateComment(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: CreatePostCommentDto
  ) {
    return sendResponse(
      EmptyResponseDto,
      this.postCommentsService.updateComment(req.user.id, +id, +commentId, dto)
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
      this.postCommentsService.removeComment(req.user.id, +id, +commentId)
    )
  }
}
