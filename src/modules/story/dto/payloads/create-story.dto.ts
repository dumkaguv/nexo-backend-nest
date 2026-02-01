import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class CreateStoryDto {
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  previewUrl?: string | null

  @IsArray()
  @ApiProperty({ type: 'integer', isArray: true })
  files: number[]
}
