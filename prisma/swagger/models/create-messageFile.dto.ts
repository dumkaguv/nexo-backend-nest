import { ApiProperty } from '@nestjs/swagger'

export class CreateMessageFileDto {
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
