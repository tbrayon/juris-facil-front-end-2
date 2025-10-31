// src/App.tsx
import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import Header from './components/Header'; // Importando o Header (o layout principal)
import { WelcomePage } from './components/Welcome-page';
import { ClientesProvider } from './contexts/ClientesContext';
import { ProcessosProvider } from './contexts/ProcessosContext';
import { ContratosProvider } from './contexts/ContratosContext';
import { Sac} from './components/Sac'
import { UsuariosProvider } from './contexts/UsuariosContext';
import { Toaster } from './components/ui/sonner';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [userTipo, setUserTipo] = useState('');

  const handleLoginSuccess = (name: string, tipo: string) => {
    setUserName(name);
    setUserTipo(tipo);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserTipo('');
    setShowLogin(false);
  };

  const handleBackToWelcome = () => {
    setShowLogin(false);
  };

  const renderContent = () => {
    if (isLoggedIn) {
      // Se estiver logado, renderiza o layout principal (Header)
      return (
        <Header
          userName={userName}
          userTipo={userTipo}
          onLogout={handleLogout}
        />
      );
    }

    if (showLogin) {
      // Se estiver na tela de login, mostra o formulário
      return <LoginForm onLoginSuccess={handleLoginSuccess} onBack={handleBackToWelcome} />;
    }

    // Por padrão, mostra a página inicial de boas-vindas
    return <WelcomePage onAcessarSistema={() => setShowLogin(true)} />;
  };

  return (
    <UsuariosProvider>
      <ClientesProvider>
        <ProcessosProvider>
          <ContratosProvider>
            <Toaster position="top-right" richColors />
            {renderContent()}
          </ContratosProvider>
        </ProcessosProvider>
      </ClientesProvider>
    </UsuariosProvider>
  );
}

export default App;