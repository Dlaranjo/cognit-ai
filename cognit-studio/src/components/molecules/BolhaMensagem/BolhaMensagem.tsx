import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import classNames from 'classnames';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import styles from './BolhaMensagem.module.css';
import { PropriedadesBolhaMensagem } from './BolhaMensagem.types';

const BolhaMensagem: React.FC<PropriedadesBolhaMensagem> = ({
  conteudoMarkdown,
  autor,
  timestampISO,
  aoCurtir,
  aoDescurtir,
  aoCopiar,
}) => {
  const htmlSeguro = DOMPurify.sanitize(marked.parse(conteudoMarkdown) as string);
  const classeBolha = classNames(styles.bolha, {
    [styles['bolha--usuario']]: autor === 'usuario',
    [styles['bolha--assistente']]: autor === 'assistente',
  });

  const timestampFormatado = format(new Date(timestampISO), 'HH:mm', { locale: ptBR });

  const copiarConteudo = (): void => {
    navigator.clipboard.writeText(conteudoMarkdown);
    aoCopiar?.();
  };

  return (
    <div className={classeBolha}>
      <div dangerouslySetInnerHTML={{ __html: htmlSeguro }} />
      <div className={styles.rodape}>
        <span>{timestampFormatado}</span>
        <button className={styles['botao-acao']} onClick={aoCurtir} aria-label="Curtir">👍</button>
        <button className={styles['botao-acao']} onClick={aoDescurtir} aria-label="Descurtir">👎</button>
        <button className={styles['botao-acao']} onClick={copiarConteudo} aria-label="Copiar">📋</button>
      </div>
    </div>
  );
};

export default React.memo(BolhaMensagem);
