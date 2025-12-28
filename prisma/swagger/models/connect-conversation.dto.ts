import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

export class ConversationSenderIdReceiverIdUniqueInputDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  senderId: number
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  receiverId: number
}

@ApiExtraModels(ConversationSenderIdReceiverIdUniqueInputDto)
export class ConnectConversationDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false
  })
  id?: number
  @ApiProperty({
    type: ConversationSenderIdReceiverIdUniqueInputDto,
    required: false
  })
  senderId_receiverId?: ConversationSenderIdReceiverIdUniqueInputDto
}
