import { Body, Controller, Post, Req, Res } from '@nestjs/common'

import { ApiOkResponseWrapped } from '@/common/decorators'
import { EmptyResponseDto } from '@/common/dtos'
import { CreateUserDto } from '@/user/dto/create-user.dto'

import { AuthService } from './auth.service'
import { LoginRequestDto } from './dto/login-request.dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { RefreshResponseDto } from './dto/refresh-response.dto'
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
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequestDto
  ) {
    return this.authService.login(res, dto)
  }

  @Post('logout')
  @ApiOkResponseWrapped(EmptyResponseDto)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res)
  }

  @Post('refresh')
  @ApiOkResponseWrapped(RefreshResponseDto)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res)
  }
}
