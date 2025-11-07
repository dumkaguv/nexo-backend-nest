import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ResponseUploadDto {
  @ApiProperty({ type: 'integer', readOnly: true })
  @Expose()
  readonly id: number

  @ApiProperty({ type: 'string' })
  @Expose()
  secure_url: string

  @ApiProperty({ type: 'string' })
  @Expose()
  type: string
}
