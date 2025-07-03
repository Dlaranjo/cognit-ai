import React, { useState } from 'react';
import styles from './Layout.module.css';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

interface PropriedadesLayout {
  children: React.ReactNode;
}

const Layout: React.FC<PropriedadesLayout> = ({ children }) => {
  const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);

  return (
    <div className={styles.layout}>
      <aside
        className={sidebarAberta ? styles.sidebar : `${styles.sidebar} ${styles['sidebar--fechada']}`}
      >
        <Sidebar quandoSelecionar={() => setSidebarAberta(false)} />
      </aside>

      <div className={styles.main}>
        <Header aoToggleSidebar={() => setSidebarAberta((s) => !s)} />
        <main className={styles.conteudo}>{children}</main>
      </div>
    </div>
  );
};

export default React.memo(Layout);
