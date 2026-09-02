import { useState } from 'react';
import { ConfigProvider } from 'antd';
import { Login, type UserSession } from './components/Login';
import { Dashboard } from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0d9488',
          colorLink: '#0d9488',
          borderRadius: 8,
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
        },
      }}
    >
      {currentUser ? (
        <Dashboard
          user={currentUser}
          onLogout={() => setCurrentUser(null)}
        />
      ) : (
        <Login onLoginSuccess={(user) => setCurrentUser(user)} />
      )}
    </ConfigProvider>
  );
}

export default App;
