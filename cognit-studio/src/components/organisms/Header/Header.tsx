import React from 'react';
import { useAutenticacao } from '../../../hooks/useAutenticacao';
import Avatar from '../../atoms/Avatar/Avatar';
import styles from './Header.module.css';

interface PropsHeader {
  aoToggleSidebar: () => void;
}

const Header: React.FC<PropsHeader> = ({ aoToggleSidebar }) => {
  const { usuario, fazerLogout } = useAutenticacao();

  return (
    <header className={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          className={styles['botao-menu']}
          onClick={aoToggleSidebar}
          aria-label="Menu"
        >
          ☰
        </button>
        <span className={styles.logo}>🤖 Cognit Studio</span>
      </div>
      <div className={styles.direita}>
        {usuario && <Avatar nome={usuario.nome} src={usuario.avatarUrl} tamanho="pequeno" />}
        <button onClick={fazerLogout} className={styles['botao-menu']} aria-label="Logout">
          ⏻
        </button>
      </div>
    </header>
  );
};

export default React.memo(Header);
