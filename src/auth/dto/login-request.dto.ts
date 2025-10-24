import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength } from 'class-validator'

export class LoginRequestDto {
  @IsString()
  @IsEmail()
  @MaxLength(100)
  @ApiProperty({ type: 'string' })
  email: string

  @IsString()
  @ApiProperty({ type: 'string' })
  password: string
}
