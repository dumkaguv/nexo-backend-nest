import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ type: 'string' })
  content: string
}
