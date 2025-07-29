import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_verified: boolean;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@TOT:user');
      const storedToken = await AsyncStorage.getItem('@TOT:token');

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Устанавливаем токен в API
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { access_token, user: userData } = response.data;

      // Сохраняем данные в AsyncStorage
      await AsyncStorage.setItem('@TOT:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@TOT:token', access_token);

      // Устанавливаем токен в API
      api.defaults.headers.Authorization = `Bearer ${access_token}`;

      setUser(userData);
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = 'Ошибка входа в систему';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Alert.alert('Ошибка', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      setIsLoading(true);
      
      const response = await api.post('/auth/register', {
        ...userData,
        role: userData.role || 'patient',
      });

      const { access_token, user: newUser } = response.data;

      // Сохраняем данные в AsyncStorage
      await AsyncStorage.setItem('@TOT:user', JSON.stringify(newUser));
      await AsyncStorage.setItem('@TOT:token', access_token);

      // Устанавливаем токен в API
      api.defaults.headers.Authorization = `Bearer ${access_token}`;

      setUser(newUser);
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = 'Ошибка регистрации';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Alert.alert('Ошибка', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Очищаем данные из AsyncStorage
      await AsyncStorage.removeItem('@TOT:user');
      await AsyncStorage.removeItem('@TOT:token');

      // Удаляем токен из API
      delete api.defaults.headers.Authorization;

      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Ошибка', 'Ошибка при выходе из системы');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      
      const response = await api.put('/auth/me', userData);
      const updatedUser = response.data;

      // Обновляем данные в AsyncStorage
      await AsyncStorage.setItem('@TOT:user', JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (error: any) {
      console.error('Update user error:', error);
      
      let errorMessage = 'Ошибка обновления профиля';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Alert.alert('Ошибка', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 