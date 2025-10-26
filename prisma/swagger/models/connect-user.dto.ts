import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

export class UserUsernameEmailUniqueInputDto {
  @ApiProperty({
    type: 'string'
  })
  username: string
  @ApiProperty({
    type: 'string'
  })
  email: string
}

@ApiExtraModels(UserUsernameEmailUniqueInputDto)
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
  username?: string
  @ApiProperty({
    type: 'string',
    required: false
  })
  email?: string
  @ApiProperty({
    type: UserUsernameEmailUniqueInputDto,
    required: false
  })
  username_email?: UserUsernameEmailUniqueInputDto
}
