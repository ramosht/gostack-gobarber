import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to create a new user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Guilherme',
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    await sendForgotPasswordEmail.execute({
      email: 'guilhermeht.ramos@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'guilhermeht.ramos@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Guilherme',
      email: 'guilhermeht.ramos@gmail.com',
      password: '123456789',
    });

    await sendForgotPasswordEmail.execute({
      email: 'guilhermeht.ramos@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
