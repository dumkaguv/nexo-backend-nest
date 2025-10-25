import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'

import { imageAndVideoFileFilter } from '../config'

export function FileUpload(fieldName: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: memoryStorage(),
        limits: { fileSize: 100 * 1024 * 1024 },
        fileFilter: imageAndVideoFileFilter
      })
    )
  )
}
