import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'

export class UpdateProfileDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  phone?: string | null

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  biography?: string | null

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: 'string' })
  fullName?: string

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer' })
  avatar?: number | null

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: 'string', format: 'date' })
  birthDay?: string | null
}
