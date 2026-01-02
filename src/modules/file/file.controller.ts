import { Controller } from '@nestjs/common'

import { ApiExcludeController } from '@nestjs/swagger'

import { FileService } from './file.service'

@Controller('file')
@ApiExcludeController()
export class FileController {
  constructor(private readonly fileService: FileService) {}
}
