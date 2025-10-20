

import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import SignUpFlow from './components/SignUpFlow';
import MainAppShell from './components/layout/MainAppShell';
import { logger } from './utils/logger';
import { useAppStore } from './store';
import DevUserSwitcher from './components/DevUserSwitcher';

type AuthScreen = 'welcome' | 'signup';

const App: React.FC = () => {
  logger.log('Component:App', 'Component rendering or re-rendering.');
  
  const { view, setView } = useAppStore();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  
  useEffect(() => {
    logger.log('Component:App', 'Mounted.');
  }, []);

  useEffect(() => {
    logger.log('Component:App', 'State changed: view', { view });
  }, [view]);

  useEffect(() => {
    logger.log('Component:App', 'State changed: authScreen', { authScreen });
  }, [authScreen]);

  const handleStartSignUp = () => {
    logger.log('Component:App', 'Executing handleStartSignUp.');
    setAuthScreen('signup');
  };

  const handleSignUpComplete = () => {
    logger.log('Component:App', 'Executing handleSignUpComplete. Transitioning to Dev Switcher.');
    setView('dev-switcher');
  };
  
  const handleBackToWelcome = () => {
    logger.log('Component:App', 'Executing handleBackToWelcome.');
    setAuthScreen('welcome');
  };

  const handleLogout = () => {
    logger.log('Component:App', 'Executing handleLogout.');
    setAuthScreen('welcome');
    setView('auth');
  }

  const renderContent = () => {
    logger.log('Component:App', 'Executing renderContent.', { view, authScreen });
    if (view === 'app') {
      logger.log('Component:App', 'Rendering MainAppShell.');
      return <MainAppShell onLogout={handleLogout} />;
    }

    if (view === 'dev-switcher') {
        logger.log('Component:App', 'Rendering DevUserSwitcher.');
        return <DevUserSwitcher onUserSelected={() => setView('app')} />;
    }

    if (authScreen === 'welcome') {
      logger.log('Component:App', 'Rendering WelcomeScreen.');
      return <WelcomeScreen onStartSignUp={handleStartSignUp} />;
    }

    logger.log('Component:App', 'Rendering SignUpFlow.');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="h-screen w-full max-w-md md:h-auto md:max-h-[750px] bg-white md:rounded-2xl md:shadow-lg">
          <SignUpFlow onComplete={handleSignUpComplete} onBack={handleBackToWelcome}/>
        </div>
      </div>
    );
  }
  
  logger.log('Component:App', 'Preparing to return rendered content.');
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {renderContent()}
    </div>
  );
};

export default App;