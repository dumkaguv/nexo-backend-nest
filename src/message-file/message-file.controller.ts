import { Controller } from '@nestjs/common'

import { MessageFileService } from './message-file.service'

@Controller('message-file')
export class MessageFileController {
  constructor(private readonly messageFileService: MessageFileService) {}
}
