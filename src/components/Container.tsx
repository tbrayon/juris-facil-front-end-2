import { useState } from 'react';
import { Login } from './Login';

import Layout from './Layout';
import { WelcomePage } from './Welcome';
import { CustomerService } from './CustomerService';
import { CookiesPolicy } from './CookiesPolicy';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfUse } from './TermsOfUse';

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
          {currentView === 'suporte' && <CustomerService onNavigate={handleNavigate} />}
          {currentView === 'termos' && <TermsOfUse onNavigate={handleNavigate} />}
          {currentView === 'privacidade' && <PrivacyPolicy onNavigate={handleNavigate} />}
          {currentView === 'cookies' && <CookiesPolicy onNavigate={handleNavigate} />}
        </>
      )}
    </div>
  );
}

export default Container;
