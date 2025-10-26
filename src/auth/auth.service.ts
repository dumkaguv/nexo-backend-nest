import { Injectable, UnauthorizedException } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

import { User } from '@prisma/client'
import ms, { type StringValue } from 'ms'

import { isDev } from '@/common/utils'
import { TokenService } from '@/token/token.service'
import { CreateUserDto } from '@/user/dto'

import { UserService } from '@/user/user.service'

import { LoginRequestDto } from './dto'

import type { Request, Response } from 'express'

@Injectable()
export class AuthService {
  private readonly JWT_REFRESH_TTL: string
  private readonly FRONT_URL: string
  private readonly REFRESH_TOKEN_COOKIE_NAME: string

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {
    this.JWT_REFRESH_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL'
    )
    this.FRONT_URL = configService.getOrThrow<string>('FRONT_URL')
    this.REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'
  }

  async register(res: Response, dto: CreateUserDto) {
    const userWithProfile = await this.userService.create(dto)
    const { accessToken } = await this.auth(res, userWithProfile.id)

    return { ...userWithProfile, accessToken }
  }

  async login(res: Response, dto: LoginRequestDto) {
    const { email, password } = dto
    const user = await this.userService.comparePasswords(password, email)

    return this.auth(res, user.id)
  }

  logout(refreshToken: string) {
    this.tokenService.remove(refreshToken)
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE_NAME] as
      | string
      | undefined
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not valid')
    }

    const {
      user: { id }
    } = await this.tokenService.refresh(refreshToken)

    if (id) {
      return this.auth(res, id, false)
    }
  }

  validate(id: number) {
    return this.userService.findOne(id)
  }

  private async auth(res: Response, id: number, returnUser: boolean = true) {
    const { accessToken, refreshToken } = await this.tokenService.generate(id)
    await this.tokenService.save(refreshToken, id)

    let user: Omit<User, 'password'> | undefined = undefined
    if (returnUser) {
      user = await this.userService.findOne(id)
    }

    this.setCookie(res, refreshToken, this.JWT_REFRESH_TTL)

    return { user, accessToken }
  }

  private setCookie(res: Response, token: string, ttl: StringValue | string) {
    const expires = new Date(Date.now() + ms(ttl as StringValue))
    const url = new URL(this.FRONT_URL)

    res.cookie('refreshToken', token, {
      httpOnly: true,
      domain: url.hostname,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax'
    })
  }
}
