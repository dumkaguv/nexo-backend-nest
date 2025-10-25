import { Controller } from '@nestjs/common'

import { ApiExcludeController } from '@nestjs/swagger'

@Controller('file')
@ApiExcludeController()
export class FileController {}
