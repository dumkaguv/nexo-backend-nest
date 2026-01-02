import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { paginate } from '@/common/utils'
import { MessageService } from '@/modules/message/message.service'
import { PrismaService } from '@/prisma/prisma.service'

import { ConversationService } from './conversation.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn()
}))

describe('ConversationService', () => {
  let service: ConversationService
  let prisma: {
    conversation: {
      findFirst: jest.Mock
      create: jest.Mock
      delete: jest.Mock
    }
  }
  let messageService: { findAllMyMessages: jest.Mock }

  beforeEach(async () => {
    prisma = {
      conversation: {
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn()
      }
    }
    messageService = { findAllMyMessages: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        { provide: PrismaService, useValue: prisma },
        { provide: MessageService, useValue: messageService }
      ]
    }).compile()

    service = module.get(ConversationService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll delegates to paginate with default ordering', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    await service.findAll(1, { page: 1 })
    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'conversation',
        ordering: '-updatedAt',
        where: {
          AND: [{}, { OR: [{ senderId: 1 }, { receiverId: 1 }] }]
        }
      })
    )
  })

  it('findAllConversationMessages delegates to message service', async () => {
    messageService.findAllMyMessages.mockResolvedValue({ data: [], total: 0 })

    await expect(
      service.findAllConversationMessages(1, 2, { page: 1 })
    ).resolves.toEqual({ data: [], total: 0 })
    expect(messageService.findAllMyMessages).toHaveBeenCalledWith(1, 2, {
      page: 1
    })
  })

  it('findOne throws when access denied', async () => {
    prisma.conversation.findFirst.mockResolvedValue(null)

    await expect(service.findOne(1, 2)).rejects.toBeInstanceOf(
      ForbiddenException
    )
  })

  it('findOne returns conversation when allowed', async () => {
    prisma.conversation.findFirst.mockResolvedValue({ id: 1 })

    await expect(service.findOne(1, 1)).resolves.toEqual({ id: 1 })
  })

  it('create creates conversation', async () => {
    prisma.conversation.create.mockResolvedValue({ id: 3 })

    await expect(service.create(1, { receiverId: 2 })).resolves.toEqual({
      id: 3
    })
    expect(prisma.conversation.create).toHaveBeenCalledWith({
      data: { senderId: 1, receiverId: 2 }
    })
  })

  it('remove throws when access denied', async () => {
    prisma.conversation.findFirst.mockResolvedValue(null)

    await expect(service.remove(1, 2)).rejects.toBeInstanceOf(
      ForbiddenException
    )
  })

  it('remove deletes conversation', async () => {
    prisma.conversation.findFirst.mockResolvedValue({ id: 1 })
    prisma.conversation.delete.mockResolvedValue({ id: 1 })

    await expect(service.remove(1, 1)).resolves.toEqual({ id: 1 })
    expect(prisma.conversation.delete).toHaveBeenCalledWith({
      where: { id: 1 }
    })
  })
})
