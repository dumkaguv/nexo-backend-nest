import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateChangePasswordDto {
  @IsString()
  @ApiProperty({ type: 'string' })
  oldPassword: string

  @IsString()
  @ApiProperty({ type: 'string' })
  newPassword: string
}
