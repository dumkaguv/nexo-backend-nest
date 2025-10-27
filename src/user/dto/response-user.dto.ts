import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseProfileDto } from '@/profile/dto'
import { ResponseSubscriptionDto } from '@/subscription/dto'

@Exclude()
export class ResponseUserDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'string' })
  @Expose()
  username: string

  @ApiProperty({ type: 'string' })
  @Expose()
  email: string

  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
    readOnly: true
  })
  @Expose()
  readonly activationLink?: string | null

  @ApiProperty({ type: 'boolean', readOnly: true })
  @Expose()
  readonly isActivated: boolean

  @ApiProperty({ type: () => ResponseProfileDto })
  @Expose()
  @Type(() => ResponseProfileDto)
  profile: ResponseProfileDto

  @ApiProperty({
    type: () => ResponseSubscriptionDto,
    isArray: true,
    required: false,
    nullable: true
  })
  @Expose()
  @Type(() => ResponseSubscriptionDto)
  following?: ResponseSubscriptionDto[] | null

  @ApiProperty({
    type: () => ResponseSubscriptionDto,
    isArray: true,
    required: false,
    nullable: true
  })
  @Expose()
  @Type(() => ResponseSubscriptionDto)
  followers?: ResponseSubscriptionDto[] | null

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date
}
