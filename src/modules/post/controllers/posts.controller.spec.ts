import { Test, TestingModule } from '@nestjs/testing'

import { ResponsePostDto } from '../dto'
import { PostsController } from './posts.controller'
import { PostsService } from '../services/posts.service'

describe('PostsController', () => {
  let controller: PostsController
  let postsService: {
    findAll: jest.Mock
    findAllMy: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
    update: jest.Mock
    remove: jest.Mock
  }

  beforeEach(async () => {
    postsService = {
      findAll: jest.fn(),
      findAllMy: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: postsService }]
    }).compile()

    controller = module.get(PostsController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll returns paginated posts', async () => {
    postsService.findAll.mockResolvedValue({
      data: [{ id: 1, content: 'text' }],
      total: 1
    })

    const result = (await controller.findAll(
      { user: { id: 5 } } as never,
      { page: 1 } as never
    )) as { data: ResponsePostDto[]; total: number }

    expect(postsService.findAll).toHaveBeenCalledWith(5, { page: 1 })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponsePostDto)
  })

  it('findAllMy returns paginated posts', async () => {
    postsService.findAllMy.mockResolvedValue({
      data: [{ id: 2, content: 'my' }],
      total: 1
    })

    const result = (await controller.findAllMy(
      { user: { id: 6 } } as never,
      { page: 2 } as never
    )) as { data: ResponsePostDto[]; total: number }

    expect(postsService.findAllMy).toHaveBeenCalledWith(6, { page: 2 })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponsePostDto)
  })

  it('findOne returns ResponsePostDto', async () => {
    postsService.findOne.mockResolvedValue({ id: 4 })

    const result = await controller.findOne('4')

    expect(postsService.findOne).toHaveBeenCalledWith(4)
    expect(result).toBeInstanceOf(ResponsePostDto)
  })

  it('create returns ResponsePostDto', async () => {
    postsService.create.mockResolvedValue({ id: 5 })

    const result = await controller.create({ user: { id: 1 } } as never, {
      content: 'text'
    })

    expect(postsService.create).toHaveBeenCalledWith(1, { content: 'text' })
    expect(result).toBeInstanceOf(ResponsePostDto)
  })

  it('update returns ResponsePostDto', async () => {
    postsService.update.mockResolvedValue({ id: 6 })

    const result = await controller.update('6', { content: 'updated' })

    expect(postsService.update).toHaveBeenCalledWith(6, { content: 'updated' })
    expect(result).toBeInstanceOf(ResponsePostDto)
  })

  it('remove deletes post', async () => {
    postsService.remove.mockResolvedValue({ id: 8 })

    await expect(controller.remove('8')).resolves.toEqual({ id: 8 })
    expect(postsService.remove).toHaveBeenCalledWith(8)
  })
})
