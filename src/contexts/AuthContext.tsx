'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  username: string;
  displayName: string;
  isVerified: boolean;
  vip?: number;
  trust?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token is still valid
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Login failed';
      throw new Error(errorMessage || 'Login failed');
    }
  };

  const register = async (data: {
    username: string;
    password: string;
    displayName?: string;
  }) => {
    try {
      const response = await authAPI.register(data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Registration failed';
      throw new Error(errorMessage || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
