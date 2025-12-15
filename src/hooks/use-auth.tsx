'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginCredentials, RegisterData, AuthContextType } from '@/types/auth';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/lib/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        username: credentials.email.split('@')[0],
        fullName: 'John Doe',
        role: 'student',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in localStorage
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

      setUser(mockUser);

      // Redirect to dashboard
      router.push('/home');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: '1',
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        role: 'student',
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in localStorage
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

      setUser(mockUser);

      // Redirect to onboarding
      router.push('/onboarding');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);

    setUser(null);

    // Redirect to login
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

