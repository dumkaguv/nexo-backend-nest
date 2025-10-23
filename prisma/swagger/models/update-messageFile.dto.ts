import { ApiProperty } from '@nestjs/swagger'

export class UpdateMessageFileDto {
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
