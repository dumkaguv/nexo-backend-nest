import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ResponseMessageDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly senderId: number

  @ApiProperty({ type: 'integer' })
  @Expose()
  receiverId: number

  @ApiProperty({ type: 'integer', required: false, nullable: true })
  @Expose()
  content?: string | null
}
