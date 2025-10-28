import React, { useState } from 'react'; 
import { Button } from './ui/button';
import { Scale, Users, FileText, Calendar, FileSignature, LogOut, BarChart3, FileBarChart, Shield, Menu as MenuIcon, HomeIcon, Contact, LifeBuoy } from 'lucide-react';
import { ClientesView } from './ClientesView';
import { ProcessosView } from './ProcessosView';
import PrazosView from './PrazosView';
import { ContratosView } from './ContratosView';
import { DashboardView } from './DashboardView';
import { RelatoriosView } from './RelatoriosView';
import { UsuariosView } from './UsuariosView';
import { Home } from './Home';
import { Toaster } from './ui/sonner';
import { Footer } from './Footer';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useIsMobile } from '../use-mobile'; 
import { Separator } from './ui/separator';
import Menu from './Menu';
import { Sac } from './Sac';
import { TermosDeUso } from './Termos-de-uso';
import { PoliticaDePrivacidade } from './Politica-de-privacidade';
import { CookieConsentBanner } from './CookieConsentBanner';
import { PoliticaDeCookies } from './Politica-de-Cookies';

interface HeaderProps {
  userName: string;
  userTipo: string;
  onLogout: () => void;
}

export default function Header({ userName, userTipo, onLogout }: HeaderProps) {
  // ... (todos os seus 'useState' e funções 'handle...', 'CurrentView') ...
  const [activeView, setActiveView] = useState<
    'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' |
    'relatorios' | 'usuarios' | 'suporte' | 'termos' | 'privacidade' | 'cookies'
  >('home');
  const [clienteIdParaEditar, setClienteIdParaEditar] = useState<string | null>(null);
  const [processoIdParaEditar, setProcessoIdParaEditar] = useState<string | null>(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const isMobile = useIsMobile();

  const CurrentView = () => { /* ... seu switch case ... */
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
        return userTipo === 'administrador' ? <UsuariosView onVoltar={handleVoltarInicio} /> : null;
      case 'suporte':
        return <Sac />;
      case 'termos':
        return <TermosDeUso />;
      case 'privacidade':
        return <PoliticaDePrivacidade />;
      case 'cookies':
        // Certifique-se que o nome do componente aqui bate com a importação
        return <PoliticaDeCookies />; 
      default:
        return <Home userTipo={userTipo} onNavigate={handleNavigate} />;
    }
  };

   const handleEditarCliente = (clienteId: string) => {
    setClienteIdParaEditar(clienteId);
    setActiveView('clientes');
  };

  const handleEditarProcesso = (processoId: string) => {
    setProcessoIdParaEditar(processoId);
    setActiveView('processos');
  };

  const handleVoltarInicio = () => {
    setActiveView('home');
    setClienteIdParaEditar(null);
    setProcessoIdParaEditar(null);
  };

  const handleNavigate = (view:
    'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' |
    'relatorios' | 'usuarios' | 'suporte' | 'termos' | 'privacidade' | 'cookies'
  ) => {
    setActiveView(view);
    setMenuMobileAberto(false);
  };


  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-[#f6f3ee] flex flex-col">
        {/* Header (Top Bar) */}
        <header className="bg-white border-b-2 border-[#d4c4b0] shadow-md sticky top-0 z-20">
          {/* ... (conteúdo do <header>) ... */}
           <div className="w-full flex items-center justify-between px-4 py-4 md:px-6">
            {/* Logo */}
            <button
              onClick={handleVoltarInicio}
              className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200 group"
            >
              <div className="bg-gradient-to-br from-[#a16535] to-[#8b5329] p-1.5 md:p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <Scale className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl text-[#2d1f16]">
                  JURIS <span className="text-[#a16535]">FÁCIL</span>
                </h1>
                <p className="text-xs md:text-sm text-[#6b5544] hidden sm:block">Sistema de Gestão Jurídica</p>
              </div>
            </button>

            {/* Lado Direito do Header */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-[#6b5544]">Bem-vindo(a),</p>
                <p className="text-[#2d1f16] font-semibold">{userName}</p>
              </div>

              {/* Menu Mobile (Sheet) */}
              {isMobile && (
                <Sheet open={menuMobileAberto} onOpenChange={setMenuMobileAberto}>
                   {/* ... (SheetTrigger, SheetContent com todos os botões) ... */}
                   <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="md:hidden border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
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
                        className="w-full justify-start border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sair
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {/* Botão Sair - Desktop */}
              <Button
                variant="outline"
                onClick={onLogout}
                className="hidden md:flex border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* CONTAINER PRINCIPAL: Menu Lateral + Conteúdo */}
        <div className="flex flex-grow">
          {/* Menu Lateral Desktop (Sidebar) */}
          {activeView !== 'home' && !isMobile && !['termos', 'privacidade', 'cookies'].includes(activeView) && (
            <Menu
              activeView={activeView}
              userTipo={userTipo}
              onNavigate={handleNavigate}
            />
          )}

          {/* Área de Conteúdo Principal (View Switcher) */}
          <main className="flex-1 w-full p-4 md:p-8">
            <div className={!['termos', 'privacidade', 'cookies'].includes(activeView) ? 'max-w-7xl mx-auto' : ''}>
                 <CurrentView />
            </div>
          </main>
        </div>

        <Footer onNavigate={handleNavigate} />
        
        {/* NOVO: Renderizar o Banner de Consentimento aqui */}
        {/* Ele precisa da função onNavigate para o link da política */}
        <CookieConsentBanner onNavigate={handleNavigate} />
        
      </div>
    </>
  );
}