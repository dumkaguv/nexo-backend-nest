import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { ResponseFileDto } from '@/modules/file/dto'
import { ResponseUserProfileDto } from '@/modules/user/dto'

@Exclude()
export class ResponseStoryDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Expose()
  previewUrl?: string | null

  @ApiProperty({
    type: () => ResponseUserProfileDto
  })
  @Type(() => ResponseUserProfileDto)
  @Expose()
  user: ResponseUserProfileDto

  @ApiProperty({
    type: () => ResponseFileDto,
    isArray: true,
    nullable: true,
    required: false
  })
  @Type(() => ResponseFileDto)
  @Expose()
  files?: ResponseFileDto[] | null

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    readOnly: true
  })
  @Expose()
  readonly createdAt: Date

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    readOnly: true
  })
  @Expose()
  readonly updatedAt: Date
}
