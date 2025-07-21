import type { LLMModel } from '../../types';
import { config } from '../config';

export function getContextWindow(model: string): number {
  if (model.includes('gpt-4')) return 128000;
  if (model.includes('claude-3')) return 200000;
  if (model.includes('gemini')) return 32000;
  if (model.includes('llama')) return 4000;
  return 8000;
}

export function getPricing(model: string): { input: number; output: number } {
  if (model.includes('gpt-4-turbo')) return { input: 0.01, output: 0.03 };
  if (model.includes('claude-3-opus')) return { input: 0.015, output: 0.075 };
  if (model.includes('claude-3-sonnet')) return { input: 0.003, output: 0.015 };
  if (model.includes('gemini-pro')) return { input: 0.0005, output: 0.0015 };
  if (model.includes('llama-2-70b')) return { input: 0.0007, output: 0.0009 };
  return { input: 0.001, output: 0.002 };
}

export function getCapabilities(model: string): string[] {
  const base = ['Text', 'Code'];
  if (model.includes('gpt-4')) return [...base, 'Analysis', 'Creative Writing'];
  if (model.includes('claude-3'))
    return [...base, 'Analysis', 'Complex Reasoning'];
  if (model.includes('gemini')) return [...base, 'Images', 'Multimodal'];
  return base;
}

export function getProviderColor(providerId: string): string {
  const colors = {
    openai: 'from-green-500 to-emerald-600',
    anthropic: 'from-purple-500 to-indigo-600',
    google: 'from-yellow-500 to-orange-600',
    meta: 'from-red-500 to-pink-600',
  };
  return (
    colors[providerId as keyof typeof colors] || 'from-gray-500 to-gray-600'
  );
}

export function createAvailableModels(): LLMModel[] {
  return config.LLM_PROVIDERS.flatMap((provider) =>
    provider.models.map((model) => ({
      id: model,
      name: model.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      provider: provider.name,
      description: `${provider.name} ${model} model`,
      contextWindow: getContextWindow(model),
      pricing: getPricing(model),
      capabilities: getCapabilities(model),
      color: getProviderColor(provider.id),
    }))
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
