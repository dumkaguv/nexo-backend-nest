import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'

import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

import { UserDto } from 'prisma/swagger/models/user.dto'

import { ApiOkResponseWrapped } from '@/common/decorators'
import { ApiPaginated } from '@/common/decorators/api-paginated.decorator'
import { FindAllQueryDto } from '@/common/dtos'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponseWrapped(UserDto)
  @ApiExcludeEndpoint()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ApiPaginated(UserDto)
  findAll(@Query() query: FindAllQueryDto<UserDto>) {
    return this.userService.findAll(query)
  }

  @Get(':id')
  @ApiOkResponseWrapped(UserDto)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch(':id')
  @ApiOkResponseWrapped(UserDto)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
