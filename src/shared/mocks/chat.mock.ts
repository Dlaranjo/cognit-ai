import { Conversa } from '../types/chat.types';

export const conversasMock: Conversa[] = [
  {
    id: 'conv1',
    titulo: 'Exemplo de conversa',
    criadaEm: new Date().toISOString(),
    mensagens: [
      {
        id: 'msg1',
        conteudo: 'Olá, como posso ajudar?',
        autor: 'assistente',
        timestamp: new Date().toISOString(),
      },
    ],
  },
]; 