import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile
} from '@nestjs/common'

import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'

import { ApiOkResponseWrapped } from '@/common/decorators'
import type { AuthRequest } from '@/common/dtos'
import { Authorization } from '@/modules/auth/decorators'

import { FileUpload } from './decorators'
import { CreateUploadDto, ResponseUploadDto } from './dto'

import type { UploadService } from './upload.service'

@Controller('upload')
@Authorization()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @FileUpload('file')
  @ApiOkResponseWrapped(ResponseUploadDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUploadDto })
  async upload(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateUploadDto
  ) {
    return plainToInstance(
      ResponseUploadDto,
      await this.uploadService.upload(file, req.user.id, dto.folder)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return await this.uploadService.delete(+id)
  }
}
