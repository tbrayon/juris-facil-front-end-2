import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  FileSignature,
  LogOut,
  BarChart3,
  FileBarChart,
  Shield,
  HomeIcon,
  Contact,
  LifeBuoy,
} from 'lucide-react';

import { Toaster } from './ui/sonner';
// import { useIsMobile } from '../others/use-mobile'; // <-- Removido, não é mais necessário para esta lógica

import { ClientesView } from './Clientes';
import { ProcessosView } from './ProcessosView';
import PrazosView from './PrazosView';
import { ContratosView } from './Contratos';
import { DashboardView } from './Dashboard';
import { RelatoriosView } from './RelatoriosView';
import { UsuariosView } from './Usuarios';
import { Home } from './Home';
import Header from './Header';
import Menu from './Menu';
import { CookieConsentBanner } from './CookieConsentBanner';
import { Footer } from './Footer';
import { Sac } from './Sac';
import { TermosDeUso } from './Termos-de-uso';
import { PoliticaDePrivacidade } from './Politica-de-privacidade';
import { PoliticaDeCookies } from './Politica-de-cookies';
import { AppView } from '../others/navigation';

interface LayoutProps {
  userName: string;
  userTipo: string;
  onLogout: () => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export default function Layout({
  userName,
  userTipo,
  onLogout,
  currentView,
  onNavigate,
}: LayoutProps) {
  const [clienteIdParaEditar, setClienteIdParaEditar] = useState<string | null>(null);
  const [processoIdParaEditar, setProcessoIdParaEditar] = useState<string | null>(null);
  // const isMobile = useIsMobile(); // <-- Removido

  const handleVoltarInicio = () => {
    onNavigate('home');
    setClienteIdParaEditar(null);
    setProcessoIdParaEditar(null);
  };

  const handleEditarCliente = (clienteId: string) => {
    setClienteIdParaEditar(clienteId);
    onNavigate('clientes');
  };

  const handleEditarProcesso = (processoId: string) => {
    setProcessoIdParaEditar(processoId);
    onNavigate('processos');
  };

  const CurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home userTipo={userTipo} onNavigate={onNavigate} />;
      case 'dashboard':
        return <DashboardView onVoltar={handleVoltarInicio} usuarioTipo={userTipo} />;
      case 'clientes':
        return (
          <ClientesView
            clienteIdParaEditar={clienteIdParaEditar}
            onClearClienteIdParaEditar={() => setClienteIdParaEditar(null)}
            onVoltar={handleVoltarInicio}
          />
        );
      case 'processos':
        return (
          <ProcessosView
            processoIdParaEditar={processoIdParaEditar}
            onClearProcessoIdParaEditar={() => setProcessoIdParaEditar(null)}
            onVoltar={handleVoltarInicio}
          />
        );
      case 'prazos':
        return <PrazosView onVoltar={handleVoltarInicio} />;
      case 'contratos':
        return <ContratosView onVoltar={handleVoltarInicio} />;
      case 'relatorios':
        return (
          <RelatoriosView
            onEditarCliente={handleEditarCliente}
            onEditarProcesso={handleEditarProcesso}
            onVoltar={handleVoltarInicio}
          />
        );
      case 'usuarios':
        return userTipo === 'administrador' ? (
          <UsuariosView onVoltar={handleVoltarInicio} />
        ) : null;
      case 'suporte':
        return <Sac onNavigate={onNavigate} />;
      case 'termos':
        return <TermosDeUso onNavigate={onNavigate} />;
      case 'privacidade':
        return <PoliticaDePrivacidade onNavigate={onNavigate} />;
      case 'cookies':
        return <PoliticaDeCookies onNavigate={onNavigate} />;
      default:
        return <Home userTipo={userTipo} onNavigate={onNavigate} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="min-h-screen bg-[#f6f3ee] flex flex-col">
        {/* HEADER — com menu mobile/tablet embutido */}
        <Header
          userName={userName}
          userTipo={userTipo}
          onLogout={onLogout}
          onVoltarInicio={handleVoltarInicio}
          onNavigate={onNavigate}
        />

        {/* MENU DESKTOP (Mostrado apenas em telas 'lg' ou maiores) */}
        <div className="hidden lg:block"> {/* <-- LÓGICA ALTERADA */}
          {currentView !== 'home' &&
            !['termos', 'privacidade', 'cookies', 'suporte'].includes(currentView) && (
              <Menu activeView={currentView} userTipo={userTipo} onNavigate={onNavigate} />
            )}
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 w-full p-4 md:p-8">
          <div
            className={
              !['termos', 'privacidade', 'cookies', 'suporte'].includes(currentView)
                ? 'max-w-7xl mx-auto'
                : ''
            }
          >
            <CurrentView />
          </div>
        </main>

        {/* FOOTER + COOKIES */}
        <Footer onNavigate={onNavigate} />
        <CookieConsentBanner onNavigate={onNavigate} />
      </div>
    </>
  );
}
