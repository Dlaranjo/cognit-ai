import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import styles from './Login.module.css';

const PaginaLogin: React.FC = () => {
  const { fazerLogin, carregando, autenticado } = useAutenticacao();
  const navegar = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      await fazerLogin();
    } catch (error) {
      console.error('Erro no login:', error);
      // Em um cenário real, mostraríamos uma notificação de erro
    }
  };

  useEffect(() => {
    if (autenticado) {
      navegar('/chat', { replace: true });
    }
  }, [autenticado, navegar]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Logo e Branding */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>🤖</div>
          <h1 className={styles.subtitle}>Cognit Studio</h1>
          <p className={styles.description}>
            Agregador de LLMs para potencializar sua produtividade
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className={styles.loginContent}>
          <h2 className={styles.welcomeText}>
            Bem-vindo de volta
          </h2>
          <p className={styles.loginDescription}>
            Acesse sua conta para continuar conversando com os melhores modelos de IA
          </p>

          {/* Botão de Login */}
          <button
            onClick={handleLogin}
            disabled={carregando}
            className={styles.loginButton}
            aria-label={carregando ? 'Fazendo login...' : 'Entrar com Google'}
          >
            {carregando ? (
              <>
                <div className={styles.loadingSpinner} />
                Entrando...
              </>
            ) : (
              <>
                <div className={styles.googleIcon} />
                Entrar com Google
              </>
            )}
          </button>
        </div>

        {/* Features */}
        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>O que você pode fazer</h3>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Converse com múltiplos modelos de IA</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Upload de arquivos e documentos</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Histórico completo de conversas</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Interface moderna e intuitiva</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>
            Ao continuar, você concorda com nossos{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaginaLogin;