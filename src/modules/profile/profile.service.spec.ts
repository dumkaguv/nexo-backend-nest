import { Test, TestingModule } from '@nestjs/testing'

import { FileService } from '@/modules/file/file.service'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

import { ProfileService } from './profile.service'

describe('ProfileService', () => {
  let service: ProfileService
  let prisma: { profile: { create: jest.Mock; update: jest.Mock } }
  let userService: { findOne: jest.Mock; findOneWithRelations: jest.Mock }
  let fileService: { findOneForUser: jest.Mock }

  beforeEach(async () => {
    prisma = { profile: { create: jest.fn(), update: jest.fn() } }
    userService = { findOne: jest.fn(), findOneWithRelations: jest.fn() }
    fileService = { findOneForUser: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: prisma },
        { provide: UserService, useValue: userService },
        { provide: FileService, useValue: fileService }
      ]
    }).compile()

    service = module.get(ProfileService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('findOne delegates to user service', async () => {
    userService.findOne.mockResolvedValue({ id: 1 })

    await expect(service.findOne(1)).resolves.toEqual({ id: 1 })
    expect(userService.findOne).toHaveBeenCalledWith(1)
  })

  it('findOneDetailed wraps user with relations', async () => {
    userService.findOneWithRelations.mockResolvedValue({ id: 2 })

    await expect(service.findOneDetailed(2)).resolves.toEqual({
      user: { id: 2 }
    })
    expect(userService.findOneWithRelations).toHaveBeenCalledWith(2)
  })

  it('creates profile for user', async () => {
    prisma.profile.create.mockResolvedValue({ id: 3 })

    await expect(service.create(3, 'Neo')).resolves.toEqual({ id: 3 })
    expect(prisma.profile.create).toHaveBeenCalledWith({
      data: { userId: 3, fullName: 'Neo' }
    })
  })

  it('updates profile without avatar', async () => {
    prisma.profile.update.mockResolvedValue({ id: 4 })

    await expect(service.update(4, { biography: 'bio' })).resolves.toEqual({
      id: 4
    })
    expect(fileService.findOneForUser).not.toHaveBeenCalled()
    expect(prisma.profile.update).toHaveBeenCalledWith({
      data: { biography: 'bio', avatar: { disconnect: true } },
      where: { userId: 4 }
    })
  })

  it('updates profile with avatar', async () => {
    fileService.findOneForUser.mockResolvedValue({ id: 10 })
    prisma.profile.update.mockResolvedValue({ id: 5 })

    await expect(service.update(5, { avatar: 10 })).resolves.toEqual({ id: 5 })
    expect(fileService.findOneForUser).toHaveBeenCalledWith(10, 5)
    expect(prisma.profile.update).toHaveBeenCalledWith({
      data: { avatar: { connect: { id: 10 } } },
      where: { userId: 5 }
    })
  })
})
