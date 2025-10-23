import { ApiProperty } from '@nestjs/swagger'

export class CreateTokenDto {
  @ApiProperty({
    type: 'string'
  })
  refreshToken: string
}
