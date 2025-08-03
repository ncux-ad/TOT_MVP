/**
 * @file: Login.tsx
 * @description: Компонент входа в админ-панель
 * @dependencies: React, axios
 * @created: 2024-01-28
 */
import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>Вход в админ-панель</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: message.includes('Успешный') ? '#d4edda' : '#f8d7da',
          border: '1px solid ' + (message.includes('Успешный') ? '#c3e6cb' : '#f5c6cb'),
          borderRadius: '4px',
          color: message.includes('Успешный') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Демо-данные:</strong><br />
        Email: admin@tot.ru<br />
        Пароль: admin123
      </div>
    </div>
  );
};

export default Login;