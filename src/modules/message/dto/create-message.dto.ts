import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength
} from 'class-validator'

export class CreateMessageDto {
  @IsInt()
  @Min(1)
  @ApiProperty({ type: 'integer' })
  receiverId: number

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({ type: 'string', required: false, nullable: true })
  content?: string

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @ApiProperty({
    type: 'integer',
    isArray: true,
    required: false,
    nullable: true
  })
  fileIds?: number[]
}
