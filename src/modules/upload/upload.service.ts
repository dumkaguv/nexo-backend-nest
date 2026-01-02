import { Injectable } from '@nestjs/common'

import type { CloudinaryService } from '@/modules/cloudinary/cloudinary.service'
import type { FileService } from '@/modules/file/file.service'

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly fileService: FileService
  ) {}

  async upload(file: Express.Multer.File, userId: number, folder?: string) {
    const {
      public_id,
      secure_url,
      resource_type: type
    } = await this.cloudinaryService.uploadFromBuffer(file, userId, folder)

    const { id } = await this.fileService.create(public_id, secure_url, type)

    return { id, secure_url, type }
  }

  async delete(id: number) {
    const { publicId } = await this.fileService.findOne(id)

    await this.fileService.delete(publicId, id)
  }
}
