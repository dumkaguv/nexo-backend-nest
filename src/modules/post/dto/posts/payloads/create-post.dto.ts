import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, MinLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ type: 'string' })
  content: string

  @IsArray()
  @ApiProperty({ type: 'integer', isArray: true })
  files?: number[]
}
