import { Exame } from '../../../domain/exames/entidades/Exame';
import { ExameRepositorio } from '../../../domain/exames/repositorios/ExameRepositorio';
import { RegistrarResultadoExameDTO } from '../dtos/RegistrarResultadoExameDTO';

export class RegistrarResultadoExameCasoDeUso {
  constructor(private readonly exameRepositorio: ExameRepositorio) {}

  async executar(dados: RegistrarResultadoExameDTO): Promise<Exame> {
    const exame = await this.exameRepositorio.buscarPorId(dados.exameId);

    if (!exame) {
      throw new Error('Exame não encontrado');
    }

    exame.registrarResultado(dados.resultado);

    await this.exameRepositorio.atualizar(exame);

    return exame;
  }
}

