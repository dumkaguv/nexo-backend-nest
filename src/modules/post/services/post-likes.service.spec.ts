import { Test, TestingModule } from '@nestjs/testing'

import { paginate } from '@/common/utils'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { PostLikesService } from './post-likes.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn()
}))

describe('PostLikesService', () => {
  let service: PostLikesService
  let prisma: {
    postLike: {
      create: jest.Mock
      delete: jest.Mock
    }
  }
  let userService: { findFollowingUserIds: jest.Mock }

  beforeEach(async () => {
    prisma = {
      postLike: {
        create: jest.fn(),
        delete: jest.fn()
      }
    }
    userService = { findFollowingUserIds: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostLikesService,
        { provide: PrismaService, useValue: prisma },
        { provide: UserService, useValue: userService }
      ]
    }).compile()

    service = module.get(PostLikesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAllLikes marks following users', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })
    userService.findFollowingUserIds.mockResolvedValue(new Set([2]))

    await service.findAllLikes(3, 1, { page: 1 })

    const paginateArgs = (paginate as jest.Mock).mock.calls[0][0]

    expect(paginateArgs.model).toBe('postLike')
    expect(paginateArgs.computed.user({ user: { id: 2 } }).isFollowing).toBe(
      true
    )
    expect(paginateArgs.computed.user({ user: { id: 3 } }).isFollowing).toBe(
      false
    )
  })

  it('createLike stores a like', async () => {
    prisma.postLike.create.mockResolvedValue({ id: 1 })

    await expect(service.createLike(1, 2)).resolves.toEqual({})
    expect(prisma.postLike.create).toHaveBeenCalledWith({
      data: { userId: 1, postId: 2 }
    })
  })

  it('removeLike deletes by composite key', async () => {
    prisma.postLike.delete.mockResolvedValue({ id: 1 })

    await expect(service.removeLike(1, 2)).resolves.toEqual({ id: 1 })
    expect(prisma.postLike.delete).toHaveBeenCalledWith({
      where: { userId_postId: { userId: 1, postId: 2 } }
    })
  })
})
