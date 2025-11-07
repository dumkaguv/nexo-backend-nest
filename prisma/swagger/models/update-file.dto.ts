import { ApiProperty } from '@nestjs/swagger'

export class UpdateFileDto {
  @ApiProperty({
    type: 'string',
    required: false
  })
  publicId?: string
  @ApiProperty({
    type: 'string',
    required: false
  })
  url?: string
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true
  })
  type?: string | null
}
