import {
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { paginate, sanitizeHtmlContent } from '@/common/utils'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { MessageService } from './message.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn(),
  sanitizeHtmlContent: jest.fn()
}))

describe('MessageService', () => {
  let service: MessageService
  let prisma: {
    message: {
      findUnique: jest.Mock
      create: jest.Mock
      update: jest.Mock
    }
    file: {
      findMany: jest.Mock
    }
    messageFile: {
      createMany: jest.Mock
    }
    conversation: {
      findFirst: jest.Mock
      update: jest.Mock
    }
  }
  let userService: { findOne: jest.Mock }

  beforeEach(async () => {
    prisma = {
      message: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      },
      file: {
        findMany: jest.fn()
      },
      messageFile: {
        createMany: jest.fn()
      },
      conversation: {
        findFirst: jest.fn(),
        update: jest.fn()
      }
    }
    userService = { findOne: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: PrismaService, useValue: prisma },
        { provide: UserService, useValue: userService }
      ]
    }).compile()

    service = module.get(MessageService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll delegates to paginate', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    await expect(service.findAll(5, { page: 1 })).resolves.toEqual({
      data: [],
      total: 0
    })
    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'message',
        where: { receiverId: 5 },
        include: { files: { include: { file: true } } }
      })
    )
  })

  it('findAllMyMessages uses default ordering', async () => {
    ;(paginate as jest.Mock).mockResolvedValue({ data: [], total: 0 })

    await service.findAllMyMessages(1, 2, { page: 1 })
    expect(paginate).toHaveBeenCalledWith(
      expect.objectContaining({
        ordering: '-createdAt',
        where: {
          conversationId: 2,
          conversation: { OR: [{ senderId: 1 }, { receiverId: 1 }] }
        }
      })
    )
  })

  it('create throws when content and files are missing', async () => {
    await expect(
      service.create(1, { receiverId: 2, conversationId: 3 } as never)
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('create throws when files are missing in storage', async () => {
    prisma.conversation.findFirst.mockResolvedValue({
      senderId: 1,
      receiverId: 2
    })
    userService.findOne.mockResolvedValue({ id: 2 })
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('hello')
    prisma.file.findMany.mockResolvedValue([{ id: 1 }])

    await expect(
      service.create(1, {
        receiverId: 2,
        conversationId: 3,
        content: 'hello',
        fileIds: [1, 2]
      })
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('create stores sanitized content and files', async () => {
    prisma.conversation.findFirst.mockResolvedValue({
      senderId: 1,
      receiverId: 2
    })
    userService.findOne.mockResolvedValue({ id: 2 })
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('hi')
    prisma.file.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }])
    prisma.message.create.mockResolvedValue({
      id: 10,
      conversationId: 3,
      senderId: 1,
      receiverId: 2,
      content: 'hi',
      createdAt: new Date('2024-01-01'),
      files: [
        {
          file: {
            id: 1,
            url: 'u',
            type: 't',
            uploadedAt: new Date('2024-01-02')
          }
        }
      ]
    })

    await expect(
      service.create(1, {
        receiverId: 2,
        conversationId: 3,
        content: 'hi',
        fileIds: [1, 2, 2]
      })
    ).resolves.toEqual({
      id: 10,
      conversationId: 3,
      senderId: 1,
      receiverId: 2,
      content: 'hi',
      createdAt: new Date('2024-01-01'),
      files: [
        { id: 1, url: 'u', type: 't', uploadedAt: new Date('2024-01-02') }
      ]
    })
    expect(prisma.conversation.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { updatedAt: expect.any(Date) }
    })
    expect(prisma.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          files: {
            createMany: {
              data: [{ fileId: 1 }, { fileId: 2 }]
            }
          }
        })
      })
    )
  })

  it('create throws when conversation is missing', async () => {
    prisma.conversation.findFirst.mockResolvedValue(null)

    await expect(
      service.create(1, {
        receiverId: 2,
        conversationId: 3,
        content: 'hi'
      })
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it('create throws when user is not participant', async () => {
    prisma.conversation.findFirst.mockResolvedValue({
      senderId: 5,
      receiverId: 6
    })

    await expect(
      service.create(1, {
        receiverId: 2,
        conversationId: 3,
        content: 'hi'
      })
    ).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('update forbids editing a message from another sender', async () => {
    prisma.message.findUnique.mockResolvedValue({ id: 1, senderId: 2 })

    await expect(
      service.update(1, 1, { id: 1, content: 'hi' })
    ).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('update creates message files and updates content', async () => {
    prisma.message.findUnique.mockResolvedValue({ id: 1, senderId: 1 })
    prisma.file.findMany.mockResolvedValue([{ id: 1 }])
    ;(sanitizeHtmlContent as jest.Mock).mockReturnValue('updated')
    prisma.message.update.mockResolvedValue({ id: 1, content: 'updated' })

    await expect(
      service.update(1, 1, { id: 1, content: 'updated', fileIds: [1] })
    ).resolves.toEqual({ id: 1, content: 'updated' })
    expect(prisma.messageFile.createMany).toHaveBeenCalledWith({
      data: [{ messageId: 1, fileId: 1 }],
      skipDuplicates: true
    })
  })

  it('update does not overwrite content when omitted', async () => {
    prisma.message.findUnique.mockResolvedValue({ id: 1, senderId: 1 })
    prisma.message.update.mockResolvedValue({ id: 1 })

    await service.update(1, 1, { id: 1 })
    expect(prisma.message.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          isEdited: true
        })
      })
    )
  })
})
