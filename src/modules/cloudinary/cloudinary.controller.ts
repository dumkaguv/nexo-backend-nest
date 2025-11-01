import { Controller } from '@nestjs/common'

import { ApiExcludeController } from '@nestjs/swagger'

import { CloudinaryService } from './cloudinary.service'

@Controller('cloudinary')
@ApiExcludeController()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
}
