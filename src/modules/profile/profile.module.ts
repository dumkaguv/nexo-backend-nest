import { Module } from '@nestjs/common'

import { FileModule } from '@/modules/file/file.module'
import { UserModule } from '@/modules/user/user.module'

import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
  imports: [UserModule, FileModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
