import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Простые компоненты страниц
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Простая аутентификация для демо
    if (email && password) {
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ email, name: 'Демо пользователь' }));
      window.location.href = '/';
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      maxWidth: '400px',
      margin: '50px auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2>Вход в систему</h2>
      <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="patient@example.com"
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="password123"
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Войти
        </button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        Демо данные: patient@example.com / password123
      </p>
    </div>
  );
};

const RegisterPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Регистрация</h2>
    <p>Страница регистрации в разработке</p>
  </div>
);

const HomePage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Главная страница</h2>
      <p>Добро пожаловать в ТОТ - Твоя Точка Опоры!</p>
      <p>Пользователь: {user.name || 'Гость'}</p>
      <p>Время: {new Date().toLocaleString('ru-RU')}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Быстрые действия:</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/doctors" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Найти врача
          </a>
          <a href="/bookings" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Мои записи
          </a>
          <a href="/payments" style={{ padding: '10px 20px', backgroundColor: '#f59e0b', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Платежи
          </a>
          <a href="/emergency" style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Экстренный вызов
          </a>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Профиль</h2>
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        <p><strong>Имя:</strong> {user.name || 'Не указано'}</p>
        <p><strong>Email:</strong> {user.email || 'Не указано'}</p>
        <p><strong>Дата регистрации:</strong> {new Date().toLocaleDateString('ru-RU')}</p>
      </div>
    </div>
  );
};

const DoctorsPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Врачи</h2>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h3>Доктор Иванов И.П.</h3>
        <p><strong>Специализация:</strong> Кардиолог</p>
        <p><strong>Рейтинг:</strong> ⭐⭐⭐⭐⭐ (4.8)</p>
        <p><strong>Опыт:</strong> 15 лет</p>
        <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Записаться
        </button>
      </div>
      
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h3>Доктор Петрова А.С.</h3>
        <p><strong>Специализация:</strong> Терапевт</p>
        <p><strong>Рейтинг:</strong> ⭐⭐⭐⭐ (4.5)</p>
        <p><strong>Опыт:</strong> 12 лет</p>
        <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Записаться
        </button>
      </div>
    </div>
  </div>
);

const BookingsPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Записи</h2>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h3>Консультация кардиолога</h3>
        <p><strong>Врач:</strong> Доктор Иванов И.П.</p>
        <p><strong>Дата:</strong> 15 января 2024, 14:00</p>
        <p><strong>Статус:</strong> <span style={{ color: '#10b981' }}>Подтверждено</span></p>
      </div>
      
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h3>Общий осмотр</h3>
        <p><strong>Врач:</strong> Доктор Петрова А.С.</p>
        <p><strong>Дата:</strong> 20 января 2024, 10:30</p>
        <p><strong>Статус:</strong> <span style={{ color: '#f59e0b' }}>Ожидает подтверждения</span></p>
      </div>
    </div>
  </div>
);

const PaymentsPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Платежи</h2>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Баланс кошелька</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>2,500 ₽</p>
      </div>
      
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h3>Последние транзакции</h3>
        <div style={{ textAlign: 'left' }}>
          <p><strong>Консультация кардиолога</strong> - <span style={{ color: '#ef4444' }}>-1,500 ₽</span></p>
          <p><strong>Пополнение кошелька</strong> - <span style={{ color: '#10b981' }}>+3,000 ₽</span></p>
          <p><strong>Экстренный вызов</strong> - <span style={{ color: '#ef4444' }}>-800 ₽</span></p>
        </div>
      </div>
    </div>
  </div>
);

const ChatPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Чат</h2>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h3>Доктор Иванов И.П.</h3>
        <p><strong>Последнее сообщение:</strong> Здравствуйте! Как ваше самочувствие?</p>
        <p><strong>Время:</strong> 14:30</p>
        <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Открыть чат
        </button>
      </div>
    </div>
  </div>
);

const EmergencyPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Экстренные вызовы</h2>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#fef2f2', border: '2px solid #ef4444', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#ef4444' }}>🚨 Экстренный вызов</h3>
        <p>Используйте эту функцию только в случае реальной экстренной ситуации</p>
        <button style={{ 
          padding: '15px 30px', 
          backgroundColor: '#ef4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          ЭКСТРЕННЫЙ ВЫЗОВ
        </button>
      </div>
      
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h3>Экстренные контакты</h3>
        <p><strong>Скорая помощь:</strong> 103</p>
        <p><strong>Ваш врач:</strong> Доктор Иванов И.П.</p>
      </div>
    </div>
  </div>
);

// Простой Layout компонент
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>ТОТ - Твоя Точка Опоры</h1>
        <div>
          <a href="/" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Главная</a>
          <a href="/doctors" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Врачи</a>
          <a href="/bookings" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Записи</a>
          <a href="/payments" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Платежи</a>
          <a href="/chat" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Чат</a>
          <a href="/emergency" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Экстренно</a>
          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: 'transparent', 
              color: 'white', 
              border: '1px solid white', 
              padding: '5px 10px', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Выйти
          </button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <DoctorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <EmergencyPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 