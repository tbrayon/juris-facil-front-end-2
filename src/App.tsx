// src/App.tsx
import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import  Layout  from './components/layout'; // ← CORRETO: Layout com L maiúsculo
import { WelcomePage } from './components/Welcome-page';
import { Sac } from './components/Sac';
import { PoliticaDeCookies } from './components/Politica-de-cookies';
import { PoliticaDePrivacidade } from './components/Politica-de-privacidade';
import { TermosDeUso } from './components/Termos-de-uso';

import { UsuariosProvider } from './contexts/UsuariosContext';
import { ClientesProvider } from './contexts/ClientesContext';
import { ProcessosProvider } from './contexts/ProcessosContext';
import { ContratosProvider } from './contexts/ContratosContext';
import { Toaster } from './components/ui/sonner';

import { AppView } from './others/navigation';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userTipo, setUserTipo] = useState('');
  const [currentView, setCurrentView] = useState<AppView>('welcome');

  const handleLoginSuccess = (name: string, tipo: string) => {
    setUserName(name);
    setUserTipo(tipo);
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserTipo('');
    setCurrentView('welcome');
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  return (
    <UsuariosProvider>
      <ClientesProvider>
        <ProcessosProvider>
          <ContratosProvider>
            <Toaster position="top-right" richColors />
            <div className="min-h-screen bg-[#f6f3ee]">
              {isLoggedIn ? (
                <Layout
                  userName={userName}
                  userTipo={userTipo}
                  onLogout={handleLogout}
                  currentView={currentView}
                  onNavigate={handleNavigate}
                />
              ) : (
                <>
                  {currentView === 'welcome' && (
                    <WelcomePage
                      onAcessarSistema={() => setCurrentView('login')}
                      onNavigate={handleNavigate}
                    />
                  )}
                  {currentView === 'login' && (
                    <LoginForm onLoginSuccess={handleLoginSuccess} onBack={() => setCurrentView('welcome')} />
                  )}
                  {currentView === 'suporte' && <Sac onNavigate={handleNavigate} />}
                  {currentView === 'termos' && <TermosDeUso onNavigate={handleNavigate} />}
                  {currentView === 'privacidade' && <PoliticaDePrivacidade onNavigate={handleNavigate} />}
                  {currentView === 'cookies' && <PoliticaDeCookies onNavigate={handleNavigate} />}
                </>
              )}
            </div>
          </ContratosProvider>
        </ProcessosProvider>
      </ClientesProvider>
    </UsuariosProvider>
  );
}

export default App;