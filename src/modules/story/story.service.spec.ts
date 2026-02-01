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
  }

  beforeEach(async () => {
    prisma = {
      story: {
        findFirst: jest.fn(),
        findFirstOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
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

  it('findALl delegates to paginate', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    const query: FindAllQueryDto<ResponseStoryDto> = { page: 1 }

    await service.findALl(query)

    expect(paginate).toHaveBeenCalled()
  })

  it('findALlByUserId passes userId filter', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    const query: FindAllQueryDto<ResponseStoryDto> = { page: 2 }

    await service.findALlByUserId(5, query)

    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'story',
        where: { userId: 5 },
        prisma: expect.any(Object),
        include: expect.objectContaining({
          user: expect.any(Object),
          files: true
        }),
        page: 2
      })
    )
  })

  it('findOne returns story', async () => {
    prisma.story.findFirstOrThrow.mockResolvedValue({ id: 1 })

    const result = await service.findOne(1)

    expect(prisma.story.findFirstOrThrow).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    )
    expect(result).toEqual({ id: 1 })
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
