import { Injectable } from '@nestjs/common'

import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  public create(publicId: string, url: string, mimeType: string) {
    return this.prisma.file.create({
      data: { publicId, url, type: mimeType }
    })
  }

  public async delete(publicId: string, id: number) {
    await this.prisma.file.delete({ where: { id } })
    await this.cloudinaryService.delete(publicId)
  }

  public findOne(id: number) {
    return this.prisma.file.findFirstOrThrow({ where: { id } })
  }
}
