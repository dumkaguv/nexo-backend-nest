import { ApiProperty } from '@nestjs/swagger'

import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseUserDto } from '@/user/dto'

@Exclude()
export class ResponseRegisterDto {
  @ApiProperty({ type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  @Expose()
  user: ResponseUserDto

  @ApiProperty({ type: 'string' })
  @Expose()
  accessToken: string
}
