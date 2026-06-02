import { Usuario } from '../../../domain/usuarios/entidades/Usuario';
import { UsuarioRepositorio } from '../../../domain/usuarios/repositorios/UsuarioRepositorio';
import { ErroAplicacao } from '../../../shared/erros/ErroAplicacao';
import { ComparadorSenha } from '../servicos/ComparadorSenha';
import { EmissorTokenAcesso } from '../servicos/EmissorTokenAcesso';
import { LoginDTO } from '../dtos/LoginDTO';

export interface ResultadoAutenticacao {
  tokenAcesso: string;
  usuario: Usuario;
}

export class AutenticarUsuarioCasoDeUso {
  constructor(
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly comparadorSenha: ComparadorSenha,
    private readonly emissorTokenAcesso: EmissorTokenAcesso,
  ) {}

  async executar(dados: LoginDTO): Promise<ResultadoAutenticacao> {
    const emailNormalizado = dados.email.trim().toLowerCase();

    const usuario = await this.usuarioRepositorio.buscarPorEmail(emailNormalizado);
    if (!usuario) {
      throw new ErroAplicacao('Credenciais inválidas', 401);
    }

    const dadosUsuario = usuario.obterDados();

    const senhaCorreta = await this.comparadorSenha.comparar(
      dados.senha,
      dadosUsuario.senha.obterHash(),
    );

    if (!senhaCorreta) {
      throw new ErroAplicacao('Credenciais inválidas', 401);
    }

    const tokenAcesso = await this.emissorTokenAcesso.emitir({
      usuarioId: dadosUsuario.id,
      perfil: dadosUsuario.perfil,
    });

    return {
      tokenAcesso,
      usuario,
    };
  }
}

