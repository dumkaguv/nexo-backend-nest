import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import ms, { type StringValue } from 'ms'

import { isDev } from '@/common/utils'
import { TokenService } from '@/modules/token/token.service'

import { CreateUserDto } from '@/modules/user/dto'
import { UserService } from '@/modules/user/user.service'

import { CreateLoginDto } from './dto'

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
    const { id } = await this.userService.create(dto)
    const userAndAccessToken = await this.auth(res, id)

    return userAndAccessToken
  }

  async login(res: Response, dto: CreateLoginDto) {
    const { email, password } = dto
    const user = await this.userService.comparePasswords(password, email)

    return await this.auth(res, user.id)
  }

  async logout(refreshToken: string) {
    const userId = await this.tokenService.remove(refreshToken)

    await this.userService.updateLastActivity(userId)
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

    let user

    if (returnUser) {
      user = await this.userService.findOneWithRelations(id)
    }

    this.setCookie(res, refreshToken, this.JWT_REFRESH_TTL)

    return { user, accessToken }
  }

  private setCookie(res: Response, token: string, ttl: StringValue | string) {
    const expires = new Date(Date.now() + ms(ttl as StringValue))
    const maxAge = ms(ttl as StringValue) as number
    const url = new URL(this.FRONT_URL)

    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      maxAge,
      expires,
      secure: !isDev(this.configService),
      sameSite: 'lax',
      domain: url.hostname
    })
  }
}
