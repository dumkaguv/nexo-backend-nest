import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { ProfileDto } from 'prisma/swagger/models/profile.dto'

import { UserResponseDto } from '@/user/dto/user-response.dto'

export class ProfileResponseDto extends ProfileDto {
  @ApiProperty({ type: () => UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto
}
