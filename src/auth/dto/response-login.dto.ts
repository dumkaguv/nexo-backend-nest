import { ApiProperty } from '@nestjs/swagger'

import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseUserProfileDto } from '@/user/dto'

@Exclude()
export class ResponseLoginDto {
  @ApiProperty({ type: () => ResponseUserProfileDto })
  @Type(() => ResponseUserProfileDto)
  @Expose()
  user: ResponseUserProfileDto

  @ApiProperty({ type: 'string' })
  @Expose()
  accessToken: string
}
