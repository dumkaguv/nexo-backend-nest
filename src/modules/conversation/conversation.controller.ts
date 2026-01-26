import {
  Body,
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
import { FindAllQueryDto } from '@/common/dtos'

import type { AuthRequest } from '@/common/types'
import { sendPaginatedResponse, sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { ResponseMessageDto } from '@/modules/message/dto'

import { ResponseUserProfileDto } from '@/modules/user/dto'

import { ConversationService } from './conversation.service'
import { CreateConversationDto, ResponseConversationDto } from './dto'

@Controller('conversations')
@Authorization()
@ApiTags('Conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  @ApiPaginated(ResponseConversationDto)
  public findAll(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponseConversationDto>
  ) {
    return sendPaginatedResponse(
      ResponseConversationDto,
      this.conversationService.findAll(req.user.id, query)
    )
  }

  @Get('suggestions')
  @ApiPaginated(ResponseUserProfileDto)
  public findAllSuggestions(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponseUserProfileDto>
  ) {
    return sendPaginatedResponse(
      ResponseUserProfileDto,
      this.conversationService.findAllSuggestions(req.user.id, query)
    )
  }

  @Get('user/:userId')
  @ApiOkResponseWrapped(ResponseConversationDto)
  public findOneByUserId(
    @Req() req: AuthRequest,
    @Param('userId') userId: string
  ) {
    return sendResponse(
      ResponseConversationDto,
      this.conversationService.findOneByUserId(req.user.id, +userId)
    )
  }

  @Get(':id/messages')
  @ApiPaginated(ResponseMessageDto)
  public findAllConversationMessages(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponseMessageDto>
  ) {
    return sendPaginatedResponse(
      ResponseMessageDto,
      this.conversationService.findAllConversationMessages(
        req.user.id,
        +id,
        query
      )
    )
  }

  @Get(':id')
  @ApiOkResponseWrapped(ResponseConversationDto)
  public findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      ResponseConversationDto,
      this.conversationService.findOne(req.user.id, +id)
    )
  }

  @Post()
  @ApiOkResponseWrapped(ResponseConversationDto)
  public create(@Req() req: AuthRequest, @Body() dto: CreateConversationDto) {
    return sendResponse(
      ResponseConversationDto,
      this.conversationService.create(req.user.id, dto)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.conversationService.remove(req.user.id, +id)
  }
}
