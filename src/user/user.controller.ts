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

import { Authorization } from '@/auth/decorators'
import { ApiOkResponseWrapped } from '@/common/decorators'
import { ApiPaginated } from '@/common/decorators/api-paginated.decorator'
import { FindAllQueryDto } from '@/common/dtos'

import { UpdateUserDto, UserResponseDto } from './dto'
import { UserService } from './user.service'

@Controller('users')
@Authorization()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginated(UserResponseDto)
  findAll(@Query() query: FindAllQueryDto<UserResponseDto>) {
    return this.userService.findAll(query)
  }

  @Get(':id')
  @ApiOkResponseWrapped(UserResponseDto)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch(':id')
  @ApiOkResponseWrapped(UserResponseDto)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
