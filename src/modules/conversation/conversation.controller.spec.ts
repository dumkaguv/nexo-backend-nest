import { Test, TestingModule } from '@nestjs/testing'

import { ResponseMessageDto } from '@/modules/message/dto'

import { ConversationController } from './conversation.controller'
import { ConversationService } from './conversation.service'
import { ResponseConversationDto } from './dto'

describe('ConversationController', () => {
  let controller: ConversationController
  let conversationService: {
    findAll: jest.Mock
    findAllConversationMessages: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
    remove: jest.Mock
  }

  beforeEach(async () => {
    conversationService = {
      findAll: jest.fn(),
      findAllConversationMessages: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        { provide: ConversationService, useValue: conversationService }
      ]
    }).compile()

    controller = module.get(ConversationController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll returns paginated conversations', async () => {
    conversationService.findAll.mockResolvedValue({
      data: [{ id: 1 }],
      total: 1
    })

    const result = (await controller.findAll(
      { user: { id: 1 } } as never,
      { page: 1 } as never
    )) as { data: ResponseConversationDto[]; total: number }

    expect(conversationService.findAll).toHaveBeenCalledWith(1, { page: 1 })
    expect(result.data[0]).toBeInstanceOf(ResponseConversationDto)
  })

  it('findAllConversationMessages returns paginated messages', async () => {
    conversationService.findAllConversationMessages.mockResolvedValue({
      data: [{ id: 2 }],
      total: 1
    })

    const result = (await controller.findAllConversationMessages(
      { user: { id: 1 } } as never,
      '3',
      { page: 1 } as never
    )) as { data: ResponseMessageDto[]; total: number }

    expect(
      conversationService.findAllConversationMessages
    ).toHaveBeenCalledWith(1, 3, { page: 1 })
    expect(result.data[0]).toBeInstanceOf(ResponseMessageDto)
  })

  it('findOne returns ResponseConversationDto', async () => {
    conversationService.findOne.mockResolvedValue({ id: 4 })

    const result = await controller.findOne({ user: { id: 1 } } as never, '4')

    expect(conversationService.findOne).toHaveBeenCalledWith(1, 4)
    expect(result).toBeInstanceOf(ResponseConversationDto)
  })

  it('create returns ResponseConversationDto', async () => {
    conversationService.create.mockResolvedValue({ id: 5 })

    const result = await controller.create({ user: { id: 1 } } as never, {
      receiverId: 2
    })

    expect(conversationService.create).toHaveBeenCalledWith(1, {
      receiverId: 2
    })
    expect(result).toBeInstanceOf(ResponseConversationDto)
  })

  it('remove delegates to service', async () => {
    conversationService.remove.mockResolvedValue({ id: 6 })

    await expect(
      controller.remove({ user: { id: 1 } } as never, '6')
    ).resolves.toEqual({ id: 6 })
    expect(conversationService.remove).toHaveBeenCalledWith(1, 6)
  })
})
