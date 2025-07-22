// Function to generate varied mock responses
export const generateMockResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // Programming/Technical questions
  if (message.includes('código') || message.includes('programar') || message.includes('javascript') || message.includes('react') || message.includes('typescript')) {
    return `Claro! Vou te ajudar com programação. 💻

**Sobre ${message.includes('react') ? 'React' : message.includes('javascript') ? 'JavaScript' : message.includes('typescript') ? 'TypeScript' : 'programação'}:**

\`\`\`javascript
// Exemplo prático
const exemplo = () => {
  console.log('Olá, mundo!');
  return 'Código funcionando!';
};
\`\`\`

**Principais conceitos:**

1. **Sintaxe**: Estrutura básica da linguagem
2. **Variáveis**: Armazenamento de dados
3. **Funções**: Blocos de código reutilizáveis
4. **Objetos**: Estruturas de dados complexas

**Dicas importantes:**
- 🎯 Pratique regularmente
- 📚 Leia a documentação oficial
- 🔍 Use ferramentas de debug
- 🤝 Participe da comunidade

Precisa de ajuda com algum código específico?`;
  }

  // Business/Strategy questions
  if (message.includes('negócio') || message.includes('empresa') || message.includes('estratégia') || message.includes('marketing')) {
    return `Excelente pergunta sobre negócios! 📈

**Análise estratégica:**

**Pontos-chave para considerar:**

1. **Mercado-alvo**: Quem são seus clientes ideais?
2. **Proposta de valor**: O que te diferencia da concorrência?
3. **Modelo de receita**: Como você vai monetizar?
4. **Recursos necessários**: Que investimentos são precisos?

**Métricas importantes:**
- 💰 **ROI**: Retorno sobre investimento
- 📊 **CAC**: Custo de aquisição de cliente
- 🔄 **LTV**: Valor do tempo de vida do cliente
- 📈 **Growth Rate**: Taxa de crescimento

**Próximos passos sugeridos:**
- Validar hipóteses com dados reais
- Criar um MVP (Produto Mínimo Viável)
- Testar com um grupo pequeno de usuários
- Iterar baseado no feedback

Quer discutir algum aspecto específico do seu negócio?`;
  }

  // AI/Technology questions
  if (message.includes('ia') || message.includes('inteligência artificial') || message.includes('machine learning') || message.includes('chatbot')) {
    return `Ótima pergunta sobre IA! 🤖

**O mundo da Inteligência Artificial:**

A IA está revolucionando como interagimos com a tecnologia. Aqui estão os principais conceitos:

**Tipos de IA:**

1. **IA Generativa**: Como ChatGPT, Claude, Gemini
   - Gera texto, código, imagens
   - Baseada em Large Language Models (LLMs)

2. **Machine Learning**: Aprendizado automático
   - Supervised Learning
   - Unsupervised Learning
   - Reinforcement Learning

3. **Deep Learning**: Redes neurais profundas
   - Processamento de linguagem natural
   - Visão computacional
   - Reconhecimento de padrões

**Aplicações práticas:**
- 🎨 **Criação de conteúdo**: Textos, imagens, vídeos
- 🔍 **Análise de dados**: Insights e previsões
- 🤖 **Automação**: Processos e tarefas repetitivas
- 💬 **Assistentes virtuais**: Como eu!

**Tendências futuras:**
- Modelos multimodais (texto + imagem + áudio)
- IA mais eficiente e sustentável
- Integração com IoT e robótica

Que aspecto da IA te interessa mais?`;
  }

  // Help/Tutorial questions
  if (message.includes('ajuda') || message.includes('como') || message.includes('tutorial') || message.includes('ensinar')) {
    return `Claro! Estou aqui para ajudar! 🙋‍♂️

**Como posso te auxiliar:**

**Áreas de expertise:**
- 💻 **Programação**: JavaScript, React, TypeScript, Python
- 🎨 **Design**: UI/UX, prototipagem, design systems
- 📊 **Dados**: Análise, visualização, dashboards
- 🚀 **Negócios**: Estratégia, marketing, growth hacking
- 🤖 **IA**: Machine learning, automação, chatbots

**Formato das respostas:**
- Explicações passo a passo
- Exemplos práticos e código
- Recursos para aprofundamento
- Dicas e melhores práticas

**Dicas para perguntas mais eficazes:**
1. **Seja específico**: "Como criar um componente React" vs "Como programar"
2. **Contexto**: Mencione seu nível de experiência
3. **Objetivo**: O que você quer alcançar
4. **Restrições**: Tecnologias, tempo, orçamento

**Exemplos de perguntas:**
- "Como implementar autenticação em React?"
- "Qual a melhor estratégia de SEO para e-commerce?"
- "Como analisar dados de vendas no Excel?"

O que você gostaria de aprender hoje?`;
  }

  // Greeting/General questions
  if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
    return `Olá! Muito prazer em conversar com você! 👋

**Bem-vindo ao Cognit Studio!**

Sou seu assistente de IA e estou aqui para ajudar com uma ampla variedade de tópicos:

**O que posso fazer por você:**

🎯 **Responder perguntas** sobre tecnologia, negócios, programação e muito mais

💡 **Dar sugestões** e ideias criativas para seus projetos

📝 **Ajudar com textos** - escrever, revisar, melhorar conteúdo

🔍 **Analisar problemas** e propor soluções práticas

📊 **Explicar conceitos** complexos de forma simples

**Recursos especiais:**
- Respostas com formatação rica (listas, código, tabelas)
- Explicações passo a passo
- Exemplos práticos
- Links e recursos úteis

**Dica:** Seja específico nas suas perguntas para respostas mais precisas!

Em que posso te ajudar hoje? 😊`;
  }

  // Default response for other topics
  return `Interessante pergunta! Vou fazer o meu melhor para te ajudar. 🤔

**Sobre "${userMessage}":**

Baseado na sua pergunta, posso oferecer algumas perspectivas:

**Análise inicial:**
- Este é um tópico que pode ter várias abordagens
- É importante considerar o contexto específico
- Existem diferentes escolas de pensamento sobre isso

**Pontos importantes a considerar:**

1. **Contexto**: Qual é a situação específica?
2. **Objetivos**: O que você espera alcançar?
3. **Recursos**: Que ferramentas/tempo você tem disponível?
4. **Restrições**: Existem limitações a considerar?

**Sugestões gerais:**
- 🔍 Pesquise fontes confiáveis sobre o assunto
- 💬 Converse com especialistas na área
- 🧪 Teste diferentes abordagens em pequena escala
- 📊 Meça resultados e ajuste conforme necessário

**Próximos passos:**
- Defina objetivos claros
- Crie um plano de ação
- Implemente gradualmente
- Monitore e ajuste

Você poderia me dar mais detalhes sobre o contexto? Assim posso oferecer uma resposta mais específica e útil! 😊`;
};