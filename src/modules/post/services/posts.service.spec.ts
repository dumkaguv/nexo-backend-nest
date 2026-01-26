import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { paginate, sanitizeHtmlContent } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'


import { PostsService } from './posts.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn(),
  sanitizeHtmlContent: jest.fn()
}))

describe('PostsService', () => {
  let service: PostsService
  let prisma: {
    post: {
      findFirst: jest.Mock
      findFirstOrThrow: jest.Mock
      create: jest.Mock
      update: jest.Mock
      delete: jest.Mock
    }
    postFile: {
      createMany: jest.Mock
    }
    postLike: {
      findFirst: jest.Mock
      findMany: jest.Mock
      count: jest.Mock
    }
    postComment: {
      count: jest.Mock
    }
  }

  beforeEach(async () => {
    prisma = {
      post: {
        findFirst: jest.fn(),
        findFirstOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      postFile: {
        createMany: jest.fn()
      },
      postLike: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn()
      },
      postComment: {
        count: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, { provide: PrismaService, useValue: prisma }]
    }).compile()

    service = module.get(PostsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll delegates to paginate and computed helpers work', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })
    prisma.postLike.findMany.mockResolvedValue([{ postId: 1 }])

    await service.findAll(5, { page: 1 })

    const paginateArgs = (paginate as jest.Mock).mock.calls[0][0]

    expect(paginateArgs.model).toBe('post')
    const batchResult = await paginateArgs.computedBatch(
      [{ id: 1, _count: { likes: 2, comments: 3 } }],
      { prisma, context: { userId: 5 } }
    )

    expect(batchResult).toEqual([
      { isLiked: true, likesCount: 2, commentsCount: 3 }
    ])
  })

  it('findAllMy includes userId filter', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    await service.findAllMy(7, { page: 1 })

    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'post',
        where: { userId: 7 },
        include: expect.objectContaining({
          _count: { select: { likes: true, comments: true } }
        })
      })
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

  it('update writes sanitized content and files', async () => {
    prisma.post.findFirst.mockResolvedValue({ id: 1 })
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('updated')
    prisma.post.update.mockResolvedValue({ id: 1 })

    await expect(
      service.update(10, 1, { content: 'updated', files: [5] })
    ).resolves.toEqual({ id: 1 })
    expect(prisma.postFile.createMany).toHaveBeenCalledWith({
      data: [{ postId: 1, fileId: 5 }],
      skipDuplicates: true
    })
  })

  it('update throws when user is not owner', async () => {
    prisma.post.findFirst.mockResolvedValue(null)

    await expect(
      service.update(10, 1, { content: 'updated' })
    ).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('remove throws when user is not owner', async () => {
    prisma.post.findFirst.mockResolvedValue(null)

    await expect(service.remove(10, 1)).rejects.toBeInstanceOf(
      ForbiddenException
    )
  })
})
