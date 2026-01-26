import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'
import { FindAllQueryDto } from '@/common/dtos'
import type { AuthRequest } from '@/common/types'

import { sendPaginatedResponse, sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { CreatePostDto, ResponsePostDto, UpdatePostDto } from '../dto'
import { PostsService } from '../services/posts.service'

@Controller('posts')
@Authorization()
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiPaginated(ResponsePostDto)
  public findAll(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponsePostDto>
  ) {
    return sendPaginatedResponse(
      ResponsePostDto,
      this.postsService.findAll(req.user.id, query)
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
      this.postsService.findAllMy(req.user.id, query)
    )
  }

  @Get(':id')
  @ApiOkResponseWrapped(ResponsePostDto)
  public findOne(@Param('id') id: string) {
    return sendResponse(ResponsePostDto, this.postsService.findOne(+id))
  }

  @Post()
  @ApiOkResponseWrapped(ResponsePostDto)
  public create(@Req() req: AuthRequest, @Body() dto: CreatePostDto) {
    return sendResponse(
      ResponsePostDto,
      this.postsService.create(req.user.id, dto)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponsePostDto)
  public update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return sendResponse(ResponsePostDto, this.postsService.update(+id, dto))
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }
}
