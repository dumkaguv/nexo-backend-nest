import { forwardRef, Module } from '@nestjs/common'

import { TokenModule } from '@/modules/token/token.module'

import { UserController } from './user.controller'
import { UserGateway } from './user.gateway'
import { UserService } from './user.service'

@Module({
  imports: [forwardRef(() => TokenModule)],
  controllers: [UserController],
  providers: [UserService, UserGateway],
  exports: [UserService]
})
export class UserModule {}
