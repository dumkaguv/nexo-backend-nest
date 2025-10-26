import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
  @ApiProperty({ type: 'string' })
  oldPassword: string

  @ApiProperty({ type: 'string' })
  newPassword: string
}
