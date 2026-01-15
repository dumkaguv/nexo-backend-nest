import { Controller } from '@nestjs/common'

import { ApiExcludeController } from '@nestjs/swagger'

@Controller('cloudinary')
@ApiExcludeController()
export class CloudinaryController {}
