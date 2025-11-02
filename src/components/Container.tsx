import { useState } from 'react';
import { Login } from './Login';

import Layout from './Layout';
import { WelcomePage } from './Welcome';
import { Sac } from './Sac';
import { PoliticaDeCookies } from './Politica-de-cookies';
import { PoliticaDePrivacidade } from './Politica-de-privacidade';
import { TermosDeUso } from './Termos-de-uso';

import { AppView } from '../types/navigation';
import { useUsers } from '../contexts/UsersContext';

function Container() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const { currentUser, logoutMutation } = useUsers();
  const handleLogout = () => {
    logoutMutation.mutate();
    setCurrentView("welcome");
  };

  console.log(currentUser);

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      {currentUser ? (
        <Layout
          onLogout={handleLogout}
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      ) : (
        <>
          {currentView === 'welcome' && (
            <WelcomePage
              onSystemAccess={() => setCurrentView('login')}
              onNavigate={handleNavigate}
            />
          )}
          {currentView === 'login' && (
            <Login onNavigate={handleNavigate} />
          )}
          {currentView === 'suporte' && <Sac onNavigate={handleNavigate} />}
          {currentView === 'termos' && <TermosDeUso onNavigate={handleNavigate} />}
          {currentView === 'privacidade' && <PoliticaDePrivacidade onNavigate={handleNavigate} />}
          {currentView === 'cookies' && <PoliticaDeCookies onNavigate={handleNavigate} />}
        </>
      )}
    </div>
  );
}

export default Container;
