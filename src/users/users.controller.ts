import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
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
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('user with this id not found');
    }

    return user;
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
