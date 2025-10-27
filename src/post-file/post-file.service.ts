import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { CreatePostFileDto, UpdatePostFileDto } from './dto'

@Injectable()
export class PostFileService {
  constructor(private readonly prisma: PrismaService) {}

  create(postId: number, dto: CreatePostFileDto) {
    return this.prisma.postFile.create({ data: { postId, ...dto } })
  }

  findAll() {
    return this.prisma.postFile.findMany()
  }

  findOne(id: number) {
    return this.prisma.postFile.findUniqueOrThrow({ where: { id } })
  }

  update(id: number, dto: UpdatePostFileDto) {
    return this.prisma.postFile.update({ data: dto, where: { id } })
  }

  remove(id: number) {
    return this.prisma.postFile.delete({ where: { id } })
  }
}
