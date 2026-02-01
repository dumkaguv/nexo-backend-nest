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

import { FindAllQueryDto } from '@/common/dtos'
import type { AuthRequest } from '@/common/types'
import { sendPaginatedResponse, sendResponse } from '@/common/utils'

import { CreateStoryDto, ResponseStoryDto, UpdateStoryDto } from './dto'
import { StoryService } from './story.service'
import { Authorization } from '../auth/decorators'

@Controller('stories')
@Authorization()
@ApiTags('Stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get()
  @ApiPaginated(ResponseStoryDto)
  public findAll(@Query() query: FindAllQueryDto<ResponseStoryDto>) {
    return sendPaginatedResponse(
      ResponseStoryDto,
      this.storyService.findALl(query)
    )
  }

  @Get('/user/:userId')
  @ApiPaginated(ResponseStoryDto)
  public findAllByUserId(
    @Query() query: FindAllQueryDto<ResponseStoryDto>,
    @Param('userId') userId: string
  ) {
    return sendPaginatedResponse(
      ResponseStoryDto,
      this.storyService.findALlByUserId(+userId, query)
    )
  }

  @Get('/:id')
  @ApiOkResponseWrapped(ResponseStoryDto)
  public findOne(@Param('id') id: string) {
    return sendResponse(ResponseStoryDto, this.storyService.findOne(+id))
  }

  @Post()
  @ApiOkResponseWrapped(ResponseStoryDto)
  public create(@Req() req: AuthRequest, @Body() dto: CreateStoryDto) {
    return sendResponse(
      ResponseStoryDto,
      this.storyService.create(req.user.id, dto)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponseStoryDto)
  public update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateStoryDto
  ) {
    return sendResponse(
      ResponseStoryDto,
      this.storyService.update(+id, req.user.id, dto)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.storyService.remove(req.user.id, +id)
  }
}
