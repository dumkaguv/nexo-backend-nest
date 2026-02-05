import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { compareSync, hashSync } from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'

import { paginate } from '@/common/utils'
import { PrismaService } from '@/prisma/prisma.service'

import { includeUserWithRelations } from './constants'
import { UserService } from './user.service'

jest.mock('@/common/utils', () => ({
  paginate: jest.fn()
}))
jest.mock('bcrypt', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn()
}))
jest.mock('uuid', () => ({
  v4: jest.fn()
}))

describe('UserService', () => {
  let service: UserService
  let prisma: {
    user: {
      findFirst: jest.Mock
      create: jest.Mock
      findFirstOrThrow: jest.Mock
      update: jest.Mock
      delete: jest.Mock
    }
    subscription: {
      findMany: jest.Mock
      count: jest.Mock
    }
  }

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findFirstOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      subscription: {
        findMany: jest.fn(),
        count: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prisma
        }
      ]
    }).compile()

    service = module.get(UserService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('creates a user with hashed password and activation link', async () => {
    const dto = {
      username: 'neo',
      fullName: 'Neo Anderson',
      email: 'neo@example.com',
      password: 'secret'
    }
    const createdUser = {
      id: 1,
      username: dto.username,
      email: dto.email,
      password: 'hashed',
      activationLink: 'uuid',
      profile: { fullName: dto.fullName }
    }

    prisma.user.findFirst.mockResolvedValue(null)
    ;(hashSync as jest.Mock).mockReturnValue('hashed')
    ;(uuidV4 as jest.Mock).mockReturnValue('uuid')
    prisma.user.create.mockResolvedValue(createdUser)

    await expect(service.create(dto)).resolves.toEqual({
      ...createdUser,
      followingCount: 0,
      followersCount: 0
    })
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { OR: [{ email: dto.email }, { username: dto.username }] }
    })
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: dto.username,
        email: dto.email,
        password: 'hashed',
        activationLink: 'uuid',
        profile: { create: { fullName: dto.fullName } }
      },
      include: includeUserWithRelations
    })
  })

  it('throws when user already exists on create', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 1 })

    await expect(
      service.create({
        username: 'neo',
        fullName: 'Neo Anderson',
        email: 'neo@example.com',
        password: 'secret'
      })
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('returns following ids as a set', async () => {
    prisma.subscription.findMany.mockResolvedValue([
      { followingId: 2 },
      { followingId: 3 }
    ])

    await expect(service.findFollowingUserIds(1)).resolves.toEqual(
      new Set([2, 3])
    )
    expect(prisma.subscription.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      select: { followingId: true }
    })
  })

  it('findAll delegates to paginate and sets isFollowing', async () => {
    prisma.subscription.findMany.mockResolvedValue([
      { followingId: 2 },
      { followingId: 5 }
    ])
    ;(paginate as jest.Mock).mockResolvedValue({
      data: [{ id: 2 }, { id: 5 }],
      total: 2
    })

    const result = await service.findAll({ page: 1 }, 1)

    expect(paginate).toHaveBeenCalledTimes(1)
    const paginateArgs = (paginate as jest.Mock).mock.calls[0][0]

    expect(paginateArgs.where).toEqual({ id: { not: 1 } })
    expect(paginateArgs.computed.isFollowing({ id: 2 })).toBe(true)
    expect(paginateArgs.computed.isFollowing({ id: 3 })).toBe(false)
    expect(result).toEqual({ data: [{ id: 2 }, { id: 5 }], total: 2 })
  })

  it('findOne returns user with followers and following counts', async () => {
    const user = { id: 7, username: 'neo' }

    prisma.user.findFirstOrThrow.mockResolvedValue(user)
    prisma.subscription.count.mockResolvedValueOnce(11).mockResolvedValueOnce(3)

    await expect(service.findOne(7)).resolves.toEqual({
      ...user,
      followingCount: 11,
      followersCount: 3,
      isFollowing: false
    })
    expect(prisma.user.findFirstOrThrow).toHaveBeenCalledWith({
      include: { profile: { include: { avatar: true } } },
      where: { id: 7 }
    })
  })

  it('findOneWithRelations returns user with relation counts', async () => {
    const user = { id: 9, username: 'trinity' }

    prisma.user.findFirstOrThrow.mockResolvedValue(user)
    prisma.subscription.count.mockResolvedValueOnce(1).mockResolvedValueOnce(2)

    await expect(service.findOneWithRelations(9)).resolves.toEqual({
      ...user,
      followingCount: 1,
      followersCount: 2,
      isFollowing: false
    })
    expect(prisma.user.findFirstOrThrow).toHaveBeenCalledWith({
      include: includeUserWithRelations,
      where: { id: 9 }
    })
  })

  it('update writes data and returns user with relations', async () => {
    const updated = { id: 5, username: 'smith' }

    prisma.user.update.mockResolvedValue(updated)
    jest
      .spyOn(service, 'findOneWithRelations')
      .mockResolvedValue(updated as never)

    await expect(service.update(5, { username: 'smith' })).resolves.toEqual(
      updated
    )
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { username: 'smith' }
    })
  })

  it('removes a user by id', async () => {
    prisma.user.delete.mockResolvedValue({ id: 1 })

    await expect(service.remove(1)).resolves.toEqual({ id: 1 })
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('comparePasswords throws if no identity provided', async () => {
    await expect(service.comparePasswords('secret')).rejects.toBeInstanceOf(
      BadRequestException
    )
  })

  it('comparePasswords throws on invalid credentials', async () => {
    prisma.user.findFirstOrThrow.mockResolvedValue({
      id: 1,
      password: 'hashed'
    })
    ;(compareSync as jest.Mock).mockReturnValue(false)

    await expect(
      service.comparePasswords('secret', 'neo@example.com')
    ).rejects.toBeInstanceOf(UnauthorizedException)
    expect(prisma.user.findFirstOrThrow).toHaveBeenCalledWith({
      include: includeUserWithRelations,
      where: { OR: [{ email: 'neo@example.com' }] }
    })
  })

  it('comparePasswords returns user on valid password', async () => {
    const user = { id: 1, password: 'hashed' }

    prisma.user.findFirstOrThrow.mockResolvedValue(user)
    ;(compareSync as jest.Mock).mockReturnValue(true)

    await expect(
      service.comparePasswords('secret', undefined, 1)
    ).resolves.toEqual(user)
  })

  it('changePassword validates and updates password', async () => {
    const updated = { id: 1 }

    jest
      .spyOn(service, 'comparePasswords')
      .mockResolvedValue({ id: 1 } as never)
    jest.spyOn(service, 'update').mockResolvedValue(updated as never)
    ;(hashSync as jest.Mock).mockReturnValue('new-hash')

    await expect(service.changePassword(1, 'old', 'new')).resolves.toEqual(
      updated
    )
    expect(service.comparePasswords).toHaveBeenCalledWith('old', undefined, 1)
    expect(service.update).toHaveBeenCalledWith(1, { password: 'new-hash' })
  })
})
