import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ResponseMessageFileDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'string' })
  @Expose()
  url: string

  @ApiProperty({ type: 'string', required: false, nullable: true })
  @Expose()
  type?: string | null

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  @Expose()
  readonly uploadedAt?: Date | null
}
