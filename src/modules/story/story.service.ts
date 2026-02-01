import { Injectable, NotFoundException } from '@nestjs/common'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateStoryDto, ResponseStoryDto, UpdateStoryDto } from './dto'

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  public findALl(query: FindAllQueryDto<ResponseStoryDto>) {
    return paginate({
      prisma: this.prisma,
      model: 'story',
      ...query,
      include: {
        user: { include: { profile: { include: { avatar: true } } } },
        files: true
      }
    })
  }

  public findALlByUserId(
    userId: number,
    query: FindAllQueryDto<ResponseStoryDto>
  ) {
    return paginate({
      prisma: this.prisma,
      model: 'story',
      where: { userId },
      ...query,
      ...this.getIncludes()
    })
  }

  public findOne(id: number) {
    return this.prisma.story.findFirstOrThrow({
      where: { id },
      ...this.getIncludes()
    })
  }

  public create(userId: number, dto: CreateStoryDto) {
    const { files, ...rest } = dto

    return this.prisma.story.create({
      data: {
        userId,
        ...rest,
        ...this.connectFiles(files)
      },
      ...this.getIncludes()
    })
  }

  public async update(id: number, userId: number, dto: UpdateStoryDto) {
    const { files, ...rest } = dto

    const existing = await this.prisma.story.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      throw new NotFoundException('Story not found')
    }

    return this.prisma.story.update({
      where: { id, userId },
      data: {
        ...rest,
        ...this.connectFiles(files)
      },
      ...this.getIncludes()
    })
  }

  public async remove(id: number, userId: number) {
    const story = await this.prisma.story.findFirst({ where: { id, userId } })

    if (!story) {
      throw new NotFoundException()
    }

    return this.prisma.story.delete({ where: { id } })
  }

  private getIncludes() {
    return {
      include: {
        user: { include: { profile: { include: { avatar: true } } } },
        files: true
      }
    }
  }

  private connectFiles(files?: number[]) {
    return {
      ...(files?.length && {
        files: { connect: files.map((id) => ({ id })) }
      })
    }
  }
}
