import { Medico } from '../../../domain/medicos/entidades/Medico';
import { MedicoRepositorio } from '../../../domain/medicos/repositorios/MedicoRepositorio';
import { ListarMedicosDTO } from '../dtos/ListarMedicosDTO';

export class ListarMedicosCasoDeUso {
  constructor(private readonly medicoRepositorio: MedicoRepositorio) {}

  async executar(filtro: ListarMedicosDTO = {}): Promise<Medico[]> {
    if (filtro.especialidade && filtro.especialidade.trim().length > 0) {
      return this.medicoRepositorio.listarPorEspecialidade(filtro.especialidade.trim());
    }

    // Se não for informada especialidade, retornamos todos os médicos
    return this.medicoRepositorio.listarPorEspecialidade('');
  }
}

