import { Injectable } from '@nestjs/common'

import { UpdatePostDto } from 'prisma/swagger/models/update-post.dto'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { CreatePostDto, ResponsePostDto } from './dto'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: FindAllQueryDto<ResponsePostDto>) {
    return paginate({
      prisma: this.prisma,
      model: 'post',
      include: {
        user: true,
        files: true,
        likes: true,
        comments: true
      },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt'
    })
  }

  findOne(id: number) {
    return this.prisma.post.findFirstOrThrow({
      where: { id }
    })
  }

  create(userId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: { userId, ...dto }
    })
  }

  update(id: number, dto: UpdatePostDto) {
    return this.prisma.post.update({
      data: dto,
      where: { id }
    })
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } })
  }
}
