/**
 * @file: App.tsx
 * @description: Главный компонент админ-панели ТОТ с Material-UI
 * @dependencies: React, Login, Users, @mui/material, @mui/icons-material
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton
} from '@mui/material';
import {
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import Login from './Login';
import Users from './Users';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Clinics from './pages/Clinics';
import Appointments from './pages/Appointments';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  console.log('🎬 Новая админ-панель запущена (Material-UI версия с навигацией)');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Создаём тему для Material-UI
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

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
    console.log('✅ Успешный вход - переключаемся на Dashboard');
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    console.log('🚪 Выход - очищаем токен и возвращаемся к Login');
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    console.log('🔄 Переход к странице:', page);
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'doctors':
        return <Doctors />;
      case 'clinics':
        return <Clinics />;
      case 'appointments':
        return <Appointments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {!isLoggedIn ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={() => setSidebarOpen(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <AdminIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Админ-панель ТОТ
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  Выйти
                </Button>
              </Toolbar>
            </AppBar>
            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
              {renderCurrentPage()}
            </Container>
            
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onNavigate={handleNavigate}
              currentPage={currentPage}
            />
          </Box>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;