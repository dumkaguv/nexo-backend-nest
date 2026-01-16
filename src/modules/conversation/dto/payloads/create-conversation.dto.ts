import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class CreateConversationDto {
  @IsInt()
  @Min(1)
  @ApiProperty({ type: 'integer' })
  receiverId: number
}
