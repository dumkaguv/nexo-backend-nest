import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ResponsePostCommentDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly postId: number

  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly userId: number

  @ApiProperty({ type: 'string' })
  @Expose()
  content: string

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly createdAt: Date
}
