import { ApiProperty } from '@nestjs/swagger'

export class ConnectPostFileDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
}
