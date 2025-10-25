import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/auth/auth.module'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { AllExceptionsFilter } from '@/common/filters'
import { ResponseInterceptor } from '@/common/interceptors'
import { PostModule } from '@/post/post.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { ProfileModule } from '@/profile/profile.module'
import { TokenModule } from '@/token/token.module'
import { UploadModule } from '@/upload/upload.module'
import { UserModule } from '@/user/user.module'

import { AppController } from './app.controller'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    TokenModule,
    UserModule,
    ProfileModule,
    PostModule,
    UploadModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [ResponseInterceptor, AllExceptionsFilter]
})
export class AppModule {}
