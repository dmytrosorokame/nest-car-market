import { CreateUserDto, UpdateUserDto } from './dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne({ where: { id } });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
