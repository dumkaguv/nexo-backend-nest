import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { plainToInstance } from 'class-transformer'

import { ApiOkResponseWrapped } from '@/common/decorators'
import { ApiPaginated } from '@/common/decorators/api-paginated.decorator'
import { FindAllQueryDto } from '@/common/dtos'
import { type AuthRequest, EmptyResponseDto } from '@/common/dtos'

import { sendPaginatedResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { ResponseUserDto } from './dto'

import { CreateChangePasswordDto, UpdateUserDto } from './dto'
import { UserService } from './user.service'

@Controller('users')
@Authorization()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginated(ResponseUserDto)
  async findAll(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponseUserDto>
  ) {
    return sendPaginatedResponse(
      ResponseUserDto,
      await this.userService.findAll(query, req.user.id)
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
