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
import { plainToInstance } from 'class-transformer'

import { ApiOkResponseWrapped } from '@/common/decorators'
import type { AuthRequest } from '@/common/dtos'
import { Authorization } from '@/modules/auth/decorators'

import { ResponseMessageDto } from './dto'

import { CreateMessageDto, UpdateMessageDto } from './dto'
import { MessageService } from './message.service'

@Controller('messages')
@Authorization()
@ApiTags('Messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  @ApiOkResponseWrapped(ResponseMessageDto)
  async findOne(@Param('id') id: string) {
    return plainToInstance(
      ResponseMessageDto,
      await this.messageService.findOne(+id)
    )
  }

  @Post()
  @ApiOkResponseWrapped(ResponseMessageDto)
  async create(@Req() req: AuthRequest, @Body() dto: CreateMessageDto) {
    return plainToInstance(
      ResponseMessageDto,
      await this.messageService.create(req.user.id, dto)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponseMessageDto)
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto
  ) {
    return plainToInstance(
      ResponseMessageDto,
      await this.messageService.update(req.user.id, +id, dto)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.messageService.delete(req.user.id, +id)
  }
}
