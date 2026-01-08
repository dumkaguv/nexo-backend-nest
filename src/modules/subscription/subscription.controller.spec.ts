import { Test, TestingModule } from '@nestjs/testing'

import { EmptyResponseDto } from '@/common/dtos'

import { ResponseSubscriptionCountDto, ResponseSubscriptionDto } from './dto'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'

describe('SubscriptionController', () => {
  let controller: SubscriptionController
  let subscriptionService: {
    findAllSubscriptions: jest.Mock
    findOneSubscriptionCount: jest.Mock
    follow: jest.Mock
    unfollow: jest.Mock
    removeFollower: jest.Mock
  }

  beforeEach(async () => {
    subscriptionService = {
      findAllSubscriptions: jest.fn(),
      findOneSubscriptionCount: jest.fn(),
      follow: jest.fn(),
      unfollow: jest.fn(),
      removeFollower: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        { provide: SubscriptionService, useValue: subscriptionService }
      ]
    }).compile()

    controller = module.get(SubscriptionController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAllFollowers returns paginated followers', async () => {
    subscriptionService.findAllSubscriptions.mockResolvedValue({
      data: [{ id: 1, user: { id: 2 } }],
      total: 1
    })

    const result = (await controller.findAllFollowers('1', {
      page: 1
    })) as { data: ResponseSubscriptionDto[]; total: number }

    expect(subscriptionService.findAllSubscriptions).toHaveBeenCalledWith(1, {
      page: 1
    })
    expect(result.data[0]).toBeInstanceOf(ResponseSubscriptionDto)
  })

  it('findAllFollowing returns paginated following', async () => {
    subscriptionService.findAllSubscriptions.mockResolvedValue({
      data: [{ id: 1, user: { id: 2 } }],
      total: 1
    })

    const result = (await controller.findAllFollowing('1', {
      page: 1
    })) as { data: ResponseSubscriptionDto[]; total: number }

    expect(subscriptionService.findAllSubscriptions).toHaveBeenCalledWith(
      1,
      { page: 1 },
      false
    )
    expect(result.data[0]).toBeInstanceOf(ResponseSubscriptionDto)
  })

  it('findOneCount returns ResponseSubscriptionCountDto', async () => {
    subscriptionService.findOneSubscriptionCount.mockResolvedValue({
      followers: 2,
      following: 3
    })

    const result = await controller.findOneCount('5')

    expect(subscriptionService.findOneSubscriptionCount).toHaveBeenCalledWith(5)
    expect(result).toBeInstanceOf(ResponseSubscriptionCountDto)
  })

  it('follow returns EmptyResponseDto', async () => {
    subscriptionService.follow.mockResolvedValue({})

    const result = await controller.follow({ user: { id: 1 } } as never, '2')

    expect(subscriptionService.follow).toHaveBeenCalledWith(1, 2)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('unfollow returns EmptyResponseDto', async () => {
    subscriptionService.unfollow.mockResolvedValue({})

    const result = await controller.unfollow({ user: { id: 1 } } as never, '2')

    expect(subscriptionService.unfollow).toHaveBeenCalledWith(1, 2)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })

  it('removeFollower returns EmptyResponseDto', async () => {
    subscriptionService.removeFollower.mockResolvedValue({})

    const result = await controller.removeFollower(
      { user: { id: 1 } } as never,
      '2'
    )

    expect(subscriptionService.removeFollower).toHaveBeenCalledWith(1, 2)
    expect(result).toBeInstanceOf(EmptyResponseDto)
  })
})
