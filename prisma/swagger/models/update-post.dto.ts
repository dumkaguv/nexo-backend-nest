import { ApiProperty } from '@nestjs/swagger'

export class UpdatePostDto {
  @ApiProperty({
    type: 'string',
    required: false
  })
  content?: string
}
