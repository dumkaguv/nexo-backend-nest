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

import { ApiOkResponseWrapped } from '@/common/decorators'
import { ApiPaginated } from '@/common/decorators/api-paginated.decorator'
import { FindAllQueryDto } from '@/common/dtos'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponseWrapped(UserResponseDto)
  @ApiExcludeEndpoint()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

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
