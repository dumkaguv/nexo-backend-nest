import { ApiProperty } from '@nestjs/swagger'

export class RefreshResponseDto {
  @ApiProperty({ type: 'string' })
  accessToken: string
}
