import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Простые компоненты страниц
const LoginPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Вход в систему</h2>
    <p>Страница входа в разработке</p>
  </div>
);

const RegisterPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Регистрация</h2>
    <p>Страница регистрации в разработке</p>
  </div>
);

const HomePage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Главная страница</h2>
    <p>Добро пожаловать в ТОТ - Твоя Точка Опоры!</p>
    <p>Время: {new Date().toLocaleString('ru-RU')}</p>
  </div>
);

const ProfilePage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Профиль</h2>
    <p>Страница профиля в разработке</p>
  </div>
);

const DoctorsPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Врачи</h2>
    <p>Список врачей в разработке</p>
  </div>
);

const BookingsPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Записи</h2>
    <p>История записей в разработке</p>
  </div>
);

const PaymentsPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Платежи</h2>
    <p>Система платежей в разработке</p>
  </div>
);

const ChatPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Чат</h2>
    <p>Чат с врачами в разработке</p>
  </div>
);

const EmergencyPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Экстренные вызовы</h2>
    <p>Система экстренных вызовов в разработке</p>
  </div>
);

// Простой Layout компонент
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
    <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem' }}>
      <h1 style={{ margin: 0 }}>ТОТ - Твоя Точка Опоры</h1>
    </nav>
    <main>{children}</main>
  </div>
);

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