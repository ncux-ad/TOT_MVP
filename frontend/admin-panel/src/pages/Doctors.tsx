/**
 * @file: Doctors.tsx
 * @description: Страница управления врачами в админ-панели
 * @dependencies: React, @mui/material, @mui/icons-material, axios
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
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import Modal from '../components/Modal';
import DoctorForm from '../components/DoctorForm';
import ConfirmDialog from '../components/ConfirmDialog';

interface Doctor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const Doctors: React.FC = () => {
  console.log('👨‍⚕️ Компонент Doctors загружен');
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Модальные окна
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Диалог подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);


  useEffect(() => {
    console.log('🔄 useEffect: загружаем врачей');
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Запрос списка врачей...');
      const response = await axios.get('/admin/users?page=1&limit=100');
      const responseData = response.data.data || response.data;
      
      if (responseData && Array.isArray(responseData.users)) {
        // Фильтруем только врачей
        const doctorsList = responseData.users.filter((user: any) => user.role === 'doctor');
        setDoctors(doctorsList);
        console.log('👨‍⚕️ Список врачей:', doctorsList);
        console.log(`✅ Загружено ${doctorsList.length} врачей`);
      } else {
        setError('Неверный формат данных от сервера');
      }
    } catch (err: any) {
      console.error('❌ Ошибка загрузки врачей:', err);
      setError(err.response?.data?.detail || 'Ошибка загрузки списка врачей');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активен' : 'Неактивен';
  };

  const handleRefresh = () => {
    console.log('🔄 Обновляем список врачей');
    fetchDoctors();
  };

  const handleAddDoctor = () => {
    console.log('➕ Открываем модальное окно добавления врача');
    setAddModalOpen(true);
    setFormError(null);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    console.log('✏️ Открываем модальное окно редактирования врача:', doctor.id);
    setSelectedDoctor(doctor);
    setEditModalOpen(true);
    setFormError(null);
  };

  const handleSubmitDoctor = async (formData: any) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      console.log('💾 Сохраняем данные врача:', formData);
      
      // TODO: Заменить на реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      console.log('✅ Врач успешно сохранен');
      
      // Закрываем модальное окно и обновляем список
      setAddModalOpen(false);
      setEditModalOpen(false);
      setSelectedDoctor(null);
      fetchDoctors(); // Обновляем список
      
    } catch (err: any) {
      console.error('❌ Ошибка сохранения врача:', err);
      setFormError('Ошибка сохранения данных врача');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log('📝 Данные формы:', data);
    handleSubmitDoctor(data);
  };

  const handleCloseModal = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setSelectedDoctor(null);
    setFormError(null);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    console.log('🗑️ Открываем диалог удаления врача:', doctor.id);
    setDoctorToDelete(doctor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    
    setDeleteLoading(true);
    try {
      console.log('🗑️ Удаляем врача:', doctorToDelete.id);
      
      // TODO: Заменить на реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      console.log('✅ Врач успешно удален');
      
      // Обновляем список
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorToDelete.id));
      
    } catch (err: any) {
      console.error('❌ Ошибка удаления врача:', err);
      setError('Ошибка удаления врача');
    } finally {
      setDeleteLoading(false);
      setDoctorToDelete(null);
    }
  };

  const handleViewDoctor = (doctor: Doctor) => {
    console.log('👁️ Просмотр врача:', doctor.id);
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
          Управление врачами
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDoctor}
            sx={{ mr: 1 }}
          >
            Добавить врача
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
              <TableCell>Email</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Врачи не найдены
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id} hover>
                  <TableCell>{doctor.id.substring(0, 8)}...</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.first_name}</TableCell>
                  <TableCell>{doctor.last_name}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(doctor.is_active)}
                      color={getStatusColor(doctor.is_active) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Просмотреть">
                      <IconButton onClick={() => handleViewDoctor(doctor)} size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => handleEditDoctor(doctor)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton onClick={() => handleDeleteDoctor(doctor)} size="small" color="error">
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
          Всего врачей: {doctors.length}
        </Typography>
      </Box>

      {/* Модальное окно добавления врача */}
      <Modal
        open={addModalOpen}
        onClose={handleCloseModal}
        title="Добавить врача"
        actions={
          <>
            <Button onClick={handleCloseModal} disabled={formLoading}>
              Отмена
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleFormSubmit({})}
              disabled={formLoading}
            >
              {formLoading ? 'Сохранение...' : 'Добавить'}
            </Button>
          </>
        }
      >
        <DoctorForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
          error={formError}
        />
      </Modal>

      {/* Модальное окно редактирования врача */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseModal}
        title="Редактировать врача"
        actions={
          <>
            <Button onClick={handleCloseModal} disabled={formLoading}>
              Отмена
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleFormSubmit(selectedDoctor)}
              disabled={formLoading}
            >
              {formLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        }
      >
        <DoctorForm
          doctor={selectedDoctor || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
          error={formError}
                 />
       </Modal>

       {/* Диалог подтверждения удаления */}
       <ConfirmDialog
         open={deleteDialogOpen}
         onClose={() => {
           setDeleteDialogOpen(false);
           setDoctorToDelete(null);
         }}
         onConfirm={handleConfirmDelete}
         title="Подтверждение удаления"
         message={`Вы действительно хотите удалить врача "${doctorToDelete?.first_name} ${doctorToDelete?.last_name}"?`}
         confirmText="Удалить врача"
         loading={deleteLoading}
         severity="error"
       />
     </Box>
   );
 };

export default Doctors; 