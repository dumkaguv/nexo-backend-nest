import { Test, TestingModule } from '@nestjs/testing'

import { ResponseStoryDto } from './dto'
import { StoryController } from './story.controller'
import { StoryService } from './story.service'

describe('StoryController', () => {
  let controller: StoryController
  let storyService: {
    findALl: jest.Mock
    findALlByUserId: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
    update: jest.Mock
    remove: jest.Mock
  }

  beforeEach(async () => {
    storyService = {
      findALl: jest.fn(),
      findALlByUserId: jest.fn(),
      findOne: jest.fn(),
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
    storyService.findALl.mockResolvedValue({
      data: [{ id: 1 }],
      total: 1
    })

    const result = (await controller.findAll({
      page: 1
    } as never)) as { data: ResponseStoryDto[]; total: number }

    expect(storyService.findALl).toHaveBeenCalledWith({ page: 1 })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponseStoryDto)
  })

  it('findAllByUserId returns paginated stories', async () => {
    storyService.findALlByUserId.mockResolvedValue({
      data: [{ id: 2 }],
      total: 1
    })

    const result = (await controller.findAllByUserId(
      { page: 2 } as never,
      '5'
    )) as { data: ResponseStoryDto[]; total: number }

    expect(storyService.findALlByUserId).toHaveBeenCalledWith(5, { page: 2 })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponseStoryDto)
  })

  it('findOne returns ResponseStoryDto', async () => {
    storyService.findOne.mockResolvedValue({ id: 3 })

    const result = await controller.findOne('3')

    expect(storyService.findOne).toHaveBeenCalledWith(3)
    expect(result).toBeInstanceOf(ResponseStoryDto)
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

    expect(storyService.remove).toHaveBeenCalledWith(3, 9)
  })
})
