import { Body, Controller, Post, Req, Res } from '@nestjs/common'

import { ApiOperation } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'

import { ApiOkResponseWrapped } from '@/common/decorators'
import { type AuthRequest, EmptyResponseDto } from '@/common/dtos'
import type { CreateUserDto } from '@/modules/user/dto'

import {
  ResponseLoginDto,
  ResponseRefreshDto,
  ResponseRegisterDto
} from './dto'

import type { AuthService } from './auth.service'

import type { CreateLoginDto } from './dto'

import type { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponseWrapped(ResponseRegisterDto)
  @ApiOperation({
    description: `Validation pattern for password:
    \`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>/?]).{8,}$/\``
  })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto
  ) {
    return plainToInstance(
      ResponseRegisterDto,
      await this.authService.register(res, dto)
    )
  }

  @Post('login')
  @ApiOkResponseWrapped(ResponseLoginDto)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateLoginDto
  ) {
    return plainToInstance(
      ResponseLoginDto,
      await this.authService.login(res, dto)
    )
  }

  @Post('logout')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async logout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken } = req.cookies

    res.clearCookie('refreshToken')

    return plainToInstance(
      EmptyResponseDto,
      await this.authService.logout(refreshToken)
    )
  }

  @Post('refresh')
  @ApiOkResponseWrapped(ResponseRefreshDto)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return plainToInstance(
      ResponseRefreshDto,
      await this.authService.refresh(req, res)
    )
  }
}
