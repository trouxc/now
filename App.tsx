
import React from 'react';
import { useAuth, AuthProvider } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return user ? <Dashboard /> : <Login />;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
