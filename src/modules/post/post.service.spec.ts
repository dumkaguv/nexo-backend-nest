import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { paginate, sanitizeHtmlContent } from '@/common/utils'
import { FileService } from '@/modules/file/file.service'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { PostService } from './post.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn(),
  sanitizeHtmlContent: jest.fn()
}))

describe('PostService', () => {
  let service: PostService
  let prisma: {
    post: {
      findFirstOrThrow: jest.Mock
      create: jest.Mock
      update: jest.Mock
      delete: jest.Mock
    }
    postFile: {
      createMany: jest.Mock
    }
    postLike: {
      create: jest.Mock
      findFirst: jest.Mock
      count: jest.Mock
      delete: jest.Mock
    }
    postComment: {
      create: jest.Mock
      count: jest.Mock
      update: jest.Mock
      findFirstOrThrow: jest.Mock
      delete: jest.Mock
    }
  }
  let userService: { findFollowingUserIds: jest.Mock }

  beforeEach(async () => {
    prisma = {
      post: {
        findFirstOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      postFile: {
        createMany: jest.fn()
      },
      postLike: {
        create: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        delete: jest.fn()
      },
      postComment: {
        create: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        findFirstOrThrow: jest.fn(),
        delete: jest.fn()
      }
    }
    userService = { findFollowingUserIds: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PrismaService, useValue: prisma },
        { provide: UserService, useValue: userService },
        { provide: FileService, useValue: {} }
      ]
    }).compile()

    service = module.get(PostService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll delegates to paginate and computed helpers work', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })
    prisma.postLike.findFirst.mockResolvedValue({ id: 1 })
    prisma.postLike.count.mockResolvedValue(2)
    prisma.postComment.count.mockResolvedValue(3)

    await service.findAll(5, { page: 1 })

    const paginateArgs = (paginate as jest.Mock).mock.calls[0][0]

    expect(paginateArgs.model).toBe('post')
    await expect(
      paginateArgs.computed.isLiked(
        { id: 1 },
        { prisma, context: { userId: 5 } }
      )
    ).resolves.toBe(true)
    await expect(
      paginateArgs.computed.likesCount({ id: 1 }, { prisma })
    ).resolves.toBe(2)
    await expect(
      paginateArgs.computed.commentsCount({ id: 1 }, { prisma })
    ).resolves.toBe(3)
  })

  it('findAllComments passes user search filter', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    await service.findAllComments(2, { search: 'neo' })
    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'postComment',
        where: expect.objectContaining({
          postId: 2,
          OR: [
            {
              user: {
                username: { contains: 'neo', mode: 'insensitive' }
              }
            },
            {
              user: {
                profile: {
                  fullName: { contains: 'neo', mode: 'insensitive' }
                }
              }
            }
          ]
        })
      })
    )
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

  it('create stores sanitized content and files', async () => {
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('text')
    prisma.post.create.mockResolvedValue({ id: 10 })
    prisma.postFile.createMany.mockResolvedValue({ count: 2 })

    await expect(
      service.create(1, { content: 'text', files: [1, 2] })
    ).resolves.toEqual({ id: 10 })
    expect(prisma.post.create).toHaveBeenCalledWith({
      data: { userId: 1, content: 'text' }
    })
    expect(prisma.postFile.createMany).toHaveBeenCalledWith({
      data: [
        { postId: 10, fileId: 1 },
        { postId: 10, fileId: 2 }
      ],
      skipDuplicates: true
    })
  })

  it('createComment stores sanitized content', async () => {
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('comment')
    prisma.postComment.create.mockResolvedValue({ id: 1 })

    await expect(
      service.createComment(1, 2, { content: 'comment' })
    ).resolves.toEqual({})
    expect(prisma.postComment.create).toHaveBeenCalledWith({
      data: { userId: 1, postId: 2, content: 'comment' }
    })
  })

  it('update writes sanitized content and files', async () => {
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('updated')
    prisma.post.update.mockResolvedValue({ id: 1 })

    await expect(
      service.update(1, { content: 'updated', files: [5] })
    ).resolves.toEqual({ id: 1 })
    expect(prisma.postFile.createMany).toHaveBeenCalledWith({
      data: [{ postId: 1, fileId: 5 }],
      skipDuplicates: true
    })
  })

  it('removeLike deletes by composite key', async () => {
    prisma.postLike.delete.mockResolvedValue({ id: 1 })

    await expect(service.removeLike(1, 2)).resolves.toEqual({ id: 1 })
    expect(prisma.postLike.delete).toHaveBeenCalledWith({
      where: { userId_postId: { userId: 1, postId: 2 } }
    })
  })

  it('removeComment throws when not owner', async () => {
    prisma.postComment.findFirstOrThrow.mockResolvedValue({ userId: 2 })

    await expect(service.removeComment(1, 2, 3)).rejects.toBeInstanceOf(
      BadRequestException
    )
  })
})
