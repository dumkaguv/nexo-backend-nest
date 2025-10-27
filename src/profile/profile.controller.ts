import { Body, Controller, Get, Patch, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped } from '@/common/decorators'

import type { AuthRequest } from '@/common/dtos'

import {
  ResponseProfileDetailedDto,
  ResponseProfileDto,
  UpdateProfileDto
} from './dto'
import { ProfileService } from './profile.service'

@Controller('profile')
@Authorization()
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOkResponseWrapped(ResponseProfileDto)
  async me(@Req() req: AuthRequest) {
    return plainToInstance(
      ResponseProfileDto,
      await this.profileService.findOne(req.user.id)
    )
  }

  @Get('me/detailed')
  @ApiOkResponseWrapped(ResponseProfileDetailedDto)
  async meDetailed(@Req() req: AuthRequest) {
    return plainToInstance(
      ResponseProfileDto,
      await this.profileService.findOne(req.user.id)
    )
  }

  @Patch()
  @ApiOkResponseWrapped(ResponseProfileDto)
  async update(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    return plainToInstance(
      ResponseProfileDto,
      await this.profileService.update(req.user.id, dto)
    )
  }
}
