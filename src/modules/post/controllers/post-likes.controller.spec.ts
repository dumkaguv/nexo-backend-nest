import { Test, TestingModule } from '@nestjs/testing'

import { EmptyResponseDto } from '@/common/dtos'

import { ResponsePostLikeDto } from '../dto'
import { PostLikesController } from './post-likes.controller'
import { PostLikesService } from '../services/post-likes.service'

describe('PostLikesController', () => {
  let controller: PostLikesController
  let postLikesService: {
    findAllLikes: jest.Mock
    createLike: jest.Mock
    removeLike: jest.Mock
  }

  beforeEach(async () => {
    postLikesService = {
      findAllLikes: jest.fn(),
      createLike: jest.fn(),
      removeLike: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostLikesController],
      providers: [{ provide: PostLikesService, useValue: postLikesService }]
    }).compile()

    controller = module.get(PostLikesController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAllLikes returns paginated likes', async () => {
    postLikesService.findAllLikes.mockResolvedValue({
      data: [{ id: 3 }],
      total: 1
    })

    const result = (await controller.findAllLikes(
      { user: { id: 7 } } as never,
      '9',
      { page: 1 } as never
    )) as { data: ResponsePostLikeDto[]; total: number }

    expect(postLikesService.findAllLikes).toHaveBeenCalledWith(9, 7, {
      page: 1
    })
    expect(result.data[0]).toBeInstanceOf(ResponsePostLikeDto)
  })

  it('createLike returns EmptyResponseDto', async () => {
    postLikesService.createLike.mockResolvedValue({})

    const result = await controller.createLike(
      { user: { id: 1 } } as never,
      '3'
    )

    expect(postLikesService.createLike).toHaveBeenCalledWith(1, 3)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('removeLike returns EmptyResponseDto', async () => {
    postLikesService.removeLike.mockResolvedValue({})

    const result = await controller.removeLike(
      { user: { id: 1 } } as never,
      '3'
    )

    expect(postLikesService.removeLike).toHaveBeenCalledWith(1, 3)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })
})
