import { Injectable } from '@nestjs/common'

import { CreatePostDto } from 'prisma/swagger/models/create-post.dto'

import { UpdatePostDto } from 'prisma/swagger/models/update-post.dto'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { selectFieldsWithoutPassword } from '@/user/constants'

import { PostResponseDto } from './dto'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: FindAllQueryDto<PostResponseDto>) {
    return paginate({
      prisma: this.prisma,
      model: 'post',
      include: {
        user: { select: selectFieldsWithoutPassword },
        files: true,
        likes: true,
        comments: true
      },
      ...query
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
    return this.prisma.post.delete({
      where: { id }
    })
  }
}
