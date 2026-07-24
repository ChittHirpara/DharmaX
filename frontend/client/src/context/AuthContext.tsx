import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  updateUserBotName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('sattva_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem('sattva_token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('sattva_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sattva_token');
    setUser(null);
  };

  const registerUser = async (username: string, email: string, password: string) => {
    const data = await api.register(username, email, password);
    login(data.token, data.user);
  };

  const loginUser = async (email: string, password: string) => {
    const data = await api.login(email, password);
    login(data.token, data.user);
  };

  const updateUserBotName = async (name: string) => {
    if (!user) return;
    const res = await api.updateBotName(name);
    setUser({ ...user, bot_name: res.bot_name });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerUser, loginUser, updateUserBotName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
