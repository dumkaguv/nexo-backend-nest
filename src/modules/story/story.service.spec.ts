import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { FindAllQueryDto } from '@/common/dtos'
import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateStoryDto, ResponseStoryDto, UpdateStoryDto } from './dto'
import { StoryService } from './story.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn()
}))

describe('StoryService', () => {
  let service: StoryService
  let prisma: {
    story: {
      findFirst: jest.Mock
      findFirstOrThrow: jest.Mock
      create: jest.Mock
      update: jest.Mock
      delete: jest.Mock
    }
    storyView: {
      findMany: jest.Mock
      upsert: jest.Mock
    }
  }

  beforeEach(async () => {
    prisma = {
      story: {
        findFirst: jest.fn(),
        findFirstOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      storyView: {
        findMany: jest.fn(),
        upsert: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [StoryService, { provide: PrismaService, useValue: prisma }]
    }).compile()

    service = module.get(StoryService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll delegates to paginate', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    const query: FindAllQueryDto<ResponseStoryDto> = { page: 1 }

    await service.findAll(7, query)

    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'story',
        context: { userId: 7 },
        computedBatch: expect.any(Function)
      })
    )
  })

  it('findAllByUserId passes userId filter', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    const query: FindAllQueryDto<ResponseStoryDto> = { page: 2 }

    await service.findAllByUserId(5, 11, query)

    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'story',
        where: { userId: 5 },
        prisma: expect.any(Object),
        include: expect.objectContaining({
          user: expect.any(Object),
          files: true
        }),
        page: 2,
        context: { userId: 11 },
        computedBatch: expect.any(Function)
      })
    )
  })

  it('findOne returns story with view meta', async () => {
    prisma.story.findFirstOrThrow.mockResolvedValue({ id: 1, userId: 2 })
    prisma.storyView.upsert.mockResolvedValue({ id: 1 })
    prisma.storyView.findMany.mockResolvedValue([{ storyId: 1 }])

    const result = await service.findOne(1, 5)

    expect(prisma.story.findFirstOrThrow).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    )
    expect(prisma.storyView.upsert).toHaveBeenCalledWith({
      where: { storyId_userId: { storyId: 1, userId: 5 } },
      update: {},
      create: { storyId: 1, userId: 5 }
    })
    expect(result).toEqual(expect.objectContaining({ id: 1, isViewed: true }))
  })

  it('findAllViewers delegates to paginate with ordering', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    await service.findAllViewers(3, { page: 1 })

    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'storyView',
        where: { storyId: 3 },
        ordering: '-createdAt'
      })
    )
  })

  it('create saves story with files', async () => {
    prisma.story.create.mockResolvedValue({ id: 2 })

    const dto: CreateStoryDto = {
      previewUrl: 'preview.png',
      files: [1, 2]
    }

    const result = await service.create(10, dto)

    expect(prisma.story.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          userId: 10,
          previewUrl: 'preview.png',
          files: { connect: [{ id: 1 }, { id: 2 }] }
        }
      })
    )
    expect(result).toEqual({ id: 2 })
  })

  it('update modifies story if user is owner', async () => {
    prisma.story.findFirst.mockResolvedValue({ id: 5 })
    prisma.story.update.mockResolvedValue({ id: 5 })

    const dto: UpdateStoryDto = { previewUrl: 'updated.png', files: [3] }
    const result = await service.update(5, 10, dto)

    expect(prisma.story.findFirst).toHaveBeenCalledWith({
      where: { id: 5, userId: 10 }
    })
    expect(prisma.story.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 5, userId: 10 },
        data: {
          previewUrl: 'updated.png',
          files: { connect: [{ id: 3 }] }
        }
      })
    )
    expect(result).toEqual({ id: 5 })
  })

  it('update throws NotFoundException if not owner', async () => {
    prisma.story.findFirst.mockResolvedValue(null)

    await expect(
      service.update(1, 2, { previewUrl: 'x' })
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it('remove deletes story if user is owner', async () => {
    prisma.story.findFirst.mockResolvedValue({ id: 10 })
    prisma.story.delete.mockResolvedValue({ id: 10 })

    const result = await service.remove(10, 5)

    expect(prisma.story.findFirst).toHaveBeenCalledWith({
      where: { id: 10, userId: 5 }
    })
    expect(prisma.story.delete).toHaveBeenCalledWith({ where: { id: 10 } })
    expect(result).toEqual({ id: 10 })
  })

  it('remove throws NotFoundException if not owner', async () => {
    prisma.story.findFirst.mockResolvedValue(null)

    await expect(service.remove(10, 5)).rejects.toBeInstanceOf(
      NotFoundException
    )
  })
})
