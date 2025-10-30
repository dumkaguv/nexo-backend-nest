import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { plainToInstance } from 'class-transformer'

import { Authorization } from '@/auth/decorators'

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'

import {
  type AuthRequest,
  EmptyResponseDto,
  FindAllQueryDto
} from '@/common/dtos'
import { sendPaginatedResponse } from '@/common/utils'

import {
  ResponseSubscriptionCountDto,
  ResponseSubscriptionDto,
  ResponseSubscriptionFollowingDto
} from './dto'
import { SubscriptionService } from './subscription.service'

@Controller('subscription')
@Authorization()
@ApiTags('Subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('followers/:id')
  @ApiPaginated(ResponseSubscriptionDto)
  async findAllFollowers(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponseSubscriptionDto>
  ) {
    return sendPaginatedResponse(
      ResponseSubscriptionDto,
      await this.subscriptionService.findAllSubscriptions(+id, query)
    )
  }

  @Get('following/:id')
  @ApiPaginated(ResponseSubscriptionFollowingDto)
  async findAllFollowing(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponseSubscriptionFollowingDto>
  ) {
    return sendPaginatedResponse(
      ResponseSubscriptionFollowingDto,
      await this.subscriptionService.findAllSubscriptions(+id, query, false)
    )
  }

  @Get('count/:id')
  @ApiOkResponseWrapped(ResponseSubscriptionCountDto)
  async findOneCount(@Param('id') id: string) {
    return plainToInstance(
      ResponseSubscriptionCountDto,
      await this.subscriptionService.findOneSubscriptionCount(+id)
    )
  }

  @Post('follow/:id')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async follow(@Req() req: AuthRequest, @Param('id') id: string) {
    return plainToInstance(
      EmptyResponseDto,
      await this.subscriptionService.follow(+id, req.user.id)
    )
  }

  @Post('unfollow/:id')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async unfollow(@Req() req: AuthRequest, @Param('id') id: string) {
    return plainToInstance(
      EmptyResponseDto,
      await this.subscriptionService.unfollow(+id, req.user.id)
    )
  }
}
