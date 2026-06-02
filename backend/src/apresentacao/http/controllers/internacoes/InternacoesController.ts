import { Request, Response } from 'express';
import { RegistrarInternacaoCasoDeUso } from '../../../../application/internacoes/casos-de-uso/RegistrarInternacaoCasoDeUso';
import { DarAltaPacienteCasoDeUso } from '../../../../application/internacoes/casos-de-uso/DarAltaPacienteCasoDeUso';
import { ListarInternacoesAtivasPorPacienteCasoDeUso } from '../../../../application/internacoes/casos-de-uso/ListarInternacoesAtivasPorPacienteCasoDeUso';
import { ListarInternacoesPorPacienteCasoDeUso } from '../../../../application/internacoes/casos-de-uso/ListarInternacoesPorPacienteCasoDeUso';
import { internacaoParaJson } from '../../mapeadores/mapeadoresResposta';

export class InternacoesController {
  constructor(
    private readonly registrar: RegistrarInternacaoCasoDeUso,
    private readonly darAlta: DarAltaPacienteCasoDeUso,
    private readonly listarAtivasPorPaciente: ListarInternacoesAtivasPorPacienteCasoDeUso,
    private readonly listarPorPaciente: ListarInternacoesPorPacienteCasoDeUso,
  ) {}

  registrarHandler = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as {
      pacienteId: string;
      quarto: string;
      leito: string;
      motivo: string;
      dataEntrada: Date;
      observacoes?: string | null;
    };
    const internacao = await this.registrar.executar({
      pacienteId: body.pacienteId,
      quarto: body.quarto,
      leito: body.leito,
      motivo: body.motivo,
      dataEntrada: body.dataEntrada,
      observacoes: body.observacoes === '' ? null : body.observacoes,
    });
    res.status(201).json(internacaoParaJson(internacao));
  };

  darAltaHandler = async (req: Request, res: Response): Promise<void> => {
    const internacaoId = req.params.id as string;
    const body = req.body as { dataSaida: Date; observacoes?: string | null };
    const internacao = await this.darAlta.executar({
      internacaoId,
      dataSaida: body.dataSaida,
      observacoes: body.observacoes === '' ? null : body.observacoes,
    });
    res.json(internacaoParaJson(internacao));
  };

  listarAtivasPorPacienteHandler = async (req: Request, res: Response): Promise<void> => {
    const pacienteId = req.params.pacienteId as string;
    const internacoes = await this.listarAtivasPorPaciente.executar({ pacienteId });
    res.json(internacoes.map(internacaoParaJson));
  };

  listarPorPacienteHandler = async (req: Request, res: Response): Promise<void> => {
    const pacienteId = req.params.pacienteId as string;
    const internacoes = await this.listarPorPaciente.executar({ pacienteId });
    res.json(internacoes.map(internacaoParaJson));
  };
}
