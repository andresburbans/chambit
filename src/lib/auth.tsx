"use client"
import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock user data
const mockClient: User = {
  id: 'client123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
  role: 'client',
};

const mockExpert: User = {
  id: 'expert456',
  name: 'Jordan Smith',
  email: 'jordan.smith@example.com',
  avatarUrl: 'https://picsum.photos/seed/avatar2/200/200',
  role: 'expert',
};

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => void;
  logout: () => void;
  register: (name: string, email: string, pass: string, role: 'client' | 'expert') => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulate login
  const login = (email: string) => {
    setLoading(true);
    setTimeout(() => {
      // Simple logic to switch between roles for demo purposes
      if (email.includes('expert')) {
        setUser(mockExpert);
      } else {
        setUser(mockClient);
      }
      setLoading(false);
    }, 1000);
  };

  // Simulate logout
  const logout = () => {
    setUser(null);
  };

  // Simulate register
  const register = (name: string, email: string, pass: string, role: 'client' | 'expert') => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: `new-${Math.random()}`,
        name,
        email,
        role,
        avatarUrl: 'https://picsum.photos/seed/newuser/200/200'
      });
      setLoading(false);
    }, 1000);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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
