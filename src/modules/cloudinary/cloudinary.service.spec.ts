import { PassThrough } from 'stream'

import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { CloudinaryService } from './cloudinary.service'

const cloudinaryMock = {
  config: jest.fn(),
  uploader: {
    upload_stream: jest.fn(),
    destroy: jest.fn()
  }
}

jest.mock('cloudinary', () => ({
  v2: cloudinaryMock
}))

const streamifierMock = {
  createReadStream: jest.fn()
}

jest.mock('streamifier', () => streamifierMock)

describe('CloudinaryService', () => {
  let service: CloudinaryService
  let configService: { getOrThrow: jest.Mock }

  beforeEach(async () => {
    const configValues: Record<string, string> = {
      CLOUDINARY_CLOUD_NAME: 'name',
      CLOUDINARY_API_KEY: 'key',
      CLOUDINARY_API_SECRET: 'secret'
    }

    configService = {
      getOrThrow: jest.fn((key: string) => configValues[key])
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        { provide: ConfigService, useValue: configService }
      ]
    }).compile()

    service = module.get(CloudinaryService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('configures cloudinary on init', () => {
    expect(cloudinaryMock.config).toHaveBeenCalledWith({
      cloud_name: 'name',
      api_key: 'key',
      api_secret: 'secret'
    })
  })

  it('uploadFromBuffer uploads file and returns result', async () => {
    const uploadStream = new PassThrough()

    cloudinaryMock.uploader.upload_stream.mockImplementation(
      (
        _options: unknown,
        cb: (err: Error | null, result?: unknown) => void
      ) => {
        cb(null, {
          public_id: 'public',
          secure_url: 'https://cdn/file.jpg',
          resource_type: 'image'
        })

        return uploadStream
      }
    )
    const pipe = jest.fn()

    streamifierMock.createReadStream.mockReturnValue({ pipe })

    const result = await service.uploadFromBuffer(
      { buffer: Buffer.from('data') } as Express.Multer.File,
      7,
      'avatars'
    )

    expect(cloudinaryMock.uploader.upload_stream).toHaveBeenCalledWith(
      { folder: 'avatars/user-7' },
      expect.any(Function)
    )
    expect(pipe).toHaveBeenCalledWith(uploadStream)
    expect(result).toEqual({
      public_id: 'public',
      secure_url: 'https://cdn/file.jpg',
      resource_type: 'image'
    })
  })

  it('delete resolves when cloudinary returns ok', async () => {
    cloudinaryMock.uploader.destroy.mockImplementation(
      (
        _id: string,
        cb: (err: Error | null, result?: { result: string }) => void
      ) => cb(null, { result: 'ok' })
    )

    await expect(service.delete('public')).resolves.toBeUndefined()
  })

  it('delete rejects when result is not ok', async () => {
    cloudinaryMock.uploader.destroy.mockImplementation(
      (
        _id: string,
        cb: (err: Error | null, result?: { result: string }) => void
      ) => cb(null, { result: 'error' })
    )

    await expect(service.delete('public')).rejects.toBeInstanceOf(Error)
  })
})
