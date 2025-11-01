import { Module } from '@nestjs/common'

import { MessageFileController } from './message-file.controller'
import { MessageFileService } from './message-file.service'

@Module({
  controllers: [MessageFileController],
  providers: [MessageFileService]
})
export class MessageFileModule {}
