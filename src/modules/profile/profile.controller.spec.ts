import { Test, TestingModule } from '@nestjs/testing'

import { ResponseProfileDetailedDto, ResponseProfileDto } from './dto'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

describe('ProfileController', () => {
  let controller: ProfileController
  let profileService: {
    findOne: jest.Mock
    findOneDetailed: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    profileService = {
      findOne: jest.fn(),
      findOneDetailed: jest.fn(),
      update: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: profileService }]
    }).compile()

    controller = module.get(ProfileController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('me returns a ResponseProfileDto', async () => {
    profileService.findOne.mockResolvedValue({
      id: 1,
      fullName: 'Neo'
    })

    const result = await controller.me({ user: { id: 1 } } as never)

    expect(profileService.findOne).toHaveBeenCalledWith(1)
    expect(result).toBeInstanceOf(ResponseProfileDto)
  })

  it('meDetailed returns a ResponseProfileDetailedDto', async () => {
    profileService.findOneDetailed.mockResolvedValue({
      user: { id: 2 }
    })

    const result = await controller.meDetailed({ user: { id: 2 } } as never)

    expect(profileService.findOneDetailed).toHaveBeenCalledWith(2)
    expect(result).toBeInstanceOf(ResponseProfileDetailedDto)
  })

  it('update returns a ResponseProfileDto', async () => {
    profileService.update.mockResolvedValue({
      id: 3,
      fullName: 'Trinity'
    })

    const result = await controller.update({ user: { id: 3 } } as never, {
      fullName: 'Trinity'
    })

    expect(profileService.update).toHaveBeenCalledWith(3, {
      fullName: 'Trinity'
    })
    expect(result).toBeInstanceOf(ResponseProfileDto)
  })
})
