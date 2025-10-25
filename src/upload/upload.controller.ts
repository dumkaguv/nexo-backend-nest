import { Controller, Post, Req, UploadedFile } from '@nestjs/common'

import { ApiBody, ApiConsumes } from '@nestjs/swagger'

import { Authorization } from '@/auth/decorators'

import { ApiOkResponseWrapped } from '@/common/decorators'
import type { AuthRequest } from '@/common/dtos'

import { UserResponseDto } from '@/user/dto'

import { FileUpload } from './decorators'
import { UploadAvatarPayload } from './dto/upload-avatar-payload'
import { UploadService } from './upload.service'

@Controller('upload')
@Authorization()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @FileUpload('file')
  @ApiOkResponseWrapped(UserResponseDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarPayload })
  uploadAvatar(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = req.user.id

    return this.uploadService.uploadAvatar(file, userId, 'avatars')
  }
}
