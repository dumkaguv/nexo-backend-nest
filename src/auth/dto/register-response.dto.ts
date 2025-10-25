import { ApiProperty } from '@nestjs/swagger'

import { UserResponseDto } from '@/user/dto/user-response.dto'

export class RegisterResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto

  @ApiProperty({ type: 'string' })
  accessToken: string
}
