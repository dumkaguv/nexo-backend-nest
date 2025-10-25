import { Body, Controller, Post, Req, Res } from '@nestjs/common'

import { ApiOkResponseWrapped } from '@/common/decorators'
import { type AuthRequest, EmptyResponseDto } from '@/common/dtos'
import { CreateUserDto } from '@/user/dto'

import { AuthService } from './auth.service'
import { LoginRequestDto, LoginResponseDto, RefreshResponseDto } from './dto'

import type { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponseWrapped(LoginResponseDto)
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
  logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies
    res.clearCookie('refreshToken')

    return this.authService.logout(refreshToken)
  }

  @Post('refresh')
  @ApiOkResponseWrapped(RefreshResponseDto)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res)
  }
}
