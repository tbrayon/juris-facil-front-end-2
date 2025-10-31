import React, { useState } from 'react';
import {
  Scale, FileText, Calendar, FileSignature, LogOut, BarChart3,
  FileBarChart, Shield, Menu as MenuIcon, HomeIcon, Contact, LifeBuoy
} from 'lucide-react';

import { Button } from './ui/button';
import { Toaster } from './ui/sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';
import { useIsMobile } from '../use-mobile';

// === IMPORTS COM NOMES EXATOS DOS ARQUIVOS ===
import { ClientesView } from './ClientesView';
import { ProcessosView } from './ProcessosView';
import PrazosView from './PrazosView';
import { ContratosView } from './ContratosView';
import { DashboardView } from './DashboardView';
import { RelatoriosView } from './RelatoriosView';
import { UsuariosView } from './UsuariosView';
import { Home } from './Home';
import Menu from './Menu';
import { CookieConsentBanner } from './CookieConsentBanner';

// === COMPONENTES LEGAIS (com export nomeado) ===
import { Footer } from './Footer';                    // Footer.tsx
import { Sac } from './Sac';                          // Sac.tsx
import { TermosDeUso } from './Termos-de-uso';        // Termos-de-uso.tsx
import { PoliticaDePrivacidade }  from './Politica-de-privacidade'; // Politica-de-privacidade.tsx
import { PoliticaDeCookies } from './Politica-de-cookies';         // Politica-de-cookies.tsx

// === TIPOS ===
export type AppView =
  | 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos'
  | 'relatorios' | 'usuarios' | 'suporte' | 'termos' | 'privacidade' | 'cookies';

export type NavigateFunc = (view: AppView) => void;

// === PROPS DO HEADER ===
interface HeaderProps {
  userName: string;
  userTipo: string;
  onLogout: () => void;
}

// === COMPONENTE HEADER ===
export default function Header({ userName, userTipo, onLogout }: HeaderProps) {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [clienteIdParaEditar, setClienteIdParaEditar] = useState<string | null>(null);
  const [processoIdParaEditar, setProcessoIdParaEditar] = useState<string | null>(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const isMobile = useIsMobile();

  const handleNavigate: NavigateFunc = (view) => {
    setActiveView(view);
    setMenuMobileAberto(false);
  };

  const handleVoltarInicio = () => {
    setActiveView('home');
    setClienteIdParaEditar(null);
    setProcessoIdParaEditar(null);
  };

  const handleEditarCliente = (clienteId: string) => {
    setClienteIdParaEditar(clienteId);
    setActiveView('clientes');
  };

  const handleEditarProcesso = (processoId: string) => {
    setProcessoIdParaEditar(processoId);
    setActiveView('processos');
  };

  const CurrentView = () => {
    switch (activeView) {
      case 'home':
        return <Home userTipo={userTipo} onNavigate={handleNavigate} />;
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

      // === PÁGINAS LEGAIS ===
      case 'suporte':
        return <Sac onNavigate={handleNavigate} />;
      case 'termos':
        return <TermosDeUso onNavigate={handleNavigate} />;
      case 'privacidade':
        return <PoliticaDePrivacidade onNavigate={handleNavigate} />;
      case 'cookies':
        return <PoliticaDeCookies onNavigate={handleNavigate} />;

      default:
        return <Home userTipo={userTipo} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-[#f6f3ee] flex flex-col">
        {/* Header Principal */}
        <header className="bg-white border-b-2 border-[#d4c4b0] shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <button
              onClick={handleVoltarInicio}
              className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <div className="bg-gradient-to-br from-[#a16535] to-[#8b5329] p-2.5 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl text-[#2d1f16] font-semibold">
                  JURIS <span className="text-[#a16535] font-normal">FÁCIL</span>
                </h1>
                <p className="text-xs text-[#6b5544] hidden sm:block">Sistema de Gestão Jurídica</p>
              </div>
            </button>

            {/* Usuário + Menu Mobile + Sair */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-[#6b5544]">Bem-vindo(a),</p>
                <p className="text-[#2d1f16] font-semibold">{userName}</p>
              </div>

              {/* Menu Mobile */}
              {isMobile && (
                <Sheet open={menuMobileAberto} onOpenChange={setMenuMobileAberto}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="md:hidden border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
                    >
                      <MenuIcon className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] bg-white border-l-2 border-[#d4c4b0]">
                    <SheetHeader>
                      <SheetTitle className="text-[#2d1f16]">Menu Juris Fácil</SheetTitle>
                      <SheetDescription className="text-[#6b5544]">
                        Navegue pelas opções do sistema.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 flex flex-col space-y-2">
                      <Button
                        variant={activeView === 'home' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('home')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <HomeIcon className="w-4 h-4 mr-2" /> Página Inicial
                      </Button>
                      <Separator />
                      <Button
                        variant={activeView === 'clientes' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('clientes')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <Contact className="w-4 h-4 mr-2" /> Clientes
                      </Button>
                      <Button
                        variant={activeView === 'processos' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('processos')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <FileText className="w-4 h-4 mr-2" /> Processos
                      </Button>
                      <Button
                        variant={activeView === 'prazos' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('prazos')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <Calendar className="w-4 h-4 mr-2" /> Prazos e Audiências
                      </Button>
                      <Button
                        variant={activeView === 'contratos' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('contratos')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <FileSignature className="w-4 h-4 mr-2" /> Contratos
                      </Button>
                      <Button
                        variant={activeView === 'relatorios' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('relatorios')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <FileBarChart className="w-4 h-4 mr-2" /> Relatórios
                      </Button>
                      {userTipo === 'administrador' && (
                        <Button
                          variant={activeView === 'usuarios' ? 'default' : 'ghost'}
                          onClick={() => handleNavigate('usuarios')}
                          className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                        >
                          <Shield className="w-4 h-4 mr-2" /> Usuários
                        </Button>
                      )}
                      <Button
                        variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('dashboard')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" /> Dashboard
                      </Button>
                      <Separator className="my-2" />
                      <Button
                        variant={activeView === 'suporte' ? 'default' : 'ghost'}
                        onClick={() => handleNavigate('suporte')}
                        className="w-full justify-start text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]"
                      >
                        <LifeBuoy className="w-4 h-4 mr-2" /> Suporte
                      </Button>
                      <Separator className="my-2" />
                      <Button
                        variant="outline"
                        onClick={onLogout}
                        className="w-full justify-start border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sair
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {/* Botão Sair (Desktop) */}
              <Button
                variant="outline"
                onClick={onLogout}
                className="hidden md:flex border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white shadow-sm hover:shadow-md h-10 px-4"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Menu Desktop */}
        {!isMobile && !['termos', 'privacidade', 'cookies', 'suporte'].includes(activeView) && (
          <div className="bg-white border-b-2 border-[#d4c4b0] shadow-sm sticky top-[72px] md:top-[76px] z-10">
            <Menu activeView={activeView} userTipo={userTipo} onNavigate={handleNavigate} />
          </div>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 w-full p-4 md:p-8">
          <div className={!['termos', 'privacidade', 'cookies', 'suporte'].includes(activeView) ? 'max-w-7xl mx-auto' : ''}>
            <CurrentView />
          </div>
        </main>

        {/* Footer e Banner */}
        <Footer onNavigate={handleNavigate} />
        <CookieConsentBanner onNavigate={handleNavigate} />
      </div>
    </>
  );
}