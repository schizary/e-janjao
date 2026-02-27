import { Consulta } from '../../../domain/consultas/entidades/Consulta';
import { ConsultaRepositorio } from '../../../domain/consultas/repositorios/ConsultaRepositorio';
import { CancelarConsultaDTO } from '../dtos/CancelarConsultaDTO';

export class CancelarConsultaCasoDeUso {
  constructor(private readonly consultaRepositorio: ConsultaRepositorio) {}

  async executar(dados: CancelarConsultaDTO): Promise<Consulta> {
    const consulta = await this.consultaRepositorio.buscarPorId(dados.consultaId);

    if (!consulta) {
      throw new Error('Consulta não encontrada');
    }

    consulta.cancelar(dados.motivo ?? undefined);

    await this.consultaRepositorio.atualizar(consulta);

    return consulta;
  }
}

