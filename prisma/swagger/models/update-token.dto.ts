import { ApiProperty } from '@nestjs/swagger'

export class UpdateTokenDto {
  @ApiProperty({
    type: 'string',
    required: false
  })
  refreshToken?: string
}
