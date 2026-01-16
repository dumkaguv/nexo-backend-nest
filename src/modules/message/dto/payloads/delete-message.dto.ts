import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class DeleteMessageDto {
  @IsInt()
  @Min(1)
  @ApiProperty({ type: 'integer' })
  id: number
}
