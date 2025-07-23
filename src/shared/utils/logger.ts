/**
 * Sistema de Logging Mock-Safe
 * 
 * Este logger garante que logs sejam exibidos apenas quando apropriado:
 * - dev(): Apenas em desenvolvimento 
 * - mock(): Apenas em desenvolvimento OU modo mock
 * - error(): Sempre permitido (erros críticos)
 * 
 * Protege o ambiente de produção removendo logs desnecessários
 * mas preserva funcionalidade do sistema mock atual.
 */

const isDev = import.meta.env.DEV;
const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

export const logger = {
  /**
   * Logs para debugging do sistema mock
   * Permitido em desenvolvimento OU quando modo mock está ativo
   */
  mock: (message: string, data?: unknown) => {
    if (isDev || isMockMode) {
      console.log(`[MOCK] ${message}`, data);
    }
  },

  /**
   * Logs para debugging de desenvolvimento
   * Apenas em modo desenvolvimento
   */
  dev: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`[DEV] ${message}`, data);
    }
  },

  /**
   * Logs de erro - sempre permitidos
   * Erros críticos devem sempre ser logados
   */
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error);
  },

  /**
   * Logs de warning - apenas em desenvolvimento
   */
  warn: (message: string, data?: unknown) => {
    if (isDev || isMockMode) {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  /**
   * Logs informativos - apenas em desenvolvimento
   */
  info: (message: string, data?: unknown) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, data);
    }
  }
};

export default logger;