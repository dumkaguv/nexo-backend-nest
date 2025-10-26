import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdatePayloadProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  biography?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  birthDay?: string
}
