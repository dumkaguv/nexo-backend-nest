import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { UserDto } from 'prisma/swagger/models/user.dto'

export class UserWithoutPasswordDto extends PartialType(
  OmitType(UserDto, ['password'] as const)
) {}

export class RegisterResponseDto {
  @ApiProperty({ type: UserWithoutPasswordDto })
  user: UserWithoutPasswordDto

  @ApiProperty({ type: 'string' })
  accessToken: string
}
