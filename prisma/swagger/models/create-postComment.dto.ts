import { ApiProperty } from '@nestjs/swagger'

export class CreatePostCommentDto {
  @ApiProperty({
    type: 'string'
  })
  content: string
}
