import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseMessageDto } from '@/modules/message/dto'

@Exclude()
export class ResponseConversationMessagesDto {
  @ApiProperty({
    type: () => ResponseMessageDto,
    required: false,
    isArray: true,
    nullable: true
  })
  @Type(() => ResponseMessageDto)
  @Expose()
  messages?: ResponseMessageDto[] | null
}
