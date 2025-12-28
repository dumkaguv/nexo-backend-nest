import { Module } from '@nestjs/common'

import { TokenModule } from '@/modules/token/token.module'
import { UserModule } from '@/modules/user/user.module'

import { MessageController } from './message.controller'
import { MessageGateway } from './message.gateway'
import { MessageService } from './message.service'

@Module({
  imports: [TokenModule, UserModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService]
})
export class MessageModule {}
