/**
 * @file: Users.tsx
 * @description: Страница управления пользователями в админ-панели
 * @dependencies: React, @mui/material, @mui/icons-material, axios
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../utils/api';
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
  Visibility as ViewIcon,
  Add as AddIcon,
  Person as UserIcon
} from '@mui/icons-material';
import ConfirmDialog from '../components/ConfirmDialog';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'doctor' | 'patient';
  is_active: boolean;
  created_at: string;
}

const Users: React.FC = () => {
  console.log('👥 Компонент Users загружен');
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Диалог подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 useEffect: загружаем пользователей');
    
    // Проверяем токен перед загрузкой
    const token = localStorage.getItem('adminToken');
    console.log('🔑 Токен в localStorage:', token ? token.substring(0, 20) + '...' : 'НЕТ');
    
    if (!token) {
      console.log('⚠️ Токен не найден, перенаправляем на логин');
      window.location.href = '/login';
      return;
    }
    
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Запрос списка пользователей...');
      
      console.log('🔍 Вызываем usersAPI.getUsers...');
      const response = await usersAPI.getUsers({ page: 1, limit: 100 });
      console.log('📡 Получен ответ:', response);
      console.log('📊 response.data:', response.data);
      
      const responseData = response.data.data || response.data;
      console.log('📊 responseData:', responseData);
      
      const usersList = responseData.users || [];
      console.log('👥 usersList:', usersList);
      
      setUsers(usersList);
      console.log('👥 Список пользователей:', usersList);
      console.log(`✅ Загружено ${usersList.length} пользователей`);
      
    } catch (err: any) {
      console.error('❌ Ошибка загрузки пользователей:', err);
      setError(err.response?.data?.detail || 'Ошибка загрузки списка пользователей');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'doctor': return 'primary';
      case 'patient': return 'success';
      default: return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'doctor': return 'Врач';
      case 'patient': return 'Пациент';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активен' : 'Неактивен';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const handleRefresh = () => {
    console.log('🔄 Обновляем список пользователей');
    fetchUsers();
  };

  const handleAddUser = () => {
    console.log('➕ Добавление нового пользователя');
    // TODO: Реализовать модальное окно добавления
  };

  const handleEditUser = (user: User) => {
    console.log('✏️ Редактирование пользователя:', user.id);
    // TODO: Реализовать модальное окно редактирования
  };

  const handleDeleteUser = (user: User) => {
    console.log('🗑️ Открываем диалог удаления пользователя:', user.id);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setDeleteLoading(true);
    try {
      console.log('🗑️ Удаляем пользователя:', userToDelete.id);
      
      // TODO: Заменить на реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      console.log('✅ Пользователь успешно удален');
      
      // Обновляем список
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      
    } catch (err: any) {
      console.error('❌ Ошибка удаления пользователя:', err);
      setError('Ошибка удаления пользователя');
    } finally {
      setDeleteLoading(false);
      setUserToDelete(null);
    }
  };

  const handleViewUser = (user: User) => {
    console.log('👁️ Просмотр пользователя:', user.id);
    // TODO: Реализовать детальный просмотр
  };

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Управление пользователями
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{ mr: 1 }}
          >
            Добавить пользователя
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Обновить
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата регистрации</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Пользователи не найдены
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <UserIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {user.first_name} {user.last_name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleText(user.role)}
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(user.is_active)}
                      color={getStatusColor(user.is_active) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Просмотреть">
                      <IconButton onClick={() => handleViewUser(user)} size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => handleEditUser(user)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton 
                        onClick={() => handleDeleteUser(user)} 
                        size="small" 
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          Всего пользователей: {users.length}
        </Typography>
      </Box>

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Подтверждение удаления"
        message={`Вы действительно хотите удалить пользователя "${userToDelete?.first_name} ${userToDelete?.last_name}"?`}
        confirmText="Удалить пользователя"
        loading={deleteLoading}
        severity="error"
      />
    </Box>
  );
};

export default Users; 