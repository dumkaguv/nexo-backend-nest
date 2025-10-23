import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'

import { User } from 'prisma/swagger/models/user.entity'

import { ApiOkResponseWrapped } from '@/common/decorators'
import { CreateUserDto } from '@/user/dto/create-user.dto'

import { AuthService } from './auth.service'
import { UpdateAuthDto } from './dto/update-auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponseWrapped(User)
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto)
  }

  @Get()
  findAll() {
    return this.authService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id)
  }
}
