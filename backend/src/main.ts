import 'dotenv/config';
import { ambiente } from './config/ambiente';
import { criarServidor } from './apresentacao/http/servidor';
import { PacientesController } from './apresentacao/http/controllers/pacientes/PacientesController';
import { MedicosController } from './apresentacao/http/controllers/medicos/MedicosController';
import { ConsultasController } from './apresentacao/http/controllers/consultas/ConsultasController';
import { ExamesController } from './apresentacao/http/controllers/exames/ExamesController';
import { PrescricoesController } from './apresentacao/http/controllers/prescricoes/PrescricoesController';
import { InternacoesController } from './apresentacao/http/controllers/internacoes/InternacoesController';
import { LoginController } from './apresentacao/http/controllers/autenticacao/LoginController';
import { CriarPacienteCasoDeUso } from './application/pacientes/casos-de-uso/CriarPacienteCasoDeUso';
import { AtualizarContatoPacienteCasoDeUso } from './application/pacientes/casos-de-uso/AtualizarContatoPacienteCasoDeUso';
import { BuscarPacientePorIdCasoDeUso } from './application/pacientes/casos-de-uso/BuscarPacientePorIdCasoDeUso';
import { ListarPacientesCasoDeUso } from './application/pacientes/casos-de-uso/ListarPacientesCasoDeUso';
import { CriarMedicoCasoDeUso } from './application/medicos/casos-de-uso/CriarMedicoCasoDeUso';
import { ListarMedicosCasoDeUso } from './application/medicos/casos-de-uso/ListarMedicosCasoDeUso';
import { AgendarConsultaCasoDeUso } from './application/consultas/casos-de-uso/AgendarConsultaCasoDeUso';
import { CancelarConsultaCasoDeUso } from './application/consultas/casos-de-uso/CancelarConsultaCasoDeUso';
import { ListarConsultasPorPacienteCasoDeUso } from './application/consultas/casos-de-uso/ListarConsultasPorPacienteCasoDeUso';
import { AgendarExameCasoDeUso } from './application/exames/casos-de-uso/AgendarExameCasoDeUso';
import { RegistrarResultadoExameCasoDeUso } from './application/exames/casos-de-uso/RegistrarResultadoExameCasoDeUso';
import { EmitirPrescricaoCasoDeUso } from './application/prescricoes/casos-de-uso/EmitirPrescricaoCasoDeUso';
import { ListarPrescricoesPorPacienteCasoDeUso } from './application/prescricoes/casos-de-uso/ListarPrescricoesPorPacienteCasoDeUso';
import { RegistrarInternacaoCasoDeUso } from './application/internacoes/casos-de-uso/RegistrarInternacaoCasoDeUso';
import { DarAltaPacienteCasoDeUso } from './application/internacoes/casos-de-uso/DarAltaPacienteCasoDeUso';
import { ListarInternacoesAtivasPorPacienteCasoDeUso } from './application/internacoes/casos-de-uso/ListarInternacoesAtivasPorPacienteCasoDeUso';
import { AutenticarUsuarioCasoDeUso } from './application/autenticacao/casos-de-uso/AutenticarUsuarioCasoDeUso';
import { PacienteRepositorioPrisma } from './infraestrutura/repositorios/prisma/PacienteRepositorioPrisma';
import { MedicoRepositorioPrisma } from './infraestrutura/repositorios/prisma/MedicoRepositorioPrisma';
import { UsuarioRepositorioPrisma } from './infraestrutura/repositorios/prisma/UsuarioRepositorioPrisma';
import { ConsultaRepositorioPrisma } from './infraestrutura/repositorios/prisma/ConsultaRepositorioPrisma';
import { ExameRepositorioPrisma } from './infraestrutura/repositorios/prisma/ExameRepositorioPrisma';
import { PrescricaoRepositorioPrisma } from './infraestrutura/repositorios/prisma/PrescricaoRepositorioPrisma';
import { InternacaoRepositorioPrisma } from './infraestrutura/repositorios/prisma/InternacaoRepositorioPrisma';
import { GeradorIdUuid } from './shared/GeradorIdUuid';
import { BcryptComparadorSenha } from './infraestrutura/seguranca/BcryptComparadorSenha';
import { JwtEmissorTokenAcesso } from './infraestrutura/seguranca/JwtEmissorTokenAcesso';

