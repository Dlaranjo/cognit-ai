import React from 'react';
import { Header, Sidebar, Container, Layout } from '../components/organisms';
import styles from './TestePaginas.module.css';

const TesteOrganisms: React.FC = () => {
    return (
      <div className={styles.container}>
        <h1>Teste de Componentes - Organisms</h1>

        <section className={styles.secao}>
            <h2>Organisms - Layout Components</h2>
            
            {/* Header */}
            <div className={styles.grupo}>
            <h3>Header</h3>
            <div className={styles.showcase}>
                <Header
                titulo="Cognit Studio"
                subtitulo="Agregador de LLMs"
                navegacao={[
                    { id: 'home', rotulo: 'Home', href: '/', ativo: true },
                    { id: 'chat', rotulo: 'Chat', href: '/chat' },
                    { id: 'historico', rotulo: 'Histórico', href: '/historico' }
                ]}
                usuario={{
                    id: 'user1',
                    nome: 'João Silva',
                    email: 'joao@exemplo.com',
                    avatar: 'JS'
                }}
                busca={{
                    placeholder: 'Buscar conversas...',
                    valor: '',
                    aoMudar: () => {}
                }}
                notificacoes={{
                    contador: 3,
                    itens: [
                    { id: '1', titulo: 'Nova mensagem', descricao: 'Você tem uma nova mensagem', timestamp: new Date(), tipo: 'info', lida: false },
                    { id: '2', titulo: 'Sistema atualizado', descricao: 'O sistema foi atualizado', timestamp: new Date(), tipo: 'sucesso', lida: false }
                    ]
                }}
                acoes={[
                    { id: 'config', rotulo: 'Configurações', icone: '⚙️', tipo: 'botao' },
                    { id: 'ajuda', rotulo: 'Ajuda', icone: '❓', tipo: 'botao' }
                ]}
                />
            </div>
            </div>

            {/* Sidebar */}
            <div className={styles.grupo}>
            <h3>Sidebar</h3>
            <div className={styles.showcase}>
                <div style={{ height: '400px', display: 'flex', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Sidebar
                    navegacao={[
                    {
                        id: 'dashboard',
                        rotulo: 'Dashboard',
                        icone: '📊',
                        href: '/dashboard',
                        ativo: true
                    },
                    {
                        id: 'chat',
                        rotulo: 'Chat',
                        icone: '💬',
                        href: '/chat',
                        badge: { texto: '3', variante: 'primario' },
                        subItens: [
                        { id: 'nova-conversa', rotulo: 'Nova Conversa', href: '/chat/nova' },
                        { id: 'historico', rotulo: 'Histórico', href: '/chat/historico' }
                        ]
                    },
                    {
                        id: 'modelos',
                        rotulo: 'Modelos',
                        icone: '🤖',
                        href: '/modelos',
                        subItens: [
                        { id: 'gpt-4', rotulo: 'GPT-4', href: '/modelos/gpt-4' },
                        { id: 'claude', rotulo: 'Claude', href: '/modelos/claude' },
                        { id: 'gemini', rotulo: 'Gemini', href: '/modelos/gemini' }
                        ]
                    },
                    {
                        id: 'configuracoes',
                        rotulo: 'Configurações',
                        icone: '⚙️',
                        href: '/configuracoes'
                    }
                    ]}
                    grupos={[
                    {
                        id: 'ferramentas',
                        titulo: 'Ferramentas',
                        items: [
                        { id: 'upload', rotulo: 'Upload de Arquivos', icone: '📁', href: '/upload' },
                        { id: 'templates', rotulo: 'Templates', icone: '📝', href: '/templates' }
                        ]
                    }
                    ]}
                    busca={{
                    placeholder: 'Buscar...',
                    valor: '',
                    aoMudar: () => {}
                    }}
                    usuario={{
                    id: 'user1',
                    nome: 'João Silva',
                    email: 'joao@exemplo.com',
                    avatar: 'JS'
                    }}
                    colapsavel
                    tema="claro"
                />
                <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
                    <h4>Área Principal</h4>
                    <p>Conteúdo da aplicação apareceria aqui.</p>
                </div>
                </div>
            </div>
            </div>

            {/* Container */}
            <div className={styles.grupo}>
            <h3>Container</h3>
            <div className={styles.showcase}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Container Básico */}
                <Container
                    tipo="responsivo"
                    tamanhoMaximo="medio"
                    padding="medio"
                    borda
                    raioBorda="medio"
                    sombra="pequena"
                >
                    <h4>Container Básico</h4>
                    <p>Este é um container responsivo com padding médio, borda e sombra.</p>
                </Container>

                {/* Container com Grid */}
                <Container
                    tipo="fluido"
                    padding="grande"
                    corFundo="#f0f9ff"
                    borda
                    raioBorda="grande"
                    sombra="media"
                >
                    <h4>Container com Grid</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h5>Card 1</h5>
                        <p>Conteúdo do primeiro card</p>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h5>Card 2</h5>
                        <p>Conteúdo do segundo card</p>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h5>Card 3</h5>
                        <p>Conteúdo do terceiro card</p>
                    </div>
                    </div>
                </Container>

                {/* Container Centralizado */}
                <Container
                    tipo="centrado"
                    tamanhoMaximo="pequeno"
                    padding="extra-grande"
                    centralizar
                    altura="200px"
                    corFundo="#fff7ed"
                    borda
                    raioBorda="grande"
                    sombra="grande"
                >
                    <div style={{ textAlign: 'center' }}>
                    <h4>Container Centralizado</h4>
                    <p>Conteúdo centralizado vertical e horizontalmente</p>
                    </div>
                </Container>

                {/* Container com Scroll */}
                <Container
                    tipo="fixo"
                    tamanhoMaximo="medio"
                    padding="medio"
                    scroll
                    altura="150px"
                    borda
                    raioBorda="medio"
                    sombra="pequena"
                >
                    <h4>Container com Scroll</h4>
                    <p>Este container tem altura fixa e scroll interno.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </Container>
                </div>
            </div>
            </div>

            {/* Layout Integrado */}
            <div className={styles.grupo}>
            <h3>Layout Integrado (Header + Sidebar + Container)</h3>
            <div className={styles.showcase}>
                <div style={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                <Layout
                    header={{
                    titulo: "Cognit Studio",
                    navegacao: [
                        { id: 'home', rotulo: 'Home', href: '/', ativo: true },
                        { id: 'chat', rotulo: 'Chat', href: '/chat' },
                        { id: 'historico', rotulo: 'Histórico', href: '/historico' }
                    ],
                    usuario: {
                        id: 'user1',
                        nome: 'João Silva',
                        email: 'joao@exemplo.com',
                        avatar: 'JS'
                    },
                    busca: {
                        placeholder: 'Buscar conversas...',
                        valor: '',
                        aoMudar: () => {}
                    },
                    notificacoes: {
                        contador: 3,
                        itens: [
                        { id: '1', titulo: 'Nova mensagem', descricao: 'Você tem uma nova mensagem', timestamp: new Date(), tipo: 'info', lida: false }
                        ]
                    },
                    acoes: [
                        { id: 'config', rotulo: 'Configurações', icone: '⚙️', tipo: 'botao' },
                        { id: 'ajuda', rotulo: 'Ajuda', icone: '❓', tipo: 'botao' }
                    ]
                    }}
                    sidebar={{
                    navegacao: [
                        {
                        id: 'dashboard',
                        rotulo: 'Dashboard',
                        icone: '📊',
                        href: '/dashboard',
                        ativo: true
                        },
                        {
                        id: 'chat',
                        rotulo: 'Chat',
                        icone: '💬',
                        href: '/chat',
                        badge: { texto: '3', variante: 'primario' },
                        subitems: [
                            { id: 'nova-conversa', rotulo: 'Nova Conversa', href: '/chat/nova' },
                            { id: 'historico', rotulo: 'Histórico', href: '/chat/historico' }
                        ]
                        },
                        {
                        id: 'modelos',
                        rotulo: 'Modelos',
                        icone: '🤖',
                        href: '/modelos',
                        subitems: [
                            { id: 'gpt-4', rotulo: 'GPT-4', href: '/modelos/gpt-4' },
                            { id: 'claude', rotulo: 'Claude', href: '/modelos/claude' },
                            { id: 'gemini', rotulo: 'Gemini', href: '/modelos/gemini' }
                        ]
                        }
                    ],
                    grupos: [
                        {
                        id: 'ferramentas',
                        titulo: 'Ferramentas',
                        items: [
                            { id: 'upload', rotulo: 'Upload de Arquivos', icone: '📁', href: '/upload' },
                            { id: 'templates', rotulo: 'Templates', icone: '📝', href: '/templates' }
                        ]
                        }
                    ],
                    busca: {
                        placeholder: 'Buscar...',
                        valor: '',
                        aoMudar: () => {}
                    },
                    usuario: {
                        id: 'user1',
                        nome: 'João Silva',
                        email: 'joao@exemplo.com',
                        avatar: 'JS'
                    }
                    }}
                    container={{
                    tipo: 'responsivo',
                    padding: 'grande',
                    scroll: true
                    }}
                    sidebarColapsavel
                    tema="claro"
                    responsivo
                >
                    <div style={{ padding: '20px' }}>
                    <h2>Área Principal da Aplicação</h2>
                    <p>Este é um exemplo de como o Layout integrado funciona com Header, Sidebar e Container trabalhando juntos.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
                        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h4>Card de Exemplo 1</h4>
                        <p>Conteúdo do primeiro card na área principal.</p>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h4>Card de Exemplo 2</h4>
                        <p>Conteúdo do segundo card na área principal.</p>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h4>Card de Exemplo 3</h4>
                        <p>Conteúdo do terceiro card na área principal.</p>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '40px' }}>
                        <h3>Conteúdo Adicional</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                    </div>
                    </div>
                </Layout>
                </div>
            </div>
            </div>
        </section>

      </div>
    );
  };
  
  export default TesteOrganisms; 