import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'

import { IsInt, Min } from 'class-validator'

import { CreateMessageDto } from './create-message.dto'

export class UpdateMessageDto extends PartialType(
  OmitType(CreateMessageDto, ['receiverId', 'conversationId'])
) {
  @IsInt()
  @Min(1)
  @ApiProperty({ type: 'integer' })
  id: number
}
