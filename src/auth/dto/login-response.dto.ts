import { ApiProperty } from '@nestjs/swagger'

import { UserWithoutPasswordDto } from './register-response.dto'

export class LoginResponseDto {
  user: UserWithoutPasswordDto

  @ApiProperty({ type: 'string' })
  accessToken: string
}
