import { PerfilUsuario } from '../../../domain/usuarios/entidades/Usuario';

export interface EmissorTokenAcesso {
  emitir(dados: { usuarioId: string; perfil: PerfilUsuario }): Promise<string>;
}

