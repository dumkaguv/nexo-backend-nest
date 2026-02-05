import { Test, TestingModule } from '@nestjs/testing'

import { ResponseUserDto } from './dto'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController
  let userService: {
    findAll: jest.Mock
    findOneWithRelations: jest.Mock
    update: jest.Mock
    changePassword: jest.Mock
    remove: jest.Mock
  }

  beforeEach(async () => {
    userService = {
      findAll: jest.fn(),
      findOneWithRelations: jest.fn(),
      update: jest.fn(),
      changePassword: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }]
    }).compile()

    controller = module.get(UserController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findAll returns paginated response', async () => {
    userService.findAll.mockResolvedValue({
      data: [{ id: 1, username: 'neo', email: 'neo@example.com' }],
      total: 1
    })

    const result = (await controller.findAll(
      { user: { id: 7 } } as never,
      { page: 1 } as never
    )) as { data: ResponseUserDto[]; total: number }

    expect(userService.findAll).toHaveBeenCalledWith({ page: 1 }, 7)
    expect(result.total).toBe(1)
    expect(result.data[0]).toBeInstanceOf(ResponseUserDto)
  })

  it('findOne returns a ResponseUserDto', async () => {
    userService.findOneWithRelations.mockResolvedValue({
      id: 1,
      username: 'neo',
      email: 'neo@example.com'
    })

    const result = await controller.findOne({ user: { id: 1 } } as never, '1')

    expect(userService.findOneWithRelations).toHaveBeenCalledWith(1, 1)
    expect(result).toBeInstanceOf(ResponseUserDto)
  })

  it('update returns a ResponseUserDto', async () => {
    userService.update.mockResolvedValue({
      id: 2,
      username: 'trinity',
      email: 'tri@example.com'
    })

    const result = await controller.update({ user: { id: 2 } } as never, '2', {
      username: 'trinity'
    })

    expect(userService.update).toHaveBeenCalledWith(2, {
      username: 'trinity'
    })
    expect(result).toBeInstanceOf(ResponseUserDto)
  })

  it('changePassword forwards passwords and returns user', async () => {
    userService.changePassword.mockResolvedValue({
      id: 3,
      username: 'morpheus',
      email: 'm@example.com'
    })

    const result = await controller.changePassword(
      { user: { id: 3 } } as never,
      '3',
      {
        oldPassword: 'old',
        newPassword: 'new'
      }
    )

    expect(userService.changePassword).toHaveBeenCalledWith(3, 'old', 'new')
    expect(result).toBeInstanceOf(ResponseUserDto)
  })

  it('remove delegates to service', async () => {
    userService.remove.mockResolvedValue({ id: 4 })

    await expect(
      controller.remove({ user: { id: 4 } } as never, '4')
    ).resolves.toEqual({ id: 4 })
    expect(userService.remove).toHaveBeenCalledWith(4)
  })
})
