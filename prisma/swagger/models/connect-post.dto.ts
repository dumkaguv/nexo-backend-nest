import { ApiProperty } from '@nestjs/swagger'

export class ConnectPostDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
}
