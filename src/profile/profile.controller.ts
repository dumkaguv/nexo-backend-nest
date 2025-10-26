import { Body, Controller, Get, Patch, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped } from '@/common/decorators'
import { type AuthRequest } from '@/common/dtos'

import { UserResponseWithRelationsDto } from '@/user/dto'

import { UpdatePayloadProfileDto } from './dto/update-payload-profile.dto'
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
  @ApiOkResponseWrapped(UpdatePayloadProfileDto)
  update(@Req() req: AuthRequest, @Body() dto: UpdatePayloadProfileDto) {
    const userId = req.user.id
    console.log(dto)

    return this.profileService.update(+userId, dto)
  }
}
