import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { Prisma } from '@prisma/client'

import { paginate, sanitizeHtmlContent } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { PostCommentsService } from './post-comments.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn(),
  sanitizeHtmlContent: jest.fn()
}))

describe('PostCommentsService', () => {
  let service: PostCommentsService
  let prisma: {
    postComment: {
      create: jest.Mock
      update: jest.Mock
      findFirstOrThrow: jest.Mock
      delete: jest.Mock
    }
  }

  beforeEach(async () => {
    prisma = {
      postComment: {
        create: jest.fn(),
        update: jest.fn(),
        findFirstOrThrow: jest.fn(),
        delete: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCommentsService,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile()

    service = module.get(PostCommentsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
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
                username: {
                  contains: 'neo',
                  mode: Prisma.QueryMode.insensitive
                }
              }
            },
            {
              user: {
                profile: {
                  fullName: {
                    contains: 'neo',
                    mode: Prisma.QueryMode.insensitive
                  }
                }
              }
            }
          ]
        })
      })
    )
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

  it('updateComment stores sanitized content', async () => {
    prisma.postComment.findFirstOrThrow.mockResolvedValue({ userId: 1 })
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('updated')
    prisma.postComment.update.mockResolvedValue({ id: 1 })

    await expect(
      service.updateComment(1, 1, 2, { content: 'updated' })
    ).resolves.toEqual({})
    expect(prisma.postComment.update).toHaveBeenCalledWith({
      data: { content: 'updated' },
      where: { id: 2, postId: 1 }
    })
  })

  it('removeComment throws when not owner', async () => {
    prisma.postComment.findFirstOrThrow.mockResolvedValue({ userId: 2 })

    await expect(service.removeComment(1, 2, 3)).rejects.toBeInstanceOf(
      ForbiddenException
    )
  })
})