const geradorId = new GeradorIdUuid();
const comparadorSenha = new BcryptComparadorSenha();
const emissorToken = new JwtEmissorTokenAcesso(ambiente.jwtSecret, ambiente.jwtExpiracao);

const pacienteRepositorio = new PacienteRepositorioPrisma();
const medicoRepositorio = new MedicoRepositorioPrisma();
const usuarioRepositorio = new UsuarioRepositorioPrisma();
const consultaRepositorio = new ConsultaRepositorioPrisma();
const exameRepositorio = new ExameRepositorioPrisma();
const prescricaoRepositorio = new PrescricaoRepositorioPrisma();
const internacaoRepositorio = new InternacaoRepositorioPrisma();

const criarPaciente = new CriarPacienteCasoDeUso(pacienteRepositorio, geradorId);
const atualizarContatoPaciente = new AtualizarContatoPacienteCasoDeUso(pacienteRepositorio);
const buscarPacientePorId = new BuscarPacientePorIdCasoDeUso(pacienteRepositorio);
const listarPacientes = new ListarPacientesCasoDeUso(pacienteRepositorio);

const criarMedico = new CriarMedicoCasoDeUso(medicoRepositorio, geradorId);
const listarMedicos = new ListarMedicosCasoDeUso(medicoRepositorio);

const agendarConsulta = new AgendarConsultaCasoDeUso(
  consultaRepositorio,
  pacienteRepositorio,
  medicoRepositorio,
  geradorId,
);
const cancelarConsulta = new CancelarConsultaCasoDeUso(consultaRepositorio);
const listarConsultasPorPaciente = new ListarConsultasPorPacienteCasoDeUso(consultaRepositorio);

const agendarExame = new AgendarExameCasoDeUso(
  exameRepositorio,
  pacienteRepositorio,
  geradorId,
);
const registrarResultadoExame = new RegistrarResultadoExameCasoDeUso(exameRepositorio);

const emitirPrescricao = new EmitirPrescricaoCasoDeUso(
  prescricaoRepositorio,
  pacienteRepositorio,
  medicoRepositorio,
  geradorId,
);
const listarPrescricoesPorPaciente = new ListarPrescricoesPorPacienteCasoDeUso(prescricaoRepositorio);

const registrarInternacao = new RegistrarInternacaoCasoDeUso(
  internacaoRepositorio,
  pacienteRepositorio,
  geradorId,
);
const darAltaPaciente = new DarAltaPacienteCasoDeUso(internacaoRepositorio);
const listarInternacoesAtivasPorPaciente = new ListarInternacoesAtivasPorPacienteCasoDeUso(
  internacaoRepositorio,
);

const autenticarUsuario = new AutenticarUsuarioCasoDeUso(
  usuarioRepositorio,
  comparadorSenha,
  emissorToken,
);

const controllers = {
  pacientes: new PacientesController(
    criarPaciente,
    atualizarContatoPaciente,
    buscarPacientePorId,
    listarPacientes,
  ),
  medicos: new MedicosController(criarMedico, listarMedicos),
  consultas: new ConsultasController(
    agendarConsulta,
    cancelarConsulta,
    listarConsultasPorPaciente,
  ),
  exames: new ExamesController(agendarExame, registrarResultadoExame),
  prescricoes: new PrescricoesController(emitirPrescricao, listarPrescricoesPorPaciente),
  internacoes: new InternacoesController(
    registrarInternacao,
    darAltaPaciente,
    listarInternacoesAtivasPorPaciente,
  ),
  login: new LoginController(autenticarUsuario),
};

const app = criarServidor(controllers);
const porta = ambiente.porta;

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
  console.log(`Health: http://localhost:${porta}/health`);
  console.log(`API: http://localhost:${porta}/api`);
});
