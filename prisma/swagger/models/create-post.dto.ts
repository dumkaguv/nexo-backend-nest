import { ApiProperty } from '@nestjs/swagger'

export class CreatePostDto {
  @ApiProperty({
    type: 'string'
  })
  content: string
}
