import { Injectable } from '@nestjs/common'

import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import type { AuthService } from '@/modules/auth/auth.service'
import type { JwtPayload } from '@/modules/auth/types'

import type { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      algorithms: ['HS256']
    })
  }

  async validate(payload: JwtPayload) {
    return this.authService.validate(payload.id)
  }
}
