import { Injectable, NotFoundException } from '@nestjs/common'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import {
  CreateStoryDto,
  ResponseStoryDto,
  ResponseStoryViewerDto,
  UpdateStoryDto
} from './dto'

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  public findAll(userId: number, query: FindAllQueryDto<ResponseStoryDto>) {
    return paginate({
      prisma: this.prisma,
      model: 'story',
      ...this.getIncludes(),
      ...query,
      computedBatch: (records, { context }) =>
        this.buildViewMeta(records, context.userId),
      context: { userId }
    })
  }

  public findAllByUserId(
    ownerId: number,
    userId: number,
    query: FindAllQueryDto<ResponseStoryDto>
  ) {
    return paginate({
      prisma: this.prisma,
      model: 'story',
      where: { userId: ownerId },
      ...query,
      ...this.getIncludes(),
      computedBatch: (records, { context }) =>
        this.buildViewMeta(records, context.userId),
      context: { userId }
    })
  }

  public findAllViewers(
    storyId: number,
    query: FindAllQueryDto<ResponseStoryViewerDto>
  ) {
    return paginate({
      prisma: this.prisma,
      model: 'storyView',
      where: { storyId },
      include: {
        user: { include: { profile: { include: { avatar: true } } } }
      },
      ...query,
      ordering: query.ordering ? query.ordering : '-createdAt'
    })
  }

  public async findOne(id: number, userId: number) {
    const story = await this.prisma.story.findFirstOrThrow({
      where: { id },
      ...this.getIncludes()
    })

    if (story.userId !== userId) {
      await this.prisma.storyView.upsert({
        where: { storyId_userId: { storyId: id, userId } },
        update: {},
        create: { storyId: id, userId }
      })
    }

    return {
      ...story,
      isViewed: await this.isStoryViewedByUser(id, userId)
    }
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

  private async buildViewMeta(records: { id: number }[], userId: number) {
    if (records.length === 0) {
      return []
    }

    const viewedStoryIds = await this.getViewedStoryIds(
      records.map((record) => record.id),
      userId
    )

    return records.map((record) => ({
      isViewed: viewedStoryIds.has(record.id)
    }))
  }

  private async getViewedStoryIds(storyIds: number[], userId: number) {
    if (storyIds.length === 0) {
      return new Set<number>()
    }

    const views = await this.prisma.storyView.findMany({
      where: { storyId: { in: storyIds }, userId },
      select: { storyId: true }
    })

    return new Set(views.map((view) => view.storyId))
  }

  private async isStoryViewedByUser(storyId: number, userId: number) {
    const viewedStoryIds = await this.getViewedStoryIds([storyId], userId)

    return viewedStoryIds.has(storyId)
  }

  private connectFiles(files?: number[]) {
    return {
      ...(files?.length && {
        files: { connect: files.map((id) => ({ id })) }
      })
    }
  }
}
