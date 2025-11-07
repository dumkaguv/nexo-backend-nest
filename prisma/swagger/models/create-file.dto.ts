import { ApiProperty } from '@nestjs/swagger'

export class CreateFileDto {
  @ApiProperty({
    type: 'string'
  })
  publicId: string
  @ApiProperty({
    type: 'string'
  })
  url: string
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true
  })
  type?: string | null
}
