import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

import { JwtService } from '@nestjs/jwt'

import { compareSync } from 'bcrypt'

import ms, { type StringValue } from 'ms'

import { isDev } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserDto } from '@/user/dto/create-user.dto'

import { UserService } from '@/user/user.service'

import { LoginRequestDto } from './dto/login-request.dto'

import type { JwtPayload } from './types'
import type { Request, Response } from 'express'

@Injectable()
export class AuthService {
  private readonly JWT_REFRESH_SECRET: string
  private readonly JWT_ACCESS_SECRET: string
  private readonly JWT_REFRESH_TTL: string
  private readonly JWT_ACCESS_TTL: string

  private readonly FRONT_URL: string

  private readonly REFRESH_TOKEN_COOKIE_NAME: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {
    this.JWT_REFRESH_SECRET =
      configService.getOrThrow<string>('JWT_REFRESH_SECRET')
    this.JWT_ACCESS_SECRET =
      configService.getOrThrow<string>('JWT_ACCESS_SECRET')
    this.JWT_REFRESH_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL'
    )
    this.JWT_ACCESS_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL'
    )

    this.FRONT_URL = configService.getOrThrow<string>('FRONT_URL')

    this.REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'
  }

  async register(res: Response, dto: CreateUserDto) {
    const user = await this.userService.create(dto)
    const accessToken = await this.auth(res, user.id)

    return { user, accessToken }
  }

  async login(res: Response, dto: LoginRequestDto) {
    const { email, password } = dto

    const user = await this.prisma.user.findUniqueOrThrow({
      select: { id: true, password: true },
      where: { email }
    })

    const isValidPassword = compareSync(password, user.password)
    if (!isValidPassword) {
      throw new NotFoundException()
    }

    return await this.auth(res, user.id)
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE_NAME]
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not valid')
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken)
    if (payload) {
      const user = await this.userService.findOne(Number(payload.id))

      return this.auth(res, user.id)
    }
  }

  private async auth(res: Response, id: number) {
    const { accessToken, refreshToken } = await this.generateTokens(String(id))

    this.setCookie(res, refreshToken, this.JWT_REFRESH_TTL)

    return accessToken
  }

  private async generateTokens(userId: string) {
    const payload: JwtPayload = { id: userId }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: this.JWT_ACCESS_TTL as '2h'
    })

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: this.JWT_REFRESH_TTL as '7d'
    })

    return { accessToken, refreshToken }
  }

  private setCookie(res: Response, token: string, ttl: StringValue | string) {
    const expires = new Date(Date.now() + ms(ttl as StringValue))

    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      domain: this.FRONT_URL,
      expires: expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax'
    })
  }
}
