import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { isDev } from '@/common/utils'
import { TokenService } from '@/modules/token/token.service'
import { UserService } from '@/modules/user/user.service'

import { AuthService } from './auth.service'

import type { Request, Response } from 'express'

jest.mock('@/common/utils', () => ({
  isDev: jest.fn()
}))

describe('AuthService', () => {
  let service: AuthService
  let configService: { getOrThrow: jest.Mock }
  let userService: {
    create: jest.Mock
    comparePasswords: jest.Mock
    findOne: jest.Mock
    findOneWithRelations: jest.Mock
    updateLastActivity: jest.Mock
  }
  let tokenService: {
    generate: jest.Mock
    save: jest.Mock
    remove: jest.Mock
    refresh: jest.Mock
  }
  let res: Response

  beforeEach(async () => {
    const configValues: Record<string, string> = {
      JWT_REFRESH_TOKEN_TTL: '7d',
      FRONT_URL: 'https://example.com'
    }

    configService = {
      getOrThrow: jest.fn((key: string) => configValues[key])
    }
    userService = {
      create: jest.fn(),
      comparePasswords: jest.fn(),
      findOne: jest.fn(),
      findOneWithRelations: jest.fn(),
      updateLastActivity: jest.fn()
    }
    tokenService = {
      generate: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      refresh: jest.fn()
    }
    res = { cookie: jest.fn() } as unknown as Response

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configService },
        { provide: UserService, useValue: userService },
        { provide: TokenService, useValue: tokenService }
      ]
    }).compile()

    service = module.get(AuthService)
    ;(isDev as jest.Mock).mockReturnValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('register creates user and returns tokens with user', async () => {
    userService.create.mockResolvedValue({ id: 1 })
    tokenService.generate.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh'
    })
    tokenService.save.mockResolvedValue({ id: 1 })
    userService.findOneWithRelations.mockResolvedValue({ id: 1 })

    await expect(
      service.register(res, {
        email: 'neo@example.com',
        username: 'neo',
        fullName: 'Neo',
        password: 'secret'
      })
    ).resolves.toEqual({
      user: { id: 1 },
      accessToken: 'access'
    })
    expect(tokenService.save).toHaveBeenCalledWith('refresh', 1)
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'refresh',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        domain: 'example.com',
        maxAge: expect.any(Number),
        expires: expect.any(Date)
      })
    )
  })

  it('login validates credentials and returns tokens', async () => {
    userService.comparePasswords.mockResolvedValue({ id: 2 })
    tokenService.generate.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh'
    })
    tokenService.save.mockResolvedValue({ id: 2 })
    userService.findOneWithRelations.mockResolvedValue({ id: 2 })

    await expect(
      service.login(res, { email: 'neo@example.com', password: 'secret' })
    ).resolves.toEqual({
      user: { id: 2 },
      accessToken: 'access'
    })
    expect(userService.comparePasswords).toHaveBeenCalledWith(
      'secret',
      'neo@example.com'
    )
  })

  it('logout removes refresh token', async () => {
    tokenService.remove.mockResolvedValue(1)
    userService.updateLastActivity.mockResolvedValue(undefined)

    await expect(service.logout('refresh')).resolves.toBeUndefined()
    expect(tokenService.remove).toHaveBeenCalledWith('refresh')
    expect(userService.updateLastActivity).toHaveBeenCalledWith(1)
  })

  it('refresh throws when cookie is missing', async () => {
    const req = { cookies: {} } as Request

    await expect(service.refresh(req, res)).rejects.toBeInstanceOf(
      UnauthorizedException
    )
  })

  it('refresh returns access token and sets cookie', async () => {
    const req = { cookies: { refreshToken: 'refresh' } } as unknown as Request

    tokenService.refresh.mockResolvedValue({ user: { id: 3 } })
    tokenService.generate.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'new-refresh'
    })
    tokenService.save.mockResolvedValue({ id: 3 })

    await expect(service.refresh(req, res)).resolves.toEqual({
      user: null,
      accessToken: 'access'
    })
    expect(tokenService.generate).toHaveBeenCalledWith(3)
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'new-refresh',
      expect.objectContaining({
        httpOnly: true,
        secure: false
      })
    )
  })

  it('validate returns user by id', async () => {
    userService.findOne.mockResolvedValue({ id: 4 })

    await expect(service.validate(4)).resolves.toEqual({ id: 4 })
  })
})
