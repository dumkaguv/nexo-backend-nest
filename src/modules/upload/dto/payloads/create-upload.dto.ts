import { ApiProperty } from '@nestjs/swagger'

export class CreateUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File

  @ApiProperty({ type: 'string', required: false, nullable: true })
  folder?: string
}
