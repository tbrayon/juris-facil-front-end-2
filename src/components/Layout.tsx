import { useState } from 'react';

import { Toaster } from './ui/sonner';

import { ClientsView } from './ClientsView';
import PrazosView from './Prazos';
import { DashboardView } from './DashboardView';
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
import { ReportsView } from './ReportsView';

interface LayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

export default function Layout({
  onLogout,
}: LayoutProps) {
  const { currentUser } = useUsers();
  const {
    currentView,
    setView,
  } = useAppStore();

  const onNavigate = setView;

  const CurrentView = () => {
    switch (currentView) {
      case 'clientes':
        return <ClientsView onNavigate={onNavigate} />;
      case 'processos':
        return <ProcessesView onNavigate={onNavigate} />;
      // case 'prazos':
      //   return <PrazosView onVoltar={handleVoltarInicio} />;
      case 'contratos':
        return <ContractsView onNavigate={onNavigate} />;
      case 'relatorios':
        return <ReportsView onNavigate={onNavigate} />;
      case 'dashboard':
        return <DashboardView onNavigate={onNavigate} />;
      case 'usuarios':
      // return currentUser?.role === 'admin' ? (
      //   <UsuariosView onVoltar={handleVoltarInicio} />
      // ) : null;
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
