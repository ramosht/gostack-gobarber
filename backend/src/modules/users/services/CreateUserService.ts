import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import Users from '@modules/users/infra/typeorm/entities/Users';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<Users> {
    const usersRepository = getRepository(Users);

    // Verifica se email não é duplicado
    const emailIsDuplicated = await usersRepository.findOne({ email });

    if (emailIsDuplicated) {
      throw new AppError('Esse e-mail já existe.');
    } else {
      const hashedPassword = await hash(password, 6);

      const user = usersRepository.create({
        name,
        email,
        password: hashedPassword,
      });
      await usersRepository.save(user);

      delete user.password;

      return user;
    }
  }
}

export default CreateUserService;
