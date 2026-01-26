import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseFileDto } from '@/modules/file/dto'

@Exclude()
export class ResponsePostFileDto {
  @ApiProperty({
    type: () => ResponseFileDto
  })
  @Type(() => ResponseFileDto)
  @Expose()
  file: ResponseFileDto
}
