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
  Req
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { ApiOkResponseWrapped } from '@/common/decorators'
import type { AuthRequest } from '@/common/dtos'
import { sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { CreateMessageDto, ResponseMessageDto, UpdateMessageDto } from './dto'

import { MessageService } from './message.service'

@Controller('messages')
@Authorization()
@ApiTags('Messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  @ApiOkResponseWrapped(ResponseMessageDto)
  public findOne(@Param('id') id: string) {
    return sendResponse(ResponseMessageDto, this.messageService.findOne(+id))
  }

  @Post()
  @ApiOkResponseWrapped(ResponseMessageDto)
  public create(@Req() req: AuthRequest, @Body() dto: CreateMessageDto) {
    return sendResponse(
      ResponseMessageDto,
      this.messageService.create(req.user.id, dto)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponseMessageDto)
  public update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto
  ) {
    return sendResponse(
      ResponseMessageDto,
      this.messageService.update(req.user.id, +id, dto)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.messageService.delete(req.user.id, +id)
  }
}
