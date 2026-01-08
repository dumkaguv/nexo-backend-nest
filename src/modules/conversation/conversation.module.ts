import { Module } from '@nestjs/common'

import { MessageModule } from '@/modules/message/message.module'
import { TokenModule } from '@/modules/token/token.module'

import { ConversationController } from './conversation.controller'
import { ConversationGateway } from './conversation.gateway'
import { ConversationService } from './conversation.service'

@Module({
  imports: [MessageModule, TokenModule],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway]
})
export class ConversationModule {}
