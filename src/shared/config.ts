interface LLMProvider {
  id: string;
  name: string;
  models: string[];
}

interface Config {
  API_BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  MAX_FILE_SIZE: number;
  SUPPORTED_FILE_TYPES: string[];
  LLM_PROVIDERS: LLMProvider[];
}

// Force empty base URL in development to use Mirage mock server
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export const config: Config = {
  API_BASE_URL: apiBaseUrl,
  GOOGLE_CLIENT_ID:
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '1034043274094-vj8odt69hbpevp3uv9nl65ctf24r8km0.apps.googleusercontent.com',
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB
  SUPPORTED_FILE_TYPES: ['pdf', 'doc', 'docx', 'txt', 'md'],
  LLM_PROVIDERS: [
    {
      id: 'openai',
      name: 'OpenAI',
      models: ['gpt-4-turbo', 'gpt-3.5-turbo'],
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      models: ['claude-3-opus', 'claude-3-sonnet'],
    },
    {
      id: 'google',
      name: 'Google',
      models: ['gemini-pro'],
    },
    {
      id: 'meta',
      name: 'Meta',
      models: ['llama-2-70b'],
    },
  ],
};
