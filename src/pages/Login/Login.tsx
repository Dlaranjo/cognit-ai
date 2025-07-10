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
        {/* Brand Identity */}
        <div className={styles.brandContainer}>
          <div className={styles.brandIcon} />
          <h1 className={styles.brandName}>Cognit Studio</h1>
          <p className={styles.brandTagline}>
            Agregador de LLMs para potencializar sua produtividade
          </p>
        </div>

        {/* Login Content */}
        <div className={styles.loginContent}>
          <h2 className={styles.welcomeTitle}>
            Bem-vindo de volta
          </h2>
          <p className={styles.welcomeSubtitle}>
            Acesse sua conta para continuar conversando com os melhores modelos de IA disponíveis
          </p>

          {/* Login Button */}
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
                Continuar com Google
              </>
            )}
          </button>
        </div>

        {/* Features Grid */}
        <div className={styles.features}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Múltiplos modelos de IA</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Upload de documentos</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Histórico completo</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon} />
              <span>Interface intuitiva</span>
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