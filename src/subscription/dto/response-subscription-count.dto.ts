import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ResponseSubscriptionCountDto {
  @ApiProperty({ type: 'integer' })
  @Expose()
  followers: number

  @ApiProperty({ type: 'integer' })
  @Expose()
  following: number
}
