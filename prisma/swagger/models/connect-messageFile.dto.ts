import { ApiProperty } from '@nestjs/swagger'

export class ConnectMessageFileDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
}
