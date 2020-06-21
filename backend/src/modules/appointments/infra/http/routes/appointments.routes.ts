import { Router } from 'express';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const AppointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

AppointmentsRouter.use(ensureAuthentication);

// AppointmentsRouter.get('/', async (request, response) => {
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();

//   return response.json({ appointments });
// });

AppointmentsRouter.post('/', appointmentsController.create);

export default AppointmentsRouter;
