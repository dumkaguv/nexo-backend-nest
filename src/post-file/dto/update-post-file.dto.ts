import { PartialType } from '@nestjs/swagger'

import { CreatePostFileDto } from './create-post-file.dto'

export class UpdatePostFileDto extends PartialType(CreatePostFileDto) {}
