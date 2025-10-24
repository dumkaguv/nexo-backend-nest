import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AllExceptionsFilter } from './common/filters'
import { ResponseInterceptor } from './common/interceptors'
import { PostModule } from './post/post.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PostModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
  ],
  controllers: [AppController],
  providers: [AppService, ResponseInterceptor, AllExceptionsFilter]
})
export class AppModule {}
