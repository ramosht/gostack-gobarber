import { Repository, EntityRepository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  // Verifica se já existe agendamento no mesmo horário, com o mesmo provedor
  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | null> {
    const findAppointment = await this.findOne({
      where: { date, provider_id },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
