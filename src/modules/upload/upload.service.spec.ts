import { Test, TestingModule } from '@nestjs/testing'

import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service'
import { FileService } from '@/modules/file/file.service'

import { UploadService } from './upload.service'

describe('UploadService', () => {
  let service: UploadService
  let cloudinaryService: { uploadFromBuffer: jest.Mock }
  let fileService: { create: jest.Mock; findOne: jest.Mock; delete: jest.Mock }

  beforeEach(async () => {
    cloudinaryService = { uploadFromBuffer: jest.fn() }
    fileService = {
      create: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: CloudinaryService, useValue: cloudinaryService },
        { provide: FileService, useValue: fileService }
      ]
    }).compile()

    service = module.get(UploadService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('uploads file and stores record', async () => {
    const file = { buffer: Buffer.from('data') } as Express.Multer.File

    cloudinaryService.uploadFromBuffer.mockResolvedValue({
      public_id: 'public',
      secure_url: 'https://cdn/file.jpg',
      resource_type: 'image'
    })
    fileService.create.mockResolvedValue({ id: 11 })

    await expect(service.upload(file, 7, 'avatars')).resolves.toEqual({
      id: 11,
      secure_url: 'https://cdn/file.jpg',
      type: 'image'
    })
    expect(cloudinaryService.uploadFromBuffer).toHaveBeenCalledWith(
      file,
      7,
      'avatars'
    )
    expect(fileService.create).toHaveBeenCalledWith(
      'public',
      'https://cdn/file.jpg',
      'image'
    )
  })

  it('deletes file by id', async () => {
    fileService.findOne.mockResolvedValue({ publicId: 'public' })
    fileService.delete.mockResolvedValue(undefined)

    await expect(service.delete(5)).resolves.toBeUndefined()
    expect(fileService.findOne).toHaveBeenCalledWith(5)
    expect(fileService.delete).toHaveBeenCalledWith('public', 5)
  })
})
