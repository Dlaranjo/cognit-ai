import React, { useState } from 'react';
import { Botao, Input, Avatar, Switch, Spinner, SpinnerPontos, Tooltip } from '../components/atoms';
import styles from './TestePaginas.module.css';

/**
 * Página de teste para validar componentes atoms
 */
const TesteAtoms: React.FC = () => {
  const [valorInput, setValorInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [switchPequeno, setSwitchPequeno] = useState(false);
  const [switchMedio, setSwitchMedio] = useState(true);

  const handleBotaoClick = () => {
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <h1>Teste de Componentes - Atoms</h1>
      
      {/* Seção Botões */}
      <section className={styles.secao}>
        <h2>Botões</h2>
        <div className={styles.grid}>
          <Botao variante="primario" aoClicar={handleBotaoClick}>
            Botão Primário
          </Botao>
          <Botao variante="secundario">
            Botão Secundário
          </Botao>
          <Botao variante="perigo">
            Botão Perigo
          </Botao>
          <Botao variante="fantasma">
            Botão Fantasma
          </Botao>
        </div>
        
        <div className={styles.grid}>
          <Botao tamanho="pequeno" variante="primario">
            Pequeno
          </Botao>
          <Botao tamanho="medio" variante="primario">
            Médio
          </Botao>
          <Botao tamanho="grande" variante="primario">
            Grande
          </Botao>
        </div>
        
        <div className={styles.grid}>
          <Botao carregando={carregando} variante="primario">
            {carregando ? 'Carregando...' : 'Teste Loading'}
          </Botao>
          <Botao desabilitado>
            Desabilitado
          </Botao>
          <Botao larguraCompleta variante="primario">
            Largura Completa
          </Botao>
        </div>
      </section>

      {/* Seção Inputs */}
      <section className={styles.secao}>
        <h2>Inputs</h2>
        <div className={styles.grid}>
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            valor={valorInput}
            aoMudar={setValorInput}
          />
          <Input
            label="Email"
            tipo="email"
            placeholder="Digite seu email"
            obrigatorio
          />
          <Input
            label="Senha"
            tipo="password"
            placeholder="Digite sua senha"
            ajuda="Mínimo 8 caracteres"
          />
        </div>
        
        <div className={styles.grid}>
          <Input
            label="Pequeno"
            tamanho="pequeno"
            placeholder="Input pequeno"
          />
          <Input
            label="Médio"
            tamanho="medio"
            placeholder="Input médio"
          />
          <Input
            label="Grande"
            tamanho="grande"
            placeholder="Input grande"
          />
        </div>
        
        <div className={styles.grid}>
          <Input
            label="Com erro"
            placeholder="Input com erro"
            erro="Este campo é obrigatório"
          />
          <Input
            label="Desabilitado"
            placeholder="Input desabilitado"
            desabilitado
          />
          <Input
            label="Somente leitura"
            valor="Valor fixo"
            somenteEscrita
          />
        </div>
      </section>

      {/* Seção Avatares */}
      <section className={styles.secao}>
        <h2>Avatares</h2>
        <div className={styles.grid}>
          <Avatar nome="João Silva" />
          <Avatar nome="Maria Santos" />
          <Avatar nome="Pedro Oliveira" />
          <Avatar nome="Ana Costa" />
        </div>
        
        <div className={styles.grid}>
          <Avatar nome="Pequeno" tamanho="pequeno" />
          <Avatar nome="Médio" tamanho="medio" />
          <Avatar nome="Grande" tamanho="grande" />
          <Avatar nome="Extra Grande" tamanho="extra-grande" />
        </div>
        
        <div className={styles.grid}>
          <Avatar nome="Circular" formato="circular" />
          <Avatar nome="Quadrado" formato="quadrado" />
        </div>
        
        <div className={styles.grid}>
          <Avatar nome="Online" statusOnline />
          <Avatar nome="Clicável" clicavel aoClicar={() => alert('Avatar clicado!')} />
          <Avatar 
            nome="Personalizado" 
            corFundo="#FF6B35" 
            corTexto="white" 
          />
        </div>
      </section>

      {/* Switches */}
      <section className={styles.secao}>
        <h2>Switches</h2>
        <div className={styles.grid}>
          <div className={styles.grupo}>
            <label>Pequeno</label>
            <Switch
              ativo={switchPequeno}
              aoAlterar={setSwitchPequeno}
              tamanho="pequeno"
              rotulo="Notificações"
            />
          </div>
          
          <div className={styles.grupo}>
            <label>Médio</label>
            <Switch
              ativo={switchMedio}
              aoAlterar={setSwitchMedio}
              tamanho="medio"
              rotulo="Modo escuro"
            />
          </div>
          
          <div className={styles.grupo}>
            <label>Desabilitado</label>
            <Switch
              ativo={false}
              aoAlterar={() => {}}
              desabilitado
              rotulo="Indisponível"
            />
          </div>
        </div>
      </section>

      {/* Spinners */}
      <section className={styles.secao}>
        <h2>Spinners</h2>
        <div className={styles.grid}>
          <div className={styles.grupo}>
            <label>Pequeno</label>
            <Spinner tamanho="pequeno" />
          </div>
          
          <div className={styles.grupo}>
            <label>Médio</label>
            <Spinner tamanho="medio" mostrarTexto textoCarregamento="Carregando..." />
          </div>
          
          <div className={styles.grupo}>
            <label>Grande</label>
            <Spinner tamanho="grande" variante="primario" />
          </div>
          
          <div className={styles.grupo}>
            <label>Pontos</label>
            <SpinnerPontos tamanho="medio" mostrarTexto textoCarregamento="Processando..." />
          </div>
          
          <div className={styles.grupo}>
            <label>Secundário</label>
            <Spinner variante="secundario" mostrarTexto textoCarregamento="Aguarde..." />
          </div>
        </div>
      </section>

      {/* Tooltips */}
      <section className={styles.secao}>
        <h2>Tooltips</h2>
        <div className={styles.grid}>
          <div className={styles.grupo}>
            <label>Hover (Cima)</label>
            <Tooltip conteudo="Este é um tooltip simples" posicao="cima">
              <Botao variante="secundario">Hover aqui</Botao>
            </Tooltip>
          </div>
          
          <div className={styles.grupo}>
            <label>Click (Baixo)</label>
            <Tooltip conteudo="Tooltip ativado por click" posicao="baixo" trigger="click">
              <Botao variante="primario">Clique aqui</Botao>
            </Tooltip>
          </div>
          
          <div className={styles.grupo}>
            <label>Com Seta</label>
            <Tooltip conteudo="Tooltip com seta personalizada" posicao="direita" comSeta>
              <Botao variante="fantasma">Com seta</Botao>
            </Tooltip>
          </div>
          
          <div className={styles.grupo}>
            <label>Conteúdo Rico</label>
            <Tooltip 
              conteudo={
                <div>
                  <h4>Título do Tooltip</h4>
                  <p>Este é um tooltip com conteúdo mais rico e detalhado.</p>
                </div>
              }
              tamanhoMaximo="grande"
              posicao="esquerda"
            >
              <Botao variante="perigo">Conteúdo Rico</Botao>
            </Tooltip>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TesteAtoms; 