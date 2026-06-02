import { Request, Response } from 'express';
import { AgendarExameCasoDeUso } from '../../../../application/exames/casos-de-uso/AgendarExameCasoDeUso';
import { ListarExamesPorPacienteCasoDeUso } from '../../../../application/exames/casos-de-uso/ListarExamesPorPacienteCasoDeUso';
import { RegistrarResultadoExameCasoDeUso } from '../../../../application/exames/casos-de-uso/RegistrarResultadoExameCasoDeUso';
import { exameParaJson } from '../../mapeadores/mapeadoresResposta';

export class ExamesController {
  constructor(
    private readonly agendar: AgendarExameCasoDeUso,
    private readonly registrarResultado: RegistrarResultadoExameCasoDeUso,
    private readonly listarPorPaciente: ListarExamesPorPacienteCasoDeUso,
  ) {}

  agendarHandler = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as {
      pacienteId: string;
      tipo: string;
      dataHora: Date;
      local: string;
    };
    const exame = await this.agendar.executar(body);
    res.status(201).json(exameParaJson(exame));
  };

  registrarResultadoHandler = async (req: Request, res: Response): Promise<void> => {
    const exameId = req.params.id as string;
    const body = req.body as { resultado: string };
    const exame = await this.registrarResultado.executar({ exameId, resultado: body.resultado });
    res.json(exameParaJson(exame));
  };

  listarPorPacienteHandler = async (req: Request, res: Response): Promise<void> => {
    const pacienteId = req.params.pacienteId as string;
    const exames = await this.listarPorPaciente.executar({ pacienteId });
    res.json(exames.map(exameParaJson));
  };
}
