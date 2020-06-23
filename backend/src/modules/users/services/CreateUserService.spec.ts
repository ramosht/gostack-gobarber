import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeBCryptProvider from '@modules/users/providers/fakes/FakeBCryptProvider';
import CreateUserService from './CreateUserService';

describe('CreateUserService', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeBCryptProvider = new FakeBCryptProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeBCryptProvider,
    );

    const user = await createUserService.execute({
      name: 'Guilherme',
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    expect(user).toHaveProperty('id');
  });

  it("shouldn't be able to create a user if the email already exists", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeBCryptProvider = new FakeBCryptProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeBCryptProvider,
    );

    await createUserService.execute({
      name: 'Guilherme',
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    expect(
      createUserService.execute({
        name: 'Guilherme',
        email: 'guilhermeht.ramos@gmail.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
