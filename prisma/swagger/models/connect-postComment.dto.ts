import { ApiProperty } from '@nestjs/swagger'

export class ConnectPostCommentDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  id: number
}
