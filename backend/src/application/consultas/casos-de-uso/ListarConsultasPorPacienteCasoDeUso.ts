import { Consulta } from '../../../domain/consultas/entidades/Consulta';
import { ConsultaRepositorio } from '../../../domain/consultas/repositorios/ConsultaRepositorio';
import { ListarConsultasPorPacienteDTO } from '../dtos/ListarConsultasPorPacienteDTO';

export class ListarConsultasPorPacienteCasoDeUso {
  constructor(private readonly consultaRepositorio: ConsultaRepositorio) {}

  async executar(dados: ListarConsultasPorPacienteDTO): Promise<Consulta[]> {
    return this.consultaRepositorio.listarPorPaciente(dados.pacienteId);
  }
}

