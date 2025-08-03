/**
 * @file: App.tsx
 * @description: Главный компонент админ-панели ТОТ
 * @dependencies: React, Login, Users
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Users from './Users';
import './App.css';

function App() {
  console.log('🎬 Новая админ-панель запущена');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      console.log('🔑 Найден сохранённый токен, настраиваем axios');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    } else {
      console.log('❌ Сохранённый токен не найден');
    }
  }, []);

  const handleLoginSuccess = () => {
    console.log('✅ Успешный вход - переключаемся на Users');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('🚪 Выход - очищаем токен и возвращаемся к Login');
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <div style={{ 
            padding: '10px 20px', 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1>Админ-панель ТОТ</h1>
            <button onClick={handleLogout} style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Выйти
            </button>
          </div>
          <Users />
        </div>
      )}
    </div>
  );
}

export default App;