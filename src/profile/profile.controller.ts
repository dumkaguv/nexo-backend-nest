import { Controller, Get, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped } from '@/common/decorators'
import { type AuthRequest } from '@/common/dtos'

import { ProfileResponseDto } from './dto/profile-response.dto'
import { ProfileService } from './profile.service'

@Controller('profile')
@Authorization()
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOkResponseWrapped(ProfileResponseDto)
  findOne(@Req() req: AuthRequest) {
    const userId = req.user.id

    return this.profileService.findOne(userId)
  }
}
