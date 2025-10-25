import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(100)
  @ApiProperty({ type: 'string' })
  email: string

  @IsString()
  @Length(2, 255)
  @ApiProperty({ type: 'string' })
  userName: string

  @IsString()
  @Length(2, 255)
  @ApiProperty({ type: 'string' })
  fullName: string

  @IsString()
  @Length(8, 255)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    {
      message:
        'Password must contain at least 8 symbols, one upper case letter, one lower case letter, one digit and one special symbol'
    }
  )
  @ApiProperty({ type: 'string' })
  password: string
}
