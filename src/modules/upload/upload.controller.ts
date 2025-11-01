import { Controller, Post, Req, UploadedFile } from '@nestjs/common'

import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'

import { ApiOkResponseWrapped } from '@/common/decorators'
import type { AuthRequest } from '@/common/dtos'
import { Authorization } from '@/modules/auth/decorators'

import { FileUpload } from './decorators'
import { CreateUploadAvatarDto, ResponseUploadAvatarDto } from './dto'
import { UploadService } from './upload.service'

@Controller('upload')
@Authorization()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @FileUpload('file')
  @ApiOkResponseWrapped(ResponseUploadAvatarDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUploadAvatarDto })
  async uploadAvatar(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File
  ) {
    return plainToInstance(
      ResponseUploadAvatarDto,
      await this.uploadService.uploadAvatar(file, req.user.id, 'avatars')
    )
  }
}
