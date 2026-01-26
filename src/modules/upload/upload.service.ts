import { Injectable } from '@nestjs/common'

import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service'
import { FileService } from '@/modules/file/file.service'

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly fileService: FileService
  ) {}

  public async upload(
    file: Express.Multer.File,
    userId: number,
    folder?: string
  ) {
    const {
      public_id,
      secure_url,
      resource_type: type
    } = await this.cloudinaryService.uploadFromBuffer(file, userId, folder)

    const { id } = await this.fileService.create(
      public_id,
      secure_url,
      type,
      userId
    )

    return { id, secure_url, type }
  }

  public async delete(userId: number, id: number) {
    const { publicId } = await this.fileService.findOneForUser(id, userId)

    await this.fileService.delete(publicId, id)
  }
}
