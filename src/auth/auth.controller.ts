import { Body, Controller, Post, Req, Res } from '@nestjs/common'

import { ApiOkResponseWrapped } from '@/common/decorators'
import { CreateUserDto } from '@/user/dto/create-user.dto'

import { AuthService } from './auth.service'
import { LoginRequestDto } from './dto/login-request.dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { RegisterResponseDto } from './dto/register-response.dto'

import type { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponseWrapped(RegisterResponseDto)
  register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto
  ) {
    return this.authService.register(res, dto)
  }

  @Post('login')
  @ApiOkResponseWrapped(LoginResponseDto)
  login(@Res() res: Response, @Body() dto: LoginRequestDto) {
    return this.authService.login(res, dto)
  }

  @Post('refresh')
  @ApiOkResponseWrapped(LoginResponseDto)
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res)
  }
}
