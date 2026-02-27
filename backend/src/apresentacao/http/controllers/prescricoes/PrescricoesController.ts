import { Request, Response } from 'express';
import { EmitirPrescricaoCasoDeUso } from '../../../../application/prescricoes/casos-de-uso/EmitirPrescricaoCasoDeUso';
import { ListarPrescricoesPorPacienteCasoDeUso } from '../../../../application/prescricoes/casos-de-uso/ListarPrescricoesPorPacienteCasoDeUso';
import { prescricaoParaJson } from '../../mapeadores/mapeadoresResposta';

export class PrescricoesController {
  constructor(
    private readonly emitir: EmitirPrescricaoCasoDeUso,
    private readonly listarPorPaciente: ListarPrescricoesPorPacienteCasoDeUso,
  ) {}

  emitirHandler = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as {
      pacienteId: string;
      medicoId: string;
      itens: Array<{ medicamento: string; dosagem: string; frequencia: string; duracaoDias?: number | null }>;
      observacoesGerais?: string | null;
    };
    const prescricao = await this.emitir.executar({
      pacienteId: body.pacienteId,
      medicoId: body.medicoId,
      itens: body.itens,
      observacoesGerais: body.observacoesGerais === '' ? null : body.observacoesGerais,
    });
    res.status(201).json(prescricaoParaJson(prescricao));
  };

  listarPorPacienteHandler = async (req: Request, res: Response): Promise<void> => {
    const pacienteId = req.params.pacienteId as string;
    const prescricoes = await this.listarPorPaciente.executar({ pacienteId });
    res.json(prescricoes.map(prescricaoParaJson));
  };
}
