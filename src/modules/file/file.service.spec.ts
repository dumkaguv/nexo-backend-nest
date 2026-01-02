import { Test, TestingModule } from '@nestjs/testing'

import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service'
import { PrismaService } from '@/prisma/prisma.service'

import { FileService } from './file.service'

describe('FileService', () => {
  let service: FileService
  let prisma: {
    file: {
      create: jest.Mock
      delete: jest.Mock
      findFirstOrThrow: jest.Mock
    }
  }
  let cloudinaryService: { delete: jest.Mock }

  beforeEach(async () => {
    prisma = {
      file: {
        create: jest.fn(),
        delete: jest.fn(),
        findFirstOrThrow: jest.fn()
      }
    }
    cloudinaryService = { delete: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: PrismaService, useValue: prisma },
        { provide: CloudinaryService, useValue: cloudinaryService }
      ]
    }).compile()

    service = module.get(FileService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('creates a file record', async () => {
    prisma.file.create.mockResolvedValue({ id: 1 })

    await expect(
      service.create('public', 'https://cdn/test.jpg', 'image/jpeg')
    ).resolves.toEqual({ id: 1 })
    expect(prisma.file.create).toHaveBeenCalledWith({
      data: {
        publicId: 'public',
        url: 'https://cdn/test.jpg',
        type: 'image/jpeg'
      }
    })
  })

  it('deletes file record and cloudinary asset', async () => {
    prisma.file.delete.mockResolvedValue({ id: 2 })
    cloudinaryService.delete.mockResolvedValue(undefined)

    await expect(service.delete('public', 2)).resolves.toBeUndefined()
    expect(prisma.file.delete).toHaveBeenCalledWith({ where: { id: 2 } })
    expect(cloudinaryService.delete).toHaveBeenCalledWith('public')
  })

  it('finds a file by id', async () => {
    prisma.file.findFirstOrThrow.mockResolvedValue({ id: 3 })

    await expect(service.findOne(3)).resolves.toEqual({ id: 3 })
    expect(prisma.file.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: 3 }
    })
  })
})
