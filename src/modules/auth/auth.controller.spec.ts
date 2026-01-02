import { Test, TestingModule } from '@nestjs/testing'


import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import {
  ResponseLoginDto,
  ResponseRefreshDto,
  ResponseRegisterDto
} from './dto'

import type { Request, Response } from 'express'

describe('AuthController', () => {
  let controller: AuthController
  let authService: {
    register: jest.Mock
    login: jest.Mock
    logout: jest.Mock
    refresh: jest.Mock
  }

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refresh: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }]
    }).compile()

    controller = module.get(AuthController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('register returns ResponseRegisterDto', async () => {
    const res = {} as Response

    authService.register.mockResolvedValue({
      user: { id: 1 },
      accessToken: 'access'
    })

    const result = await controller.register(res, {
      email: 'neo@example.com',
      username: 'neo',
      fullName: 'Neo',
      password: 'secret'
    })

    expect(authService.register).toHaveBeenCalledWith(res, {
      email: 'neo@example.com',
      username: 'neo',
      fullName: 'Neo',
      password: 'secret'
    })
    expect(result).toBeInstanceOf(ResponseRegisterDto)
  })

  it('login returns ResponseLoginDto', async () => {
    const res = {} as Response

    authService.login.mockResolvedValue({
      user: { id: 2 },
      accessToken: 'access'
    })

    const result = await controller.login(res, {
      email: 'neo@example.com',
      password: 'secret'
    })

    expect(authService.login).toHaveBeenCalledWith(res, {
      email: 'neo@example.com',
      password: 'secret'
    })
    expect(result).toBeInstanceOf(ResponseLoginDto)
  })

  it('logout clears cookie and returns EmptyResponseDto', async () => {
    const res = { clearCookie: jest.fn() } as unknown as Response
    const req = { cookies: { refreshToken: 'refresh' } } as unknown as Request

    authService.logout.mockResolvedValue(undefined)

    const result = await controller.logout(req as never, res)

    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken')
    expect(authService.logout).toHaveBeenCalledWith('refresh')
    expect(result).toBeUndefined()
  })

  it('refresh returns ResponseRefreshDto', async () => {
    const res = {} as Response
    const req = {} as Request

    authService.refresh.mockResolvedValue({ accessToken: 'access' })

    const result = await controller.refresh(req, res)

    expect(authService.refresh).toHaveBeenCalledWith(req, res)
    expect(result).toBeInstanceOf(ResponseRefreshDto)
  })
})
