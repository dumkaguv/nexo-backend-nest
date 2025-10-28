import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { plainToInstance } from 'class-transformer'

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped } from '@/common/decorators'
import { ApiPaginated } from '@/common/decorators/api-paginated.decorator'
import { EmptyResponseDto, FindAllQueryDto } from '@/common/dtos'

import { sendPaginatedResponse } from '@/common/utils'

import { CreateChangePasswordDto, ResponseUserDto, UpdateUserDto } from './dto'
import { UserService } from './user.service'

@Controller('users')
@Authorization()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginated(ResponseUserDto)
  async findAll(@Query() query: FindAllQueryDto<ResponseUserDto>) {
    return sendPaginatedResponse(
      ResponseUserDto,
      await this.userService.findAll(query)
    )
  }

  @Get(':id')
  @ApiOkResponseWrapped(ResponseUserDto)
  async findOne(@Param('id') id: string) {
    return plainToInstance(
      ResponseUserDto,
      await this.userService.findOneWithRelations(+id)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponseUserDto)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return plainToInstance(
      ResponseUserDto,
      await this.userService.update(+id, dto)
    )
  }

  @Patch(':id/change-password')
  @ApiOkResponseWrapped(EmptyResponseDto)
  async changePassword(
    @Param('id') id: string,
    @Body() { oldPassword, newPassword }: CreateChangePasswordDto
  ) {
    return plainToInstance(
      ResponseUserDto,
      await this.userService.changePassword(+id, oldPassword, newPassword)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
