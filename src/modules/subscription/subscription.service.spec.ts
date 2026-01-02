import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { SubscriptionService } from './subscription.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn()
}))

describe('SubscriptionService', () => {
  let service: SubscriptionService
  let prisma: {
    subscription: {
      count: jest.Mock
      findFirst: jest.Mock
      create: jest.Mock
      delete: jest.Mock
    }
  }

  beforeEach(async () => {
    prisma = {
      subscription: {
        count: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile()

    service = module.get(SubscriptionService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAllSubscriptions maps following to user', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({
      data: [
        { id: 1, following: { id: 2, username: 'neo' } },
        { id: 2, user: { id: 3, username: 'trinity' } }
      ],
      total: 2
    })

    await expect(
      service.findAllSubscriptions(5, { page: 1 }, false)
    ).resolves.toEqual({
      data: [
        { id: 1, user: { id: 2, username: 'neo' } },
        { id: 2, user: { id: 3, username: 'trinity' } }
      ],
      total: 2
    })
  })

  it('findOneSubscriptionCount returns followers and following', async () => {
    prisma.subscription.count.mockResolvedValueOnce(10).mockResolvedValueOnce(4)

    await expect(service.findOneSubscriptionCount(7)).resolves.toEqual({
      followers: 10,
      following: 4
    })
    expect(prisma.subscription.count).toHaveBeenNthCalledWith(1, {
      where: { followingId: 7 }
    })
    expect(prisma.subscription.count).toHaveBeenNthCalledWith(2, {
      where: { userId: 7 }
    })
  })

  it('follow throws when trying to follow self', async () => {
    await expect(service.follow(1, 1)).rejects.toBeInstanceOf(
      BadRequestException
    )
  })

  it('follow throws when already following', async () => {
    prisma.subscription.findFirst.mockResolvedValue({ id: 1 })

    await expect(service.follow(1, 2)).rejects.toBeInstanceOf(
      BadRequestException
    )
  })

  it('follow creates subscription', async () => {
    prisma.subscription.findFirst.mockResolvedValue(null)
    prisma.subscription.create.mockResolvedValue({ id: 1 })

    await expect(service.follow(1, 2)).resolves.toEqual({})
    expect(prisma.subscription.create).toHaveBeenCalledWith({
      data: { userId: 1, followingId: 2 }
    })
  })

  it('unfollow throws when not following', async () => {
    prisma.subscription.findFirst.mockResolvedValue(null)

    await expect(service.unfollow(1, 2)).rejects.toBeInstanceOf(
      BadRequestException
    )
  })

  it('unfollow deletes subscription', async () => {
    prisma.subscription.findFirst.mockResolvedValue({ id: 1 })
    prisma.subscription.delete.mockResolvedValue({ id: 1 })

    await expect(service.unfollow(1, 2)).resolves.toEqual({})
    expect(prisma.subscription.delete).toHaveBeenCalledWith({
      where: { userId_followingId: { userId: 1, followingId: 2 } }
    })
  })
})
