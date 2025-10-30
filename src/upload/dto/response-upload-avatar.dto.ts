import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'

import { ResponseUserDto } from '@/user/dto'

export class ResponseUploadAvatarDto {
  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto
}
