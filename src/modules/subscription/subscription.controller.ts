import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'

import {
  type AuthRequest,
  EmptyResponseDto,
  FindAllQueryDto
} from '@/common/dtos'
import { sendPaginatedResponse, sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { ResponseSubscriptionCountDto, ResponseSubscriptionDto } from './dto'

import { SubscriptionService } from './subscription.service'

@Controller('subscription')
@Authorization()
@ApiTags('Subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('followers/:id')
  @ApiPaginated(ResponseSubscriptionDto)
  public findAllFollowers(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponseSubscriptionDto>
  ) {
    return sendPaginatedResponse(
      ResponseSubscriptionDto,
      this.subscriptionService.findAllSubscriptions(+id, query)
    )
  }

  @Get('following/:id')
  @ApiPaginated(ResponseSubscriptionDto)
  public findAllFollowing(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponseSubscriptionDto>
  ) {
    return sendPaginatedResponse(
      ResponseSubscriptionDto,
      this.subscriptionService.findAllSubscriptions(+id, query, false)
    )
  }

  @Get('count/:id')
  @ApiOkResponseWrapped(ResponseSubscriptionCountDto)
  public findOneCount(@Param('id') id: string) {
    return sendResponse(
      ResponseSubscriptionCountDto,
      this.subscriptionService.findOneSubscriptionCount(+id)
    )
  }

  @Post('follow/:id')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public follow(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      EmptyResponseDto,
      this.subscriptionService.follow(req.user.id, +id)
    )
  }

  @Post('unfollow/:id')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public unfollow(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      EmptyResponseDto,
      this.subscriptionService.unfollow(req.user.id, +id)
    )
  }

  @Post('unfollow/follower/:id')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public removeFollower(@Req() req: AuthRequest, @Param('id') id: string) {
    return sendResponse(
      EmptyResponseDto,
      this.subscriptionService.removeFollower(req.user.id, +id)
    )
  }
}
