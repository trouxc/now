
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PREDEFINED_USERS = [
  { username: 'troy', password: '20' },
  { username: 'manar', password: '28' },
  { username: 'crryhot', password: '239' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 700));

    const foundUser = PREDEFINED_USERS.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser({ username: foundUser.username });
      setLoading(false);
      return true;
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = { user, login, logout, error, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
