import { ApiProperty } from '@nestjs/swagger'

export class ConnectMessageDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
}
