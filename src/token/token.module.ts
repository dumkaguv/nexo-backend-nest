import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '@/auth/auth.module'

import { UserModule } from '@/user/user.module'

import { TokenController } from './token.controller'
import { TokenService } from './token.service'

@Module({
  imports: [forwardRef(() => AuthModule), UserModule],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
