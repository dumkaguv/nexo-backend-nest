import { Test, TestingModule } from '@nestjs/testing'

import { CreateUploadDto, ResponseUploadDto } from './dto'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

describe('UploadController', () => {
  let controller: UploadController
  let uploadService: { upload: jest.Mock; delete: jest.Mock }

  beforeEach(async () => {
    uploadService = {
      upload: jest.fn(),
      delete: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: UploadService, useValue: uploadService }]
    }).compile()

    controller = module.get(UploadController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('upload returns ResponseUploadDto', async () => {
    const file = { buffer: Buffer.from('data') } as Express.Multer.File

    uploadService.upload.mockResolvedValue({
      id: 1,
      secure_url: 'https://cdn/file.jpg',
      type: 'image'
    })

    const dto: CreateUploadDto = { folder: 'avatars', file }
    const result = await controller.upload(
      { user: { id: 2 } } as never,
      file,
      dto
    )

    expect(uploadService.upload).toHaveBeenCalledWith(file, 2, 'avatars')
    expect(result).toBeInstanceOf(ResponseUploadDto)
  })

  it('delete calls service and returns void', async () => {
    uploadService.delete.mockResolvedValue(undefined)

    await expect(controller.delete('5')).resolves.toBeUndefined()
    expect(uploadService.delete).toHaveBeenCalledWith(5)
  })
})
