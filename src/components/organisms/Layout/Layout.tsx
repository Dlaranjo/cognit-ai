import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Container } from '../Container';
import { 
  PropriedadesLayout
} from './Layout.types';
import styles from './Layout.module.css';

export const Layout: React.FC<PropriedadesLayout> = ({
  children,
  header,
  sidebar,
  container,
  temHeader = true,
  temSidebar = true,
  sidebarColapsada = false,
  sidebarColapsavel = true,
  fixarHeader = false,
  fixarSidebar = false,
  tema = 'claro',
  responsivo = true,
  className = '',
  style = {},
  id,
  htmlProps = {},
  aoColapsar
}) => {
  const [colapsada, setColapsada] = useState(sidebarColapsada);
  const [sidebarMobileAberta, setSidebarMobileAberta] = useState(false);

  const handleColapsar = useCallback((novoColapsado: boolean) => {
    setColapsada(novoColapsado);
    if (aoColapsar) {
      aoColapsar(novoColapsado);
    }
  }, [aoColapsar]);

  const handleToggleSidebarMobile = useCallback(() => {
    setSidebarMobileAberta(aberta => !aberta);
  }, []);

  // Efeito para fechar a sidebar mobile se a tela for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarMobileAberta) {
        setSidebarMobileAberta(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarMobileAberta]);

  // Construir classes CSS
  const classesLayout = [
    styles.layout,
    temHeader ? styles['layout--com-header'] : '',
    temSidebar ? styles['layout--com-sidebar'] : '',
    colapsada ? styles['layout--sidebar-colapsada'] : '',
    sidebarMobileAberta ? styles['layout--sidebar-mobile-aberta'] : '',
    fixarHeader ? styles['layout--header-fixo'] : '',
    fixarSidebar ? styles['layout--sidebar-fixa'] : '',
    tema !== 'claro' ? styles[`layout--tema-${tema}`] : '',
    responsivo ? styles['layout--responsivo'] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classesLayout}
      style={style}
      id={id}
      {...htmlProps}
    >
      {/* Overlay para fechar sidebar mobile */}
      {sidebarMobileAberta && <div className={styles.overlayMobile} onClick={handleToggleSidebarMobile} />}

      {/* Header */}
      {temHeader && header && (
        <div className={styles.headerContainer}>
          <Header
            {...header}
            fixo={fixarHeader}
            tema={tema}
            responsivo={responsivo}
            sidebarColapsada={colapsada}
            aoAlternarSidebarMobile={handleToggleSidebarMobile}
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className={styles.conteudoPrincipal}>
        {/* Sidebar */}
        {temSidebar && sidebar && (
          <div className={styles.sidebarContainer}>
            <Sidebar
              {...sidebar}
              colapsavel={sidebarColapsavel}
              inicialmenteColapsado={colapsada}
              fixo={fixarSidebar}
              tema={tema}
              responsivo={responsivo}
              aoColapsar={handleColapsar}
              mobileAberta={sidebarMobileAberta}
            />
          </div>
        )}

        {/* Área de Conteúdo */}
        <div className={styles.areaConteudo}>
          {container ? (
            <Container
              {...container}
              tema={tema}
            >
              {children}
            </Container>
          ) : (
            <div className={styles.conteudoDefault}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout; 