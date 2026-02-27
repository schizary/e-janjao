import { Medico } from '../../../domain/medicos/entidades/Medico';
import { MedicoRepositorio } from '../../../domain/medicos/repositorios/MedicoRepositorio';
import { Crm } from '../../../domain/medicos/valor-objetos/Crm';
import { GeradorId } from '../../../shared/tipos/GeradorId';
import { CriarMedicoDTO } from '../dtos/CriarMedicoDTO';

export class CriarMedicoCasoDeUso {
  constructor(
    private readonly medicoRepositorio: MedicoRepositorio,
    private readonly geradorId: GeradorId,
  ) {}

  async executar(dados: CriarMedicoDTO): Promise<Medico> {
    const crm = Crm.criar(dados.crm);

    const medicoExistente = await this.medicoRepositorio.buscarPorCrm(crm);
    if (medicoExistente) {
      throw new Error('Já existe um médico cadastrado com este CRM');
    }

    const medico = Medico.criar({
      id: this.geradorId.gerar(),
      nomeCompleto: dados.nomeCompleto,
      crm,
      especialidade: dados.especialidade,
    });

    await this.medicoRepositorio.criar(medico);

    return medico;
  }
}

