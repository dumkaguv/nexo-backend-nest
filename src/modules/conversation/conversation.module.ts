import { Module } from '@nestjs/common'

import { MessageModule } from '@/modules/message/message.module'

import { ConversationController } from './conversation.controller'
import { ConversationService } from './conversation.service'

@Module({
  imports: [MessageModule],
  controllers: [ConversationController],
  providers: [ConversationService]
})
export class ConversationModule {}
