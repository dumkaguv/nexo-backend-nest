import { Test, TestingModule } from '@nestjs/testing'

import { EmptyResponseDto } from '@/common/dtos'

import { ResponsePostCommentDto } from '../dto'
import { PostCommentsController } from './post-comments.controller'
import { PostCommentsService } from '../services/post-comments.service'

describe('PostCommentsController', () => {
  let controller: PostCommentsController
  let postCommentsService: {
    findAllComments: jest.Mock
    createComment: jest.Mock
    updateComment: jest.Mock
    removeComment: jest.Mock
  }

  beforeEach(async () => {
    postCommentsService = {
      findAllComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      removeComment: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentsController],
      providers: [
        { provide: PostCommentsService, useValue: postCommentsService }
      ]
    }).compile()

    controller = module.get(PostCommentsController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAllComments returns paginated comments', async () => {
    postCommentsService.findAllComments.mockResolvedValue({
      data: [{ id: 2, content: 'comment' }],
      total: 1
    })

    const result = (await controller.findAllComments('1', {
      page: 1
    })) as { data: ResponsePostCommentDto[]; total: number }

    expect(postCommentsService.findAllComments).toHaveBeenCalledWith(1, {
      page: 1
    })
    expect(result.data[0]).toBeInstanceOf(ResponsePostCommentDto)
  })

  it('createComment returns EmptyResponseDto', async () => {
    postCommentsService.createComment.mockResolvedValue({})

    const result = await controller.createComment(
      { user: { id: 1 } } as never,
      '2',
      { content: 'comment' }
    )

    expect(postCommentsService.createComment).toHaveBeenCalledWith(1, 2, {
      content: 'comment'
    })
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('updateComment returns EmptyResponseDto', async () => {
    postCommentsService.updateComment.mockResolvedValue({})

    const result = await controller.updateComment(
      { user: { id: 1 } } as never,
      '1',
      '2',
      { content: 'updated' }
    )

    expect(postCommentsService.updateComment).toHaveBeenCalledWith(1, 1, 2, {
      content: 'updated'
    })
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('removeComment returns EmptyResponseDto', async () => {
    postCommentsService.removeComment.mockResolvedValue({})

    const result = await controller.removeComment(
      { user: { id: 1 } } as never,
      '2',
      '4'
    )

    expect(postCommentsService.removeComment).toHaveBeenCalledWith(1, 2, 4)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })
})
