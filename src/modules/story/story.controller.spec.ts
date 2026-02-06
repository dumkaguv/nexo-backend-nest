import { Test, TestingModule } from '@nestjs/testing'

import { ResponseStoryDto, ResponseStoryViewerDto } from './dto'
import { StoryController } from './story.controller'
import { StoryService } from './story.service'

describe('StoryController', () => {
  let controller: StoryController
  let storyService: {
    findAll: jest.Mock
    findAllByUserId: jest.Mock
    findOne: jest.Mock
    findAllViewers: jest.Mock
    create: jest.Mock
    update: jest.Mock
    remove: jest.Mock
  }

  beforeEach(async () => {
    storyService = {
      findAll: jest.fn(),
      findAllByUserId: jest.fn(),
      findOne: jest.fn(),
      findAllViewers: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [{ provide: StoryService, useValue: storyService }]
    }).compile()

    controller = module.get(StoryController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll returns paginated stories', async () => {
    storyService.findAll.mockResolvedValue({
      data: [{ id: 1 }],
      total: 1
    })

    const result = (await controller.findAll(
      { user: { id: 4 } } as never,
      { page: 1 } as never
    )) as { data: ResponseStoryDto[]; total: number }

    expect(storyService.findAll).toHaveBeenCalledWith(4, { page: 1 })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponseStoryDto)
  })

  it('findAllByUserId returns paginated stories', async () => {
    storyService.findAllByUserId.mockResolvedValue({
      data: [{ id: 2 }],
      total: 1
    })

    const result = (await controller.findAllByUserId(
      { user: { id: 6 } } as never,
      { page: 2 } as never,
      '5'
    )) as { data: ResponseStoryDto[]; total: number }

    expect(storyService.findAllByUserId).toHaveBeenCalledWith(5, 6, {
      page: 2
    })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponseStoryDto)
  })

  it('findOne returns ResponseStoryDto', async () => {
    storyService.findOne.mockResolvedValue({ id: 3 })

    const result = await controller.findOne({ user: { id: 8 } } as never, '3')

    expect(storyService.findOne).toHaveBeenCalledWith(3, 8)
    expect(result).toBeInstanceOf(ResponseStoryDto)
  })

  it('findAllViewers returns paginated viewers', async () => {
    storyService.findAllViewers.mockResolvedValue({
      data: [{ id: 1 }],
      total: 1
    })

    const result = (await controller.findAllViewers('7', {
      page: 1
    } as never)) as { data: ResponseStoryViewerDto[]; total: number }

    expect(storyService.findAllViewers).toHaveBeenCalledWith(7, { page: 1 })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponseStoryViewerDto)
  })

  it('create returns ResponseStoryDto', async () => {
    storyService.create.mockResolvedValue({ id: 4 })

    const result = await controller.create(
      { user: { id: 10 } } as never,
      { previewUrl: 'preview.png' } as never
    )

    expect(storyService.create).toHaveBeenCalledWith(10, {
      previewUrl: 'preview.png'
    })
    expect(result).toBeInstanceOf(ResponseStoryDto)
  })

  it('update returns ResponseStoryDto', async () => {
    storyService.update.mockResolvedValue({ id: 6 })

    const result = await controller.update({ user: { id: 7 } } as never, '6', {
      previewUrl: 'updated.png'
    } as never)

    expect(storyService.update).toHaveBeenCalledWith(6, 7, {
      previewUrl: 'updated.png'
    })
    expect(result).toBeInstanceOf(ResponseStoryDto)
  })

  it('remove deletes story', async () => {
    storyService.remove.mockResolvedValue({ id: 9 })

    await expect(
      controller.remove({ user: { id: 3 } } as never, '9')
    ).resolves.toEqual({ id: 9 })

    expect(storyService.remove).toHaveBeenCalledWith(9, 3)
  })
})
