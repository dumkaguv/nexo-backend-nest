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

import { ApiOkResponseWrapped } from '@/common/decorators'
import type { AuthRequest } from '@/common/types'
import { sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { FileUpload } from './decorators'
import { CreateUploadDto, ResponseUploadDto } from './dto'

import { UploadService } from './upload.service'

@Controller('upload')
@Authorization()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @FileUpload('file')
  @ApiOkResponseWrapped(ResponseUploadDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUploadDto })
  public upload(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateUploadDto
  ) {
    return sendResponse(
      ResponseUploadDto,
      this.uploadService.upload(file, req.user.id, dto.folder)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.uploadService.delete(req.user.id, +id)
  }
}
