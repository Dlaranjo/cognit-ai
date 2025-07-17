import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../shared/config';

// Tipos para retry logic
interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// Tipos para erro padronizado
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

// Configuração do cliente Axios
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para obter token do localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Função para remover token e redirecionar
const handleAuthFailure = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  
  // Evita loop de redirecionamento
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// Função para fazer refresh do token
const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(`${config.API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data;
    
    localStorage.setItem('authToken', token);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    return token;
  } catch {
    handleAuthFailure();
    return null;
  }
};

// Request interceptor para autenticação e logging
apiClient.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logging em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('🔴 Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor para tratamento de erros e retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Logging em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    // Logging em desenvolvimento
    if (import.meta.env.DEV) {
      console.error(`🔴 API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAuthToken();
      if (newToken) {
        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } else {
        handleAuthFailure();
        return Promise.reject(error);
      }
    }

    // Retry logic para erros de rede (5xx, timeouts, network errors)
    const shouldRetry = (
      error.code === 'ECONNABORTED' || // Timeout
      error.code === 'NETWORK_ERROR' || // Network error
      (error.response?.status && error.response.status >= 500) // Server errors
    );

    if (shouldRetry && !originalRequest._retry && originalRequest) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      
      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount++;
        originalRequest._retry = true;

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, originalRequest._retryCount - 1) * 1000;
        
        if (import.meta.env.DEV) {
          console.log(`🔄 Retrying request (attempt ${originalRequest._retryCount}) in ${delay}ms`);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      }
    }

    // Padronizar erro para o frontend
    const apiError: ApiError = {
      message: 'Algo deu errado. Tente novamente.',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
    };

    // Mensagens de erro específicas
    if (error.response?.status === 400) {
      apiError.message = 'Dados inválidos. Verifique as informações e tente novamente.';
    } else if (error.response?.status === 403) {
      apiError.message = 'Você não tem permissão para realizar esta ação.';
    } else if (error.response?.status === 404) {
      apiError.message = 'Recurso não encontrado.';
    } else if (error.response?.status === 429) {
      apiError.message = 'Muitas tentativas. Aguarde um momento e tente novamente.';
    } else if (error.response?.status && error.response.status >= 500) {
      apiError.message = 'Erro do servidor. Nossa equipe foi notificada.';
    } else if (error.code === 'ECONNABORTED') {
      apiError.message = 'Tempo limite excedido. Verifique sua conexão.';
    } else if (error.code === 'NETWORK_ERROR') {
      apiError.message = 'Erro de conexão. Verifique sua internet.';
    }

    // Usar mensagem personalizada do backend se disponível
    if (error.response?.data?.message) {
      apiError.message = error.response.data.message;
    }

    return Promise.reject(apiError);
  }
);

// Função helper para verificar se está online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Função helper para fazer upload de arquivo
export const uploadFile = async (
  url: string, 
  file: File, 
  onProgress?: (progress: number) => void
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

// Função helper para cancelar requests
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export { apiClient };
export default apiClient;
