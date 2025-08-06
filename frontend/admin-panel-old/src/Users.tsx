/**
 * @file: Users.tsx
 * @description: Компонент списка пользователей с Material-UI
 * @dependencies: React, axios, @mui/material, @mui/icons-material
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

const Users: React.FC = () => {
  console.log('👥 Компонент Users загружен (Material-UI версия)');
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      console.log('🔍 Запрос списка пользователей...');
      
      const response = await axios.get('/admin/users?page=1&limit=10');
      
      console.log('✅ Получен ответ:', response.data);
      
      // Извлекаем пользователей из ответа
      const userData = response.data.data || response.data;
      const usersList = userData.users || userData;
      
      console.log('👥 Список пользователей:', usersList);
      
      if (Array.isArray(usersList)) {
        setUsers(usersList);
        console.log(`✅ Загружено ${usersList.length} пользователей`);
      } else {
        console.warn('⚠️ Неожиданный формат данных:', userData);
        setError('Неверный формат данных от сервера');
      }
      
    } catch (err: any) {
      console.error('❌ Ошибка загрузки пользователей:', err);
      setError(`Ошибка: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect: загружаем пользователей');
    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'doctor':
        return 'primary';
      case 'patient':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleEditUser = (user: User) => {
    console.log('✏️ Редактирование пользователя:', user);
    // TODO: Открыть модальное окно редактирования
  };

  const handleDeleteUser = (user: User) => {
    console.log('🗑️ Удаление пользователя:', user);
    // TODO: Показать диалог подтверждения
  };

  const handleViewUser = (user: User) => {
    console.log('👁️ Просмотр пользователя:', user);
    // TODO: Открыть модальное окно просмотра
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchUsers}
          startIcon={<RefreshIcon />}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Пользователи ({users.length})
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchUsers}
          startIcon={<RefreshIcon />}
        >
          Обновить
        </Button>
      </Box>
      
      {users.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Пользователи не найдены
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {user.id.substring(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.is_active ? 'Активен' : 'Неактивен'}
                      color={user.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Просмотр">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewUser(user)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditUser(user)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteUser(user)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Users;