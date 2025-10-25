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
}
