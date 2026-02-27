import { Medico } from '../entidades/Medico';
import { Crm } from '../valor-objetos/Crm';

export interface MedicoRepositorio {
  criar(medico: Medico): Promise<void>;
  atualizar(medico: Medico): Promise<void>;
  buscarPorId(id: string): Promise<Medico | null>;
  buscarPorCrm(crm: Crm): Promise<Medico | null>;
  listarPorEspecialidade(especialidade: string): Promise<Medico[]>;
}

