import { Injectable } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

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

  public uploadFromBuffer(
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
            return reject(this.toError(error, 'No result'))
          }

          resolve(result)
        }
      )

      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  public delete(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      void cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(this.toError(error, 'Cloudinary delete failed'))
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (result?.result !== 'ok' && result?.result !== 'not found') {
          return reject(new Error(`Failed to delete file: ${publicId}`))
        }

        resolve()
      })
    })
  }

  private toError(err: unknown, fallback: string): Error {
    if (err instanceof Error) {
      return err
    }

    if (typeof err === 'string') {
      return new Error(err)
    }

    return new Error(fallback)
  }
}
