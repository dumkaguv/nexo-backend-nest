import { ApiProperty } from '@nestjs/swagger'

export class UpdatePostCommentDto {
  @ApiProperty({
    type: 'string',
    required: false
  })
  content?: string
}
