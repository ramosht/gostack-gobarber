import AppError from '@shared/errors/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeBCryptProvider from '@modules/users/providers/fakes/FakeBCryptProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeBCryptProvider = new FakeBCryptProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeBCryptProvider,
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeBCryptProvider,
    );

    await createUserService.execute({
      name: 'Guilherme Ramos',
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    const response = await authenticateUserService.execute({
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    expect(response).toHaveProperty('token');
  });

  it("shouldn't be able to authenticate with non existing user", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeBCryptProvider = new FakeBCryptProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeBCryptProvider,
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeBCryptProvider,
    );

    await createUserService.execute({
      name: 'Guilherme Ramos',
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    expect(
      authenticateUserService.execute({
        email: 'guilhermeht.ramsos@gmail.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to authenticate when password is incorrect", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeBCryptProvider = new FakeBCryptProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeBCryptProvider,
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeBCryptProvider,
    );

    await createUserService.execute({
      name: 'Guilherme Ramos',
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    expect(
      authenticateUserService.execute({
        email: 'guilhermeht.ramos@gmail.com',
        password: '12345678910',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
