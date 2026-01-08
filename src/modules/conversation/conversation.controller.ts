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
import { plainToInstance } from 'class-transformer'

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'
import { FindAllQueryDto } from '@/common/dtos'
import type { AuthRequest } from '@/common/dtos'

import { sendPaginatedResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { ResponseMessageDto } from '@/modules/message/dto'

import { ResponseUserProfileDto } from '@/modules/user/dto'

import { ConversationService } from './conversation.service'
import { ResponseConversationDto } from './dto'

import { CreateConversationDto } from './dto'

@Controller('conversations')
@Authorization()
@ApiTags('Conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  @ApiPaginated(ResponseConversationDto)
  async findAll(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponseConversationDto>
  ) {
    return sendPaginatedResponse(
      ResponseConversationDto,
      await this.conversationService.findAll(req.user.id, query)
    )
  }

  @Get('suggestions')
  @ApiPaginated(ResponseUserProfileDto)
  async findAllSuggestions(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponseUserProfileDto>
  ) {
    return sendPaginatedResponse(
      ResponseUserProfileDto,
      await this.conversationService.findAllSuggestions(req.user.id, query)
    )
  }

  @Get('user/:userId')
  @ApiOkResponseWrapped(ResponseConversationDto)
  async findOneByUserId(
    @Req() req: AuthRequest,
    @Param('userId') userId: string
  ) {
    return plainToInstance(
      ResponseConversationDto,
      await this.conversationService.findOneByUserId(req.user.id, +userId)
    )
  }

  @Get(':id/messages')
  @ApiPaginated(ResponseMessageDto)
  async findAllConversationMessages(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponseMessageDto>
  ) {
    return sendPaginatedResponse(
      ResponseMessageDto,
      await this.conversationService.findAllConversationMessages(
        req.user.id,
        +id,
        query
      )
    )
  }

  @Get(':id')
  @ApiOkResponseWrapped(ResponseConversationDto)
  async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return plainToInstance(
      ResponseConversationDto,
      await this.conversationService.findOne(req.user.id, +id)
    )
  }

  @Post()
  @ApiOkResponseWrapped(ResponseConversationDto)
  async create(@Req() req: AuthRequest, @Body() dto: CreateConversationDto) {
    return plainToInstance(
      ResponseConversationDto,
      await this.conversationService.create(req.user.id, dto)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.conversationService.remove(req.user.id, +id)
  }
}
