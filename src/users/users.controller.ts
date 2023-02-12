import { CreateUser } from './dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() dto: CreateUser) {
    return this.usersService.create(dto.email, dto.password);
  }
}
