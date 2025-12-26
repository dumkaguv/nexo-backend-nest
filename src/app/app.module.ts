import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'

import { AllExceptionsFilter } from '@/common/filters'
import { ResponseInterceptor } from '@/common/interceptors'
import { AuthModule } from '@/modules/auth/auth.module'
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module'
import { MessageModule } from '@/modules/message/message.module'
import { PostModule } from '@/modules/post/post.module'
import { ProfileModule } from '@/modules/profile/profile.module'
import { SubscriptionModule } from '@/modules/subscription/subscription.module'
import { TokenModule } from '@/modules/token/token.module'
import { UploadModule } from '@/modules/upload/upload.module'
import { UserModule } from '@/modules/user/user.module'
import { PrismaModule } from '@/prisma/prisma.module'

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
    CloudinaryModule,
    MessageModule,
    SubscriptionModule
  ],
  controllers: [AppController],
  providers: [ResponseInterceptor, AllExceptionsFilter]
})
export class AppModule {}
