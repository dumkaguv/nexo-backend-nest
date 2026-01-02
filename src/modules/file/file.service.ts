import { Injectable } from '@nestjs/common'

import type { CloudinaryService } from '@/modules/cloudinary/cloudinary.service'
import type { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(publicId: string, url: string, mimeType: string) {
    return await this.prisma.file.create({
      data: { publicId, url, type: mimeType }
    })
  }

  async delete(publicId: string, id: number) {
    await this.prisma.file.delete({ where: { id } })
    await this.cloudinaryService.delete(publicId)
  }

  async findOne(id: number) {
    return await this.prisma.file.findFirstOrThrow({ where: { id } })
  }
}
