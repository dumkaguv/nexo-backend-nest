import { ApiProperty } from '@nestjs/swagger'

export class ConnectFileDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
}
