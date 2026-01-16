import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import { ResponseUserProfileDto } from './'

@Exclude()
export class ResponseUserProfileIsFollowingDto extends ResponseUserProfileDto {
  @ApiProperty({ type: 'boolean', readOnly: true })
  @Expose()
  isFollowing: boolean
}
