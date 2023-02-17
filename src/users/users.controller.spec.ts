import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      update: (id: number, dto: UpdateUserDto) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
          ...dto,
        } as User);
      },
    };

    fakeAuthService = {
      // signup: () => {},
      signin: ({ email, password }) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser(1);

    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser(1)).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session object and returns user', async () => {
    const session = { userId: null };

    const user = await controller.signing(
      {
        email: 'asdf@asdf.com',
        password: 'asdf',
      },
      session,
    );

    expect(user.id).toEqual(1);

    expect(session.userId).toEqual(1);
  });

  it('signOut remove session object', async () => {
    const session = { userId: 1 };

    await controller.signOut(session);

    expect(session.userId).toBeNull();
  });

  it('deleteUser returns a delete user', async () => {
    const user = await controller.deleteUser(1);

    expect(user.id).toEqual(1);
  });

  it('updateUser returns a user with updated fields', async () => {
    const email = 'asdf2@gmail.com';
    const password = 'asdf2';

    const user = await controller.updateUser(1, {
      email,
      password,
    });

    expect(user.id).toEqual(1);
    expect(user.email).toEqual(email);
    expect(user.password).toEqual(password);
  });

  it('updateUser returns a user with no changed fields, if we do not provide this', async () => {
    const email = 'asdf2@gmail.com';

    const user = await controller.updateUser(1, {
      email,
    } as UpdateUserDto);

    expect(user.id).toEqual(1);
    expect(user.email).toEqual(email);

    expect(user.password).toEqual('asdf');
  });
});
