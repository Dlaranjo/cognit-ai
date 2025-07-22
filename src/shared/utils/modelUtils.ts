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

function getModelDescription(model: string): string {
  if (model.includes('gpt-4-turbo')) return 'Modelo avançado ideal para análises complexas e criação de conteúdo';
  if (model.includes('gpt-4')) return 'Modelo poderoso para tarefas que exigem raciocínio sofisticado';
  if (model.includes('gpt-3.5')) return 'Modelo equilibrado para uso geral, rápido e eficiente';
  if (model.includes('claude-3-opus')) return 'Modelo premium para tarefas de alta complexidade e precisão';
  if (model.includes('claude-3-sonnet')) return 'Modelo versátil com ótima relação custo-benefício';
  if (model.includes('claude-3-haiku')) return 'Modelo rápido e econômico para tarefas simples';
  if (model.includes('gemini-pro')) return 'Modelo do Google com capacidades multimodais avançadas';
  if (model.includes('llama')) return 'Modelo open-source da Meta, gratuito para uso';
  return 'Modelo de inteligência artificial para conversas e análises';
}

function getPriceCategory(pricing: { input: number; output: number }): 'low' | 'medium' | 'high' {
  const avgPrice = (pricing.input + pricing.output) / 2;
  if (avgPrice <= 0.002) return 'low';
  if (avgPrice <= 0.02) return 'medium';
  return 'high';
}

export function createAvailableModels(): LLMModel[] {
  return config.LLM_PROVIDERS.flatMap((provider) =>
    provider.models.map((model) => {
      const pricing = getPricing(model);
      return {
        id: model,
        name: model.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        provider: provider.name,
        description: getModelDescription(model),
        contextWindow: getContextWindow(model),
        pricing,
        capabilities: getCapabilities(model),
        color: getProviderColor(provider.id),
        priceCategory: getPriceCategory(pricing),
      };
    })
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Gratuito';
  if (price < 0.001) return `$${(price * 1000).toFixed(2)}/M`;
  return `$${price.toFixed(3)}/1K`;
}

export function getPriceBadgeColor(category: 'low' | 'medium' | 'high'): string {
  switch (category) {
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
