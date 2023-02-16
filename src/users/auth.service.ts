import { UsersService } from './users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup({ password, email }) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email is used');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');

    const hashedPassword = `${salt}.${hash}`;

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    return user;
  }

  async signin({ email, password }) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('invalid password');
    }

    return user;
  }
}
