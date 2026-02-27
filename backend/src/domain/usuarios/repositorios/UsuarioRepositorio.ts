import { Usuario } from '../entidades/Usuario';

export interface UsuarioRepositorio {
  criar(usuario: Usuario): Promise<void>;
  atualizar(usuario: Usuario): Promise<void>;
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
}

