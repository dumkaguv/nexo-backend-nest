import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseUserDto } from '@/user/dto'

@Exclude()
export class ResponseProfileDetailedDto {
  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto
}
