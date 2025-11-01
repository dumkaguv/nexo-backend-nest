import { ApiProperty } from '@nestjs/swagger'

export class CreateUploadAvatarDto {
  @ApiProperty({
    type: 'string',
    format: 'binary'
  })
  file: Express.Multer.File
}
