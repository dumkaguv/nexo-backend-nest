import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

import { ResponsePostLikeDto } from '../dto'
import { PostLikesService } from '../services/post-likes.service'

@Controller('posts')
@Authorization()
@ApiTags('Posts')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Get(':id/likes')
  @ApiPaginated(ResponsePostLikeDto)
  public findAllLikes(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponsePostLikeDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostLikeDto,
      this.postLikesService.findAllLikes(+id, req.user.id, query)
    )
  }

  @Post(':id/likes')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public createLike(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      EmptyResponseDto,
      this.postLikesService.createLike(req.user.id, +id)
    )
  }

  @Delete(':id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeLike(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      EmptyResponseDto,
      this.postLikesService.removeLike(req.user.id, +id)
    )
  }
}
