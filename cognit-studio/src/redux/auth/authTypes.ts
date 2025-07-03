import { Usuario } from '../../shared/types/usuario.types';

export interface EstadoAuth {
  usuario: Usuario | null;
  autenticado: boolean;
}
