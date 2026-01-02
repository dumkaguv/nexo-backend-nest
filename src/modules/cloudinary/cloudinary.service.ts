import { Injectable } from '@nestjs/common'

import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

import type { ConfigService } from '@nestjs/config'

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME'
      ),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>('CLOUDINARY_API_SECRET')
    })
  }

  async uploadFromBuffer(
    file: Express.Multer.File,
    userId: number,
    folder: string = 'shared'
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const folderName = `${folder}/user-${userId}`

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('No result'))
          }

          resolve(result)
        }
      )

      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  async delete(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error)
        }

        if (result?.result !== 'ok' && result?.result !== 'not found') {
          return reject(new Error(`Failed to delete file: ${publicId}`))
        }

        resolve()
      })
    })
  }
}
