import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreatePayloadPostDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  content: string
}
