import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('me')
  // getMe(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('signup')
  async createUser(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(dto);

    session.userId = user.id;

    return user;
  }

  @Post('signin')
  async signing(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(dto);

    session.userId = user.id;

    return user;
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
