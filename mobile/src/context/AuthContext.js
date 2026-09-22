import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@auth_token');
      const storedUser = await AsyncStorage.getItem('@auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to load auth state', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      await AsyncStorage.setItem('@auth_token', userToken);
      await AsyncStorage.setItem('@auth_user', JSON.stringify(userData));
    }
    return response;
  };

  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    if (response.success) {
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      await AsyncStorage.setItem('@auth_token', userToken);
      await AsyncStorage.setItem('@auth_user', JSON.stringify(userData));
    }
    return response;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
