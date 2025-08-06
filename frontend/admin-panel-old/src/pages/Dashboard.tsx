/**
 * @file: Dashboard.tsx
 * @description: Главная страница админ-панели с обзором статистики
 * @dependencies: React, @mui/material, @mui/icons-material, axios
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert
} from '@mui/material';

import {
  People as PeopleIcon,
  LocalHospital as DoctorsIcon,
  Business as ClinicsIcon,
  Event as AppointmentsIcon
} from '@mui/icons-material';

interface DashboardStats {
  users: number;
  doctors: number;
  clinics: number;
  appointments: number;
}

const Dashboard: React.FC = () => {
  console.log('📊 Компонент Dashboard загружен');
  
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    doctors: 0,
    clinics: 0,
    appointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      console.log('📊 Загружаем статистику дашборда...');
      
      // Загружаем пользователей для подсчёта статистики
      const usersResponse = await axios.get('/admin/users?page=1&limit=100');
      const usersData = usersResponse.data.data || usersResponse.data;
      const users = usersData.users || [];
      
      // Подсчитываем статистику по ролям
      const statsData = {
        users: users.length,
        doctors: users.filter((user: any) => user.role === 'doctor').length,
        clinics: 2, // Пока используем моковые данные
        appointments: 3 // Пока используем моковые данные
      };
      
      console.log('📊 Статистика загружена:', statsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки статистики:', err);
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { 
      title: 'Пользователи', 
      value: stats.users.toString(), 
      icon: PeopleIcon, 
      color: 'primary.main',
      description: 'Всего зарегистрированных'
    },
    { 
      title: 'Врачи', 
      value: stats.doctors.toString(), 
      icon: DoctorsIcon, 
      color: 'success.main',
      description: 'Активных врачей'
    },
    { 
      title: 'Клиники', 
      value: stats.clinics.toString(), 
      icon: ClinicsIcon, 
      color: 'warning.main',
      description: 'Зарегистрированных клиник'
    },
    { 
      title: 'Записи', 
      value: stats.appointments.toString(), 
      icon: AppointmentsIcon, 
      color: 'info.main',
      description: 'Записей на приём'
    }
  ];

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель управления
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Добро пожаловать в админ-панель ТОТ. Здесь вы можете управлять пользователями, врачами, клиниками и записями.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;
          
          return (
            <Card key={stat.title} elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      backgroundColor: stat.color,
                      color: 'white',
                      mr: 2
                    }}
                  >
                    <IconComponent />
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mt: 3 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Быстрые действия
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Просмотр списка пользователей
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Управление врачами и клиниками
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Просмотр отчётов и статистики
          </Typography>
        </Paper>
        
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Системная информация
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Версия: 2.0
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Статус: Активна
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Последнее обновление: Сегодня
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 