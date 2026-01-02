import { Test, TestingModule } from '@nestjs/testing'

import { EmptyResponseDto } from '@/common/dtos'

import {
  ResponsePostCommentDto,
  ResponsePostDto,
  ResponsePostLikeDto
} from './dto'
import { PostController } from './post.controller'
import { PostService } from './post.service'

describe('PostController', () => {
  let controller: PostController
  let postService: {
    findAll: jest.Mock
    findAllComments: jest.Mock
    findAllLikes: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
    createComment: jest.Mock
    update: jest.Mock
    updateComment: jest.Mock
    createLike: jest.Mock
    removeLike: jest.Mock
    removeComment: jest.Mock
    remove: jest.Mock
  }

  beforeEach(async () => {
    postService = {
      findAll: jest.fn(),
      findAllComments: jest.fn(),
      findAllLikes: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      createComment: jest.fn(),
      update: jest.fn(),
      updateComment: jest.fn(),
      createLike: jest.fn(),
      removeLike: jest.fn(),
      removeComment: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: postService }]
    }).compile()

    controller = module.get(PostController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll returns paginated posts', async () => {
    postService.findAll.mockResolvedValue({
      data: [{ id: 1, content: 'text' }],
      total: 1
    })

    const result = (await controller.findAll(
      { user: { id: 5 } } as never,
      { page: 1 } as never
    )) as { data: ResponsePostDto[]; total: number }

    expect(postService.findAll).toHaveBeenCalledWith(5, { page: 1 })
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponsePostDto)
  })

  it('findAllComments returns paginated comments', async () => {
    postService.findAllComments.mockResolvedValue({
      data: [{ id: 2, content: 'comment' }],
      total: 1
    })

    const result = (await controller.findAllComments('1', {
      page: 1
    })) as { data: ResponsePostCommentDto[]; total: number }

    expect(postService.findAllComments).toHaveBeenCalledWith(1, { page: 1 })
    expect(result.data[0]).toBeInstanceOf(ResponsePostCommentDto)
  })

  it('findAllLikes returns paginated likes', async () => {
    postService.findAllLikes.mockResolvedValue({
      data: [{ id: 3 }],
      total: 1
    })

    const result = (await controller.findAllLikes(
      { user: { id: 7 } } as never,
      '9',
      { page: 1 } as never
    )) as { data: ResponsePostLikeDto[]; total: number }

    expect(postService.findAllLikes).toHaveBeenCalledWith(9, 7, { page: 1 })
    expect(result.data[0]).toBeInstanceOf(ResponsePostLikeDto)
  })

  it('findOne returns ResponsePostDto', async () => {
    postService.findOne.mockResolvedValue({ id: 4 })

    const result = await controller.findOne('4')

    expect(postService.findOne).toHaveBeenCalledWith(4)
    expect(result).toBeInstanceOf(ResponsePostDto)
  })

  it('create returns ResponsePostDto', async () => {
    postService.create.mockResolvedValue({ id: 5 })

    const result = await controller.create({ user: { id: 1 } } as never, {
      content: 'text'
    })

    expect(postService.create).toHaveBeenCalledWith(1, { content: 'text' })
    expect(result).toBeInstanceOf(ResponsePostDto)
  })

  it('createComment returns EmptyResponseDto', async () => {
    postService.createComment.mockResolvedValue({})

    const result = await controller.createComment(
      { user: { id: 1 } } as never,
      '2',
      { content: 'comment' }
    )

    expect(postService.createComment).toHaveBeenCalledWith(1, 2, {
      content: 'comment'
    })
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('update returns ResponsePostDto', async () => {
    postService.update.mockResolvedValue({ id: 6 })

    const result = await controller.update('6', { content: 'updated' })

    expect(postService.update).toHaveBeenCalledWith(6, { content: 'updated' })
    expect(result).toBeInstanceOf(ResponsePostDto)
  })

  it('updateComment returns EmptyResponseDto', async () => {
    postService.updateComment.mockResolvedValue({})

    const result = await controller.updateComment('1', '2', {
      content: 'updated'
    })

    expect(postService.updateComment).toHaveBeenCalledWith(1, 2, {
      content: 'updated'
    })
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('createLike returns EmptyResponseDto', async () => {
    postService.createLike.mockResolvedValue({})

    const result = await controller.createLike(
      { user: { id: 1 } } as never,
      '3'
    )

    expect(postService.createLike).toHaveBeenCalledWith(1, 3)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('removeLike returns EmptyResponseDto', async () => {
    postService.removeLike.mockResolvedValue({})

    const result = await controller.removeLike(
      { user: { id: 1 } } as never,
      '3'
    )

    expect(postService.removeLike).toHaveBeenCalledWith(1, 3)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('removeComment returns EmptyResponseDto', async () => {
    postService.removeComment.mockResolvedValue({})

    const result = await controller.removeComment(
      { user: { id: 1 } } as never,
      '2',
      '4'
    )

    expect(postService.removeComment).toHaveBeenCalledWith(1, 2, 4)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('remove deletes post', async () => {
    postService.remove.mockResolvedValue({ id: 8 })

    await expect(controller.remove('8')).resolves.toEqual({ id: 8 })
    expect(postService.remove).toHaveBeenCalledWith(8)
  })
})
