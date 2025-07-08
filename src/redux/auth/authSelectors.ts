import { EstadoRaiz } from '../store';

export const seletorAuth = (estado: EstadoRaiz) => estado.auth;
export const seletorUsuarioAtual = (estado: EstadoRaiz) => estado.auth.usuario; 