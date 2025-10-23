import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

export class UserUserNameEmailUniqueInputDto {
  @ApiProperty({
    type: 'string'
  })
  userName: string
  @ApiProperty({
    type: 'string'
  })
  email: string
}

@ApiExtraModels(UserUserNameEmailUniqueInputDto)
export class ConnectUserDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false
  })
  id?: number
  @ApiProperty({
    type: 'string',
    required: false
  })
  userName?: string
  @ApiProperty({
    type: 'string',
    required: false
  })
  email?: string
  @ApiProperty({
    type: UserUserNameEmailUniqueInputDto,
    required: false
  })
  userName_email?: UserUserNameEmailUniqueInputDto
}
