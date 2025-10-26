import { Body, Controller, Get, Patch, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UpdateProfileDto } from 'prisma/swagger/models/update-profile.dto'

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped } from '@/common/decorators'
import { type AuthRequest } from '@/common/dtos'

import { UserResponseWithRelationsDto } from '@/user/dto'

import { ProfileService } from './profile.service'

@Controller('profile')
@Authorization()
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOkResponseWrapped(UserResponseWithRelationsDto)
  me(@Req() req: AuthRequest) {
    const userId = req.user.id

    return this.profileService.findOne(userId)
  }

  @Patch()
  @ApiOkResponseWrapped(UpdateProfileDto)
  update(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    const userId = req.user.id

    return this.profileService.update(+userId, dto)
  }
}
