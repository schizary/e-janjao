import { Request, Response } from 'express';
import { AgendarConsultaCasoDeUso } from '../../../../application/consultas/casos-de-uso/AgendarConsultaCasoDeUso';
import { CancelarConsultaCasoDeUso } from '../../../../application/consultas/casos-de-uso/CancelarConsultaCasoDeUso';
import { ListarConsultasPorPacienteCasoDeUso } from '../../../../application/consultas/casos-de-uso/ListarConsultasPorPacienteCasoDeUso';
import { consultaParaJson } from '../../mapeadores/mapeadoresResposta';

export class ConsultasController {
  constructor(
    private readonly agendar: AgendarConsultaCasoDeUso,
    private readonly cancelar: CancelarConsultaCasoDeUso,
    private readonly listarPorPaciente: ListarConsultasPorPacienteCasoDeUso,
  ) {}

  agendarHandler = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as {
      pacienteId: string;
      medicoId: string;
      inicio: Date;
      fim: Date;
      observacoes?: string | null;
    };
    const consulta = await this.agendar.executar({
      pacienteId: body.pacienteId,
      medicoId: body.medicoId,
      inicio: body.inicio,
      fim: body.fim,
      observacoes: body.observacoes === '' ? null : body.observacoes,
    });
    res.status(201).json(consultaParaJson(consulta));
  };

  cancelarHandler = async (req: Request, res: Response): Promise<void> => {
    const consultaId = req.params.id as string;
    const body = req.body as { motivo?: string | null };
    const consulta = await this.cancelar.executar({
      consultaId,
      motivo: body.motivo ?? null,
    });
    res.json(consultaParaJson(consulta));
  };

  listarPorPacienteHandler = async (req: Request, res: Response): Promise<void> => {
    const pacienteId = req.params.pacienteId as string;
    const consultas = await this.listarPorPaciente.executar({ pacienteId });
    res.json(consultas.map(consultaParaJson));
  };
}
