import { NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'

import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { TokenService } from './token.service'

describe('TokenService', () => {
  let service: TokenService
  let prisma: {
    token: {
      findUnique: jest.Mock
      update: jest.Mock
      create: jest.Mock
      findFirstOrThrow: jest.Mock
      delete: jest.Mock
      findUniqueOrThrow: jest.Mock
    }
  }
  let configService: { getOrThrow: jest.Mock }
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock }
  let userService: { findOne: jest.Mock }

  beforeEach(async () => {
    prisma = {
      token: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findFirstOrThrow: jest.fn(),
        delete: jest.fn(),
        findUniqueOrThrow: jest.fn()
      }
    }

    const configValues: Record<string, string> = {
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_TOKEN_TTL: '7d',
      JWT_ACCESS_TOKEN_TTL: '15m'
    }

    configService = {
      getOrThrow: jest.fn((key: string) => configValues[key])
    }
    jwtService = { signAsync: jest.fn(), verifyAsync: jest.fn() }
    userService = { findOne: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: configService },
        { provide: JwtService, useValue: jwtService },
        { provide: UserService, useValue: userService }
      ]
    }).compile()

    service = module.get(TokenService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('generates access and refresh tokens', async () => {
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token')

    await expect(service.generate(7)).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    })
    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      1,
      { id: 7 },
      { secret: 'access-secret', expiresIn: '15m' }
    )
    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      2,
      { id: 7 },
      { secret: 'refresh-secret', expiresIn: '7d' }
    )
  })

  it('updates token when refresh token exists', async () => {
    prisma.token.findUnique.mockResolvedValue({ id: 1, userId: 3 })
    prisma.token.update.mockResolvedValue({ id: 1, refreshToken: 'new' })

    await expect(service.save('new', 3)).resolves.toEqual({
      id: 1,
      refreshToken: 'new'
    })
    expect(prisma.token.update).toHaveBeenCalledWith({
      where: { userId: 3 },
      data: { refreshToken: 'new' }
    })
  })

  it('creates token when missing', async () => {
    prisma.token.findUnique.mockResolvedValue(null)
    prisma.token.create.mockResolvedValue({ id: 2, refreshToken: 'new' })

    await expect(service.save('new', 4)).resolves.toEqual({
      id: 2,
      refreshToken: 'new'
    })
    expect(prisma.token.create).toHaveBeenCalledWith({
      data: { userId: 4, refreshToken: 'new' }
    })
  })

  it('validates refresh token', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 5 })

    await expect(service.validateRefreshToken('token')).resolves.toEqual({
      id: 5
    })
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token', {
      secret: 'refresh-secret'
    })
  })

  it('validates access token', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 6 })

    await expect(service.validateAccessToken('token')).resolves.toEqual({
      id: 6
    })
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token', {
      secret: 'access-secret'
    })
  })

  it('removes refresh token by value', async () => {
    prisma.token.findFirstOrThrow.mockResolvedValue({ id: 9 })
    prisma.token.delete.mockResolvedValue({ id: 9 })

    await expect(service.remove('refresh')).resolves.toBeUndefined()
    expect(prisma.token.delete).toHaveBeenCalledWith({ where: { id: 9 } })
  })

  it('refresh returns tokens and user', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 11 })
    prisma.token.findUniqueOrThrow.mockResolvedValue({
      id: 1,
      userId: 11,
      refreshToken: 'refresh'
    })
    userService.findOne.mockResolvedValue({ id: 11 })
    jest
      .spyOn(service, 'generate')
      .mockResolvedValue({ accessToken: 'a', refreshToken: 'r' })

    await expect(service.refresh('refresh')).resolves.toEqual({
      accessToken: 'a',
      refreshToken: 'r',
      user: { id: 11 }
    })
  })

  it('refresh throws when user is missing', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 12 })
    prisma.token.findUniqueOrThrow.mockResolvedValue({
      id: 2,
      userId: 12,
      refreshToken: 'refresh'
    })
    userService.findOne.mockResolvedValue(null)

    await expect(service.refresh('refresh')).rejects.toBeInstanceOf(
      NotFoundException
    )
  })
})
