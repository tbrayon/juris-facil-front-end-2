import { useState } from 'react';

import { Toaster } from './ui/sonner';

import { ClientsView } from './ClientsView';
import PrazosView from './Prazos';
import { DashboardView } from './DashboardView';
import { RelatoriosView } from './RelatoriosView';
import { UsuariosView } from './Usuarios';
import { Home } from './Home';
import Header from './Header';
import Menu from './Menu';
import { CookieConsentBanner } from './CookieConsentBanner';
import { Footer } from './Footer';
import { CustomerService } from './CustomerService';
import { TermsOfUse } from './TermsOfUse';
import { PrivacyPolicy } from './PrivacyPolicy';
import { CookiesPolicy } from './CookiesPolicy';

import { AppView } from '../types/navigation';
import { useUsers } from '@/contexts/UsersContext';
import { ProcessesView } from './ProcessesView';
import { ContractsView } from './ContractsView';
import { useAppStore } from '@/store/useAppStore';

interface LayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

export default function Layout({
  onLogout,
}: LayoutProps) {
  const [processoIdParaEditar, setProcessoIdParaEditar] = useState<string | null>(null);
  const { currentUser } = useUsers();
  const {
    currentView,
    setView,
  } = useAppStore();

  const onNavigate = setView;

  const handleVoltarInicio = () => {
    onNavigate('home');
    // setClienteIdParaEditar(null);
    setProcessoIdParaEditar(null);
  };

  const handleEditarCliente = (clienteId: string) => {
    // setClienteIdParaEditar(clienteId);
    onNavigate('clientes');
  };

  const handleEditarProcesso = (processoId: string) => {
    setProcessoIdParaEditar(processoId);
    onNavigate('processos');
  };

  const CurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={onNavigate} />;
      case 'clientes':
        return (
          <ClientsView
            onNavigate={onNavigate}
          />
        );
      case 'processos':
        // return (
        //   <ProcessosView
        //     processoIdParaEditar={processoIdParaEditar}
        //     onClearProcessoIdParaEditar={() => setProcessoIdParaEditar(null)}
        //     onVoltar={handleVoltarInicio}
        //   />
        // );

        return (
          <ProcessesView
            onNavigate={onNavigate}
          />
        )

      case 'prazos':
        return <PrazosView onVoltar={handleVoltarInicio} />;
      case 'contratos':
        return <ContractsView onNavigate={onNavigate} />;
      //   return <ContratosView onVoltar={handleVoltarInicio} />;
      case 'relatorios':
        return (
          <RelatoriosView
            onEditarCliente={handleEditarCliente}
            onEditarProcesso={handleEditarProcesso}
            onVoltar={handleVoltarInicio}
          />
        );
      case 'dashboard':
        return <DashboardView onNavigate={onNavigate} />;

      case 'usuarios':
        return currentUser?.role === 'admin' ? (
          <UsuariosView onVoltar={handleVoltarInicio} />
        ) : null;
      case 'suporte':
        return <CustomerService onNavigate={onNavigate} />;
      case 'termos':
        return <TermsOfUse onNavigate={onNavigate} />;
      case 'privacidade':
        return <PrivacyPolicy onNavigate={onNavigate} />;
      case 'cookies':
        return <CookiesPolicy onNavigate={onNavigate} />;
      default:
        return <Home onNavigate={onNavigate} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="min-h-screen bg-[#f6f3ee] flex flex-col">
        {/* HEADER — com menu mobile/tablet embutido */}
        <Header
          onLogout={onLogout}
          onBack={handleVoltarInicio}
          onNavigate={onNavigate}
        />

        {/* MENU DESKTOP (Mostrado apenas em telas 'lg' ou maiores) */}
        <div className="hidden lg:block"> {/* <-- LÓGICA ALTERADA */}
          {currentView &&
            !['termos', 'privacidade', 'cookies', 'suporte'].includes(currentView) && (
              <Menu activeView={currentView} onNavigate={onNavigate} />
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
