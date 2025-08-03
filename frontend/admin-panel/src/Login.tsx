/**
 * @file: Login.tsx
 * @description: Компонент входа в админ-панель с Material-UI
 * @dependencies: React, axios, @mui/material, @mui/icons-material
 * @created: 2024-01-28
 */
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  console.log('🔐 Компонент Login загружен');
  
  const [email, setEmail] = useState('admin@tot.ru');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🚀 Попытка входа:', { email });
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      
      console.log('✅ Успешный вход:', response.data);
      
      // Извлекаем токен из ответа
      const responseData = response.data.data || response.data;
      const token = responseData.access_token;
      
      if (token) {
        console.log('🔑 Сохраняем токен:', token.substring(0, 20) + '...');
        localStorage.setItem('adminToken', token);
        
        // Настраиваем axios для автоматической отправки токена
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setMessage('Успешный вход! Переходим к списку пользователей...');
        
        // Переходим к главной странице через 1 секунду
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        console.error('❌ Токен не найден в ответе:', responseData);
        setMessage('Ошибка: токен не получен от сервера');
      }
      
    } catch (error: any) {
      console.error('❌ Ошибка входа:', error);
      setMessage(`Ошибка: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: 400
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Админ-панель ТОТ
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Вход в систему управления
            </Typography>
          </Box>
          
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          
          {message && (
            <Alert 
              severity={message.includes('Успешный') ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {message}
            </Alert>
          )}
          
          <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Демо-данные:</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: admin@tot.ru
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Пароль: admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;