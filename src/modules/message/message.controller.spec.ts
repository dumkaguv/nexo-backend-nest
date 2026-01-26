import { Test, TestingModule } from '@nestjs/testing'

import { ResponseMessageDto } from './dto'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'

describe('MessageController', () => {
  let controller: MessageController
  let messageService: {
    findOne: jest.Mock
    create: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    messageService = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{ provide: MessageService, useValue: messageService }]
    }).compile()

    controller = module.get(MessageController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findOne returns ResponseMessageDto', async () => {
    messageService.findOne.mockResolvedValue({
      id: 1,
      senderId: 2,
      receiverId: 3,
      conversationId: 4
    })

    const result = await controller.findOne({ user: { id: 2 } } as never, '1')

    expect(messageService.findOne).toHaveBeenCalledWith(2, 1)
    expect(result).toBeInstanceOf(ResponseMessageDto)
  })

  it('create returns ResponseMessageDto', async () => {
    messageService.create.mockResolvedValue({
      id: 2,
      senderId: 1,
      receiverId: 3,
      conversationId: 4
    })

    const result = await controller.create({ user: { id: 1 } } as never, {
      receiverId: 3,
      conversationId: 4,
      content: 'hi'
    })

    expect(messageService.create).toHaveBeenCalledWith(1, {
      receiverId: 3,
      conversationId: 4,
      content: 'hi'
    })
    expect(result).toBeInstanceOf(ResponseMessageDto)
  })

  it('update returns ResponseMessageDto', async () => {
    messageService.update.mockResolvedValue({
      id: 3,
      senderId: 1,
      receiverId: 2,
      conversationId: 4
    })

    const result = await controller.update({ user: { id: 1 } } as never, '3', {
      id: 3,
      content: 'updated'
    })

    expect(messageService.update).toHaveBeenCalledWith(1, 3, {
      id: 3,
      content: 'updated'
    })
    expect(result).toBeInstanceOf(ResponseMessageDto)
  })
})
