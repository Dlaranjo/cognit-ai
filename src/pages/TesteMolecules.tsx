import React, { useState } from 'react';
import { BolhaMensagem, CardUsuario, CampoFormulario, GrupoFormulario } from '../components/molecules';
import styles from './TestePaginas.module.css';

const TesteMolecules: React.FC = () => {
    const [campoNome, setCampoNome] = useState('');
    const [campoEmail, setCampoEmail] = useState('');
    const [campoSenha, setCampoSenha] = useState('');
    const [campoTelefone, setCampoTelefone] = useState('');
    const [campoIdade, setCampoIdade] = useState('');
    const [campoDescricao, setCampoDescricao] = useState('');
  
    return (
      <div className={styles.container}>
        <h1>Teste de Componentes - Molecules</h1>
        
        {/* Bolhas de Mensagem */}
        <section className={styles.secao}>
          <h2>Bolhas de Mensagem</h2>
          <div className={styles.grid}>
            <div className={styles.grupo}>
              <label>Mensagem do Usuário</label>
              <BolhaMensagem
                conteudo="Olá! Como você está hoje?"
                tipo="usuario"
                timestamp={new Date()}
                avatar={{
                  nome: "João Silva",
                  cor: "#FF6B35"
                }}
                acoes={[
                  { id: '1', rotulo: 'Copiar', tipo: 'copiar' },
                  { id: '2', rotulo: 'Editar', tipo: 'editar' }
                ]}
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Mensagem do Assistente</label>
              <BolhaMensagem
                conteudo="Olá! Estou muito bem, obrigado por perguntar. Como posso ajudá-lo hoje?"
                tipo="assistente"
                timestamp={new Date(Date.now() - 30000)}
                avatar={{
                  nome: "Cognit AI",
                  cor: "#4CAF50"
                }}
                status="entregue"
                acoes={[
                  { id: '1', rotulo: 'Copiar', tipo: 'copiar' },
                  { id: '2', rotulo: 'Curtir', tipo: 'curtir' }
                ]}
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Mensagem do Sistema</label>
              <BolhaMensagem
                conteudo="Usuário entrou na conversa"
                tipo="sistema"
                timestamp={new Date(Date.now() - 60000)}
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Mensagem Digitando</label>
              <BolhaMensagem
                conteudo="Esta mensagem está sendo digitada com efeito de typing..."
                tipo="assistente"
                timestamp={new Date()}
                digitando={true}
                avatar={{
                  nome: "Cognit AI",
                  cor: "#4CAF50"
                }}
              />
            </div>
          </div>
        </section>
  
        {/* Cards de Usuário */}
        <section className={styles.secao}>
          <h2>Cards de Usuário</h2>
          <div className={styles.grid}>
            <div className={styles.grupo}>
              <label>Card Compacto</label>
              <CardUsuario
                usuario={{
                  id: '1',
                  nome: 'Maria Santos',
                  nomeUsuario: 'maria_santos',
                  email: 'maria@exemplo.com',
                  cargo: 'Desenvolvedora Frontend',
                  empresa: 'Tech Corp',
                  statusOnline: 'online',
                  corPersonalizada: '#FF6B35'
                }}
                variante="compacto"
                acoes={[
                  { id: '1', rotulo: 'Mensagem', tipo: 'mensagem', cor: 'primaria' },
                  { id: '2', rotulo: 'Perfil', tipo: 'perfil' }
                ]}
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Card Expandido</label>
              <CardUsuario
                usuario={{
                  id: '2',
                  nome: 'Pedro Oliveira',
                  nomeUsuario: 'pedro_dev',
                  email: 'pedro@exemplo.com',
                  cargo: 'Arquiteto de Software',
                  empresa: 'Innovation Labs',
                  statusOnline: 'ocupado',
                  biografia: 'Desenvolvedor apaixonado por tecnologia e inovação. Especialista em React e Node.js.',
                  badges: [
                    { id: '1', rotulo: 'Expert', cor: '#4CAF50' },
                    { id: '2', rotulo: 'Mentor', cor: '#FF9800' }
                  ],
                  estatisticas: {
                    mensagensEnviadas: 1250,
                    conversas: 45,
                    tempoOnline: 86400
                  }
                }}
                variante="expandido"
                acoes={[
                  { id: '1', rotulo: 'Mensagem', tipo: 'mensagem', cor: 'primaria' },
                  { id: '2', rotulo: 'Perfil', tipo: 'perfil' },
                  { id: '3', rotulo: 'Configurações', tipo: 'configuracoes' }
                ]}
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Card Minimal</label>
              <CardUsuario
                usuario={{
                  id: '3',
                  nome: 'Ana Costa',
                  statusOnline: 'ausente',
                  ultimaVezVisto: new Date(Date.now() - 300000)
                }}
                variante="minimal"
                acoes={[
                  { id: '1', rotulo: 'Mensagem', tipo: 'mensagem' }
                ]}
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Card Selecionado</label>
              <CardUsuario
                usuario={{
                  id: '4',
                  nome: 'Carlos Silva',
                  cargo: 'Designer UX',
                  statusOnline: 'online'
                }}
                variante="compacto"
                selecionado={true}
                clicavel={true}
                acoes={[
                  { id: '1', rotulo: 'Mensagem', tipo: 'mensagem', cor: 'primaria' }
                ]}
              />
            </div>
          </div>
        </section>
  
        {/* Campos de Formulário */}
        <section className={styles.secao}>
          <h2>Campos de Formulário</h2>
          <div className={styles.grid}>
            <div className={styles.grupo}>
              <label>Campo Básico</label>
              <CampoFormulario
                nome="nome"
                rotulo="Nome Completo"
                valor={campoNome}
                aoMudar={setCampoNome}
                placeholder="Digite seu nome completo"
                obrigatorio
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Campo Email com Validação</label>
              <CampoFormulario
                nome="email"
                rotulo="Email"
                tipo="email"
                valor={campoEmail}
                aoMudar={setCampoEmail}
                placeholder="Digite seu email"
                obrigatorio
                validacao={{ email: true }}
                validacaoTempoReal
                iconeEsquerda="📧"
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Campo Senha com Força</label>
              <CampoFormulario
                nome="senha"
                rotulo="Senha"
                tipo="password"
                valor={campoSenha}
                aoMudar={setCampoSenha}
                placeholder="Digite sua senha"
                obrigatorio
                validacao={{ minimo: 8 }}
                validacaoTempoReal
                ajuda="Mínimo 8 caracteres"
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Campo Telefone</label>
              <CampoFormulario
                nome="telefone"
                rotulo="Telefone"
                tipo="tel"
                valor={campoTelefone}
                aoMudar={setCampoTelefone}
                placeholder="(11) 99999-9999"
                validacao={{ 
                  padrao: /^\(\d{2}\) \d{5}-\d{4}$/,
                  mensagemPadrao: "Formato: (11) 99999-9999"
                }}
                iconeEsquerda="📱"
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Campo Idade</label>
              <CampoFormulario
                nome="idade"
                rotulo="Idade"
                tipo="number"
                valor={campoIdade}
                aoMudar={setCampoIdade}
                placeholder="Sua idade"
                validacao={{ 
                  numero: true,
                  valorMinimo: 18,
                  valorMaximo: 120
                }}
                tamanho="pequeno"
              />
            </div>
            
            <div className={styles.grupo}>
              <label>Campo com Contador</label>
              <CampoFormulario
                nome="descricao"
                rotulo="Descrição"
                valor={campoDescricao}
                aoMudar={setCampoDescricao}
                placeholder="Conte-nos sobre você..."
                maxCaracteres={200}
                mostrarContador
                ajuda="Máximo 200 caracteres"
              />
            </div>
          </div>
        </section>
  
        {/* Grupos de Formulário */}
        <section className={styles.secao}>
          <h2>Grupos de Formulário</h2>
          <div className={styles.grid}>
            <div className={styles.grupo}>
              <label>Grupo Básico</label>
              <GrupoFormulario
                titulo="Informações Pessoais"
                descricao="Preencha seus dados pessoais"
                icone="👤"
                layout="vertical"
              >
                <CampoFormulario
                  nome="nome-grupo"
                  rotulo="Nome"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Seu nome"
                />
                <CampoFormulario
                  nome="email-grupo"
                  rotulo="Email"
                  tipo="email"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Seu email"
                />
              </GrupoFormulario>
            </div>
            
            <div className={styles.grupo}>
              <label>Grupo Grid</label>
              <GrupoFormulario
                titulo="Endereço"
                descricao="Informações de endereço"
                icone="🏠"
                layout="grid"
                colunas={2}
                variante="cartao"
              >
                <CampoFormulario
                  nome="cep"
                  rotulo="CEP"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="00000-000"
                />
                <CampoFormulario
                  nome="cidade"
                  rotulo="Cidade"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Sua cidade"
                />
                <CampoFormulario
                  nome="estado"
                  rotulo="Estado"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="UF"
                  tamanho="pequeno"
                />
                <CampoFormulario
                  nome="pais"
                  rotulo="País"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Brasil"
                />
              </GrupoFormulario>
            </div>
            
            <div className={styles.grupo}>
              <label>Grupo Colapsável</label>
              <GrupoFormulario
                titulo="Configurações Avançadas"
                descricao="Opções adicionais (opcional)"
                icone="⚙️"
                colapsavel
                inicialmenteColapsado
                variante="sutil"
                estadoValidacao={{
                  valido: true,
                  camposValidos: 2,
                  totalCampos: 3,
                  erros: [],
                  progresso: 67
                }}
                mostrarProgresso
                acoes={[
                  { 
                    id: 'reset', 
                    rotulo: 'Resetar', 
                    tipo: 'resetar',
                    variante: 'secundaria',
                    tooltip: 'Resetar campos'
                  }
                ]}
              >
                <CampoFormulario
                  nome="tema"
                  rotulo="Tema"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Claro/Escuro"
                />
                <CampoFormulario
                  nome="notificacoes"
                  rotulo="Notificações"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Ativado/Desativado"
                />
                <CampoFormulario
                  nome="idioma"
                  rotulo="Idioma"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Português"
                />
              </GrupoFormulario>
            </div>
            
            <div className={styles.grupo}>
              <label>Grupo Inline</label>
              <GrupoFormulario
                titulo="Filtros Rápidos"
                layout="inline"
                espacamento="pequeno"
                variante="destaque"
              >
                <CampoFormulario
                  nome="busca"
                  rotulo="Buscar"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Pesquisar..."
                  tamanho="pequeno"
                />
                <CampoFormulario
                  nome="categoria"
                  rotulo="Categoria"
                  valor=""
                  aoMudar={() => {}}
                  placeholder="Todas"
                  tamanho="pequeno"
                />
                <CampoFormulario
                  nome="data"
                  rotulo="Data"
                  tipo="date"
                  valor=""
                  aoMudar={() => {}}
                  tamanho="pequeno"
                />
              </GrupoFormulario>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  export default TesteMolecules; 