import { Request, Response } from 'express';
import { CriarMedicoCasoDeUso } from '../../../../application/medicos/casos-de-uso/CriarMedicoCasoDeUso';
import { ListarMedicosCasoDeUso } from '../../../../application/medicos/casos-de-uso/ListarMedicosCasoDeUso';
import { medicoParaJson } from '../../mapeadores/mapeadoresResposta';

export class MedicosController {
  constructor(
    private readonly criarMedico: CriarMedicoCasoDeUso,
    private readonly listar: ListarMedicosCasoDeUso,
  ) {}

  criar = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as { nomeCompleto: string; crm: string; especialidade: string };
    const medico = await this.criarMedico.executar(body);
    res.status(201).json(medicoParaJson(medico));
  };

  listarHandler = async (req: Request, res: Response): Promise<void> => {
    const especialidade = (req.query.especialidade as string) ?? '';
    const medicos = await this.listar.executar({ especialidade });
    res.json(medicos.map(medicoParaJson));
  };
}
