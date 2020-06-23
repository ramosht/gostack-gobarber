import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { inject, injectable } from 'tsyringe';

import Users from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IReponse {
  user: Users;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IReponse> {
    // Verifica se usuário existe
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('O usuário ou a senha incorretos.', 401);
    }

    // Verifica se a senha combina
    const doesPasswordMatch = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!doesPasswordMatch) {
      throw new AppError('O usuário ou a senha incorretos.', 401);
    }

    // usuário autenticado
    delete user.password;
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
