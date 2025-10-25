import { Module } from '@nestjs/common'

import { ProfileModule } from '@/profile/profile.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [ProfileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
