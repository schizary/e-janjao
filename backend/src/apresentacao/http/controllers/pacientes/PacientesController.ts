import { Request, Response } from 'express';
import { CriarPacienteCasoDeUso } from '../../../../application/pacientes/casos-de-uso/CriarPacienteCasoDeUso';
import { AtualizarContatoPacienteCasoDeUso } from '../../../../application/pacientes/casos-de-uso/AtualizarContatoPacienteCasoDeUso';
import { BuscarPacientePorIdCasoDeUso } from '../../../../application/pacientes/casos-de-uso/BuscarPacientePorIdCasoDeUso';
import { ListarPacientesCasoDeUso } from '../../../../application/pacientes/casos-de-uso/ListarPacientesCasoDeUso';
import { pacienteParaJson } from '../../mapeadores/mapeadoresResposta';

export class PacientesController {
  constructor(
    private readonly criarPaciente: CriarPacienteCasoDeUso,
    private readonly atualizarContato: AtualizarContatoPacienteCasoDeUso,
    private readonly buscarPorId: BuscarPacientePorIdCasoDeUso,
    private readonly listar: ListarPacientesCasoDeUso,
  ) {}

  criar = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as {
      nomeCompleto: string;
      cpf: string;
      email?: string | null;
      dataNascimento: Date;
      telefone?: string | null;
    };
    const email = body.email === '' ? null : body.email;
    const telefone = body.telefone === '' ? null : body.telefone;
    const paciente = await this.criarPaciente.executar({
      nomeCompleto: body.nomeCompleto,
      cpf: body.cpf,
      email: email ?? undefined,
      dataNascimento: body.dataNascimento,
      telefone: telefone ?? undefined,
    });
    res.status(201).json(pacienteParaJson(paciente));
  };

  atualizarContatoHandler = async (req: Request, res: Response): Promise<void> => {
    const pacienteId = req.params.id as string;
    const body = req.body as { email?: string | null; telefone?: string | null };
    const email = body.email === '' ? null : body.email;
    const telefone = body.telefone === '' ? null : body.telefone;
    const paciente = await this.atualizarContato.executar({
      pacienteId,
      email: email ?? undefined,
      telefone: telefone ?? undefined,
    });
    res.json(pacienteParaJson(paciente));
  };

  buscarPorIdHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const paciente = await this.buscarPorId.executar(id);
    res.json(pacienteParaJson(paciente));
  };

  listarHandler = async (req: Request, res: Response): Promise<void> => {
    const nome = (req.query.nome as string) ?? '';
    const pacientes = await this.listar.executar(nome);
    res.json(pacientes.map(pacienteParaJson));
  };
}
