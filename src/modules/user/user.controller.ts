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

import { ApiOkResponseWrapped } from '@/common/decorators'
import { ApiPaginated } from '@/common/decorators/api-paginated.decorator'
import { EmptyResponseDto, FindAllQueryDto } from '@/common/dtos'
import type { AuthRequest } from '@/common/types'

import { sendPaginatedResponse, sendResponse } from '@/common/utils'
import { Authorization } from '@/modules/auth/decorators'

import { CreateChangePasswordDto, ResponseUserDto, UpdateUserDto } from './dto'

import { UserService } from './user.service'

@Controller('users')
@Authorization()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginated(ResponseUserDto)
  public findAll(
    @Req() req: AuthRequest,
    @Query() query: FindAllQueryDto<ResponseUserDto>
  ) {
    return sendPaginatedResponse(
      ResponseUserDto,
      this.userService.findAll(query, req.user.id)
    )
  }

  @Get(':id')
  @ApiOkResponseWrapped(ResponseUserDto)
  public findOne(@Param('id') id: string) {
    return sendResponse(
      ResponseUserDto,
      this.userService.findOneWithRelations(+id)
    )
  }

  @Patch(':id')
  @ApiOkResponseWrapped(ResponseUserDto)
  public update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return sendResponse(ResponseUserDto, this.userService.update(+id, dto))
  }

  @Patch(':id/change-password')
  @ApiOkResponseWrapped(EmptyResponseDto)
  public changePassword(
    @Param('id') id: string,
    @Body() { oldPassword, newPassword }: CreateChangePasswordDto
  ) {
    return sendResponse(
      ResponseUserDto,
      this.userService.changePassword(+id, oldPassword, newPassword)
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
