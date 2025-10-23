import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

export class SubscriptionUserIdFollowingIdUniqueInputDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  userId: number
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  followingId: number
}

@ApiExtraModels(SubscriptionUserIdFollowingIdUniqueInputDto)
export class ConnectSubscriptionDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false
  })
  id?: number
  @ApiProperty({
    type: SubscriptionUserIdFollowingIdUniqueInputDto,
    required: false
  })
  userId_followingId?: SubscriptionUserIdFollowingIdUniqueInputDto
}
