import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'

import { UserResponseDto } from '@/user/dto/user-response.dto'

export class LoginResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @ApiProperty({ type: 'string' })
  accessToken: string
}
