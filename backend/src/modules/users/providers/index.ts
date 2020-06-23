import { container } from 'tsyringe';

import IHashProvider from './models/IHashProvider';
import BCryptHashProvider from './implementations/BCryptProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
