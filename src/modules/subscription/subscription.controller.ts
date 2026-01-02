import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { plainToInstance } from 'class-transformer'

import { ApiOkResponseWrapped, ApiPaginated } from '@/common/decorators'

import type { FindAllQueryDto } from '@/common/dtos'
import { type AuthRequest, EmptyResponseDto } from '@/common/dtos'
import { sendPaginatedResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { ResponseSubscriptionCountDto, ResponseSubscriptionDto } from './dto'

import type { SubscriptionService } from './subscription.service'

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
  @ApiPaginated(ResponseSubscriptionDto)
  async findAllFollowing(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto<ResponseSubscriptionDto>
  ) {
    return sendPaginatedResponse(
      ResponseSubscriptionDto,
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
      await this.subscriptionService.follow(req.user.id, +id)
    )
  }

  @Post('unfollow/:id')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async unfollow(@Req() req: AuthRequest, @Param('id') id: string) {
    return plainToInstance(
      EmptyResponseDto,
      await this.subscriptionService.unfollow(req.user.id, +id)
    )
  }
}
