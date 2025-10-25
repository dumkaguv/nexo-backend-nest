import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ProfileDto } from 'prisma/swagger/models/profile.dto'
import { UserDto } from 'prisma/swagger/models/user.dto'

export class UserResponseDto extends OmitType(UserDto, ['password'] as const) {
  @ApiProperty({ type: () => ProfileDto })
  @Type(() => ProfileDto)
  profile: ProfileDto
}
