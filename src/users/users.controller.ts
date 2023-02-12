import { CreateUser } from './dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class UsersController {
  @Post('signup')
  createUser(@Body() dto: CreateUser) {
    console.log(dto);
  }
}
