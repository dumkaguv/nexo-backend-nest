import { PartialType } from '@nestjs/swagger'

import { CreatePostDto } from './'

export class UpdatePostDto extends PartialType(CreatePostDto) {}
