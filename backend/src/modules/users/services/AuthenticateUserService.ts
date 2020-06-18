import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

import Users from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Reponse {
  user: Users;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Reponse> {
    const usersRepository = getRepository(Users);

    // Verifica se usuário existe
    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('O usuário ou a senha incorretos.', 401);
    }

    // Verifica se a senha combina
    const doesPasswordMatch = await compare(password, user.password);

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
