import { ApiProperty } from '@nestjs/swagger'

export class ConnectTokenDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false
  })
  id?: number
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false
  })
  userId?: number
}
