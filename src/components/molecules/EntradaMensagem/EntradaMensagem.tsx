import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Botao } from '../../atoms/Botao';
import { Tooltip } from '../../atoms/Tooltip';
import { 
  PropriedadesEntradaMensagem, 
  EstadoEntradaMensagem 
} from './EntradaMensagem.types';
import styles from './EntradaMensagem.module.css';

export const EntradaMensagem: React.FC<PropriedadesEntradaMensagem> = ({
  valor,
  aoMudar,
  aoEnviar,
  placeholder = "Digite sua mensagem...",
  carregando = false,
  desabilitado = false,
  maxLinhas = 6,
  minLinhas = 1,
  maxCaracteres,
  mostrarContador = false,
  envioComCtrl = false,
  permitirAnexos = false,
  aoAnexar,
  anexos = [],
  aoRemoverAnexo,
  sugestoes = [],
  aoSelecionarSugestao,
  autoFoco = false,
  aoFocar,
  aoDesfocar,
  className = '',
  style = {},
  id,
  htmlProps = {}
}) => {
  const [estado, setEstado] = useState<EstadoEntradaMensagem>({
    focado: false,
    altura: 0,
    posicaoCursor: 0,
    textoSelecionado: '',
    arrastando: false,
    sugestaoAtiva: undefined
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputArquivoRef = useRef<HTMLInputElement>(null);

  // Auto-foco
  useEffect(() => {
    if (autoFoco && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFoco]);

  // Auto-redimensionamento
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const ajustarAltura = (): void => {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24; // Altura da linha em pixels
      const maxHeight = lineHeight * maxLinhas;
      const minHeight = lineHeight * minLinhas;
      
      const novaAltura = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${novaAltura}px`;
      
      setEstado(prev => ({ ...prev, altura: novaAltura }));
    };

    ajustarAltura();
  }, [valor, maxLinhas, minLinhas]);

  const handleMudanca = useCallback((novoValor: string): void => {
    if (maxCaracteres && novoValor.length > maxCaracteres) {
      return;
    }
    aoMudar(novoValor);
  }, [aoMudar, maxCaracteres]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const textarea = e.currentTarget;
    
    // Envio com Enter ou Ctrl+Enter
    if (e.key === 'Enter') {
      if (envioComCtrl ? e.ctrlKey : !e.shiftKey) {
        e.preventDefault();
        if (valor.trim() && !carregando && !desabilitado) {
          aoEnviar();
        }
      }
    }
    
    // Navegação nas sugestões
    if (sugestoes.length > 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setEstado(prev => ({
          ...prev,
          sugestaoAtiva: prev.sugestaoAtiva === undefined 
            ? sugestoes.length - 1 
            : Math.max(0, prev.sugestaoAtiva - 1)
        }));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setEstado(prev => ({
          ...prev,
          sugestaoAtiva: prev.sugestaoAtiva === undefined 
            ? 0 
            : Math.min(sugestoes.length - 1, prev.sugestaoAtiva + 1)
        }));
      } else if (e.key === 'Tab' && estado.sugestaoAtiva !== undefined) {
        e.preventDefault();
        const sugestao = sugestoes[estado.sugestaoAtiva];
        if (sugestao && aoSelecionarSugestao) {
          aoSelecionarSugestao(sugestao);
        }
      }
    }

    // Atualizar posição do cursor
    setEstado(prev => ({
      ...prev,
      posicaoCursor: textarea.selectionStart,
      textoSelecionado: textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
    }));
  }, [valor, carregando, desabilitado, aoEnviar, envioComCtrl, sugestoes, estado.sugestaoAtiva, aoSelecionarSugestao]);

  const handleFoco = useCallback((): void => {
    setEstado(prev => ({ ...prev, focado: true }));
    if (aoFocar) {
      aoFocar();
    }
  }, [aoFocar]);

  const handleDesfoco = useCallback((): void => {
    setEstado(prev => ({ ...prev, focado: false, sugestaoAtiva: undefined }));
    if (aoDesfocar) {
      aoDesfocar();
    }
  }, [aoDesfocar]);

  const handleArrastar = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setEstado(prev => ({ ...prev, arrastando: true }));
    } else if (e.type === 'dragleave') {
      setEstado(prev => ({ ...prev, arrastando: false }));
    }
  }, []);

  const handleSoltar = useCallback((e: React.DragEvent): void => {
      e.preventDefault();
    e.stopPropagation();
    
    setEstado(prev => ({ ...prev, arrastando: false }));
    
    if (permitirAnexos && aoAnexar) {
      const arquivos = Array.from(e.dataTransfer.files);
      aoAnexar(arquivos);
    }
  }, [permitirAnexos, aoAnexar]);

  const handleSelecionarArquivos = useCallback((): void => {
    if (inputArquivoRef.current) {
      inputArquivoRef.current.click();
    }
  }, []);

  const handleMudancaArquivos = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const arquivos = Array.from(e.target.files || []);
    if (arquivos.length > 0 && aoAnexar) {
      aoAnexar(arquivos);
    }
    // Limpar o input para permitir seleção do mesmo arquivo novamente
    e.target.value = '';
  }, [aoAnexar]);

  const handleSelecionarSugestao = useCallback((sugestao: string): void => {
    if (aoSelecionarSugestao) {
      aoSelecionarSugestao(sugestao);
    }
    setEstado(prev => ({ ...prev, sugestaoAtiva: undefined }));
  }, [aoSelecionarSugestao]);

  const renderAnexos = (): React.ReactNode => {
    if (!anexos.length) return null;

    return (
      <div className={styles.anexos}>
        {anexos.map((anexo) => (
          <div key={anexo.id} className={styles.anexo}>
            <span className={styles.nomeAnexo}>{anexo.nome}</span>
            <span className={styles.tamanhoAnexo}>
              {formatarTamanhoArquivo(anexo.tamanho)}
            </span>
            {anexo.enviando && <span className={styles.enviando}>Enviando...</span>}
            {anexo.erro && <span className={styles.erro}>{anexo.erro}</span>}
            {aoRemoverAnexo && (
              <button
                className={styles.removerAnexo}
                onClick={() => aoRemoverAnexo(anexo.id)}
                aria-label={`Remover ${anexo.nome}`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSugestoes = (): React.ReactNode => {
    if (!sugestoes.length || !estado.focado) return null;

    return (
      <div className={styles.sugestoes}>
        {sugestoes.map((sugestao, index) => (
          <button
            key={index}
            className={`${styles.sugestao} ${
              index === estado.sugestaoAtiva ? styles.sugestaoAtiva : ''
            }`}
            onClick={() => handleSelecionarSugestao(sugestao)}
            onMouseEnter={() => setEstado(prev => ({ ...prev, sugestaoAtiva: index }))}
          >
            {sugestao}
          </button>
        ))}
      </div>
    );
  };

  const renderContador = (): React.ReactNode => {
    if (!mostrarContador || !maxCaracteres) return null;

    const caracteresRestantes = maxCaracteres - valor.length;
    const proximoLimite = caracteresRestantes < 20;

    return (
      <span className={`${styles.contador} ${proximoLimite ? styles.contadorAviso : ''}`}>
        {caracteresRestantes}
      </span>
    );
  };

  const formatarTamanhoArquivo = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const podeEnviar = valor.trim() && !carregando && !desabilitado;

  // Construir classes CSS
  const classesContainer = [
    styles.container,
    estado.focado ? styles.focado : '',
    estado.arrastando ? styles.arrastando : '',
    carregando ? styles.carregando : '',
    desabilitado ? styles.desabilitado : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={classesContainer}
      style={style}
      id={id}
      onDragEnter={handleArrastar}
      onDragOver={handleArrastar}
      onDragLeave={handleArrastar}
      onDrop={handleSoltar}
      {...htmlProps}
    >
      {renderAnexos()}
      
      <div className={styles.entrada}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={valor}
          placeholder={placeholder}
          onChange={(e) => handleMudanca(e.target.value)}
        onKeyDown={handleKeyDown}
          onFocus={handleFoco}
          onBlur={handleDesfoco}
          disabled={desabilitado}
          rows={minLinhas}
          maxLength={maxCaracteres}
          aria-label="Digite sua mensagem"
          aria-describedby={mostrarContador ? `${id}-contador` : undefined}
      />
        
        <div className={styles.acoes}>
          {permitirAnexos && (
            <Tooltip conteudo="Anexar arquivo">
      <button
                className={styles.botaoAnexo}
                onClick={handleSelecionarArquivos}
                disabled={desabilitado}
                aria-label="Anexar arquivo"
              >
                📎
              </button>
            </Tooltip>
          )}
          
          {renderContador()}
          
          <Botao
            variante="primario"
            tamanho="pequeno"
            aoClicar={aoEnviar}
            desabilitado={!podeEnviar}
            carregando={carregando}
            className={styles.botaoEnviar}
            aria-label="Enviar mensagem"
      >
        ➤
          </Botao>
        </div>
      </div>
      
      {renderSugestoes()}
      
      {permitirAnexos && (
        <input
          ref={inputArquivoRef}
          type="file"
          multiple
          className={styles.inputArquivo}
          onChange={handleMudancaArquivos}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default EntradaMensagem; 