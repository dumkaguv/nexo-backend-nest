import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreatePostCommentDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ type: 'string' })
  content: string
}
