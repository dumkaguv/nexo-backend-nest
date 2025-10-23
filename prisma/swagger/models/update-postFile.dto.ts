import { ApiProperty } from '@nestjs/swagger'

export class UpdatePostFileDto {
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
