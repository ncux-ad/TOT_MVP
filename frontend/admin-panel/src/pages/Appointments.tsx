/**
 * @file: Appointments.tsx
 * @description: Страница управления записями на приём в админ-панели
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
  Add as AddIcon,
  CheckCircle as ConfirmedIcon,
  Cancel as CancelledIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';
import Modal from '../components/Modal';
import AppointmentForm from '../components/AppointmentForm';
import ConfirmDialog from '../components/ConfirmDialog';

interface Appointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  clinic_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  created_at: string;
}

const Appointments: React.FC = () => {
  console.log('📅 Компонент Appointments загружен');
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Модальные окна
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Диалог подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 useEffect: загружаем записи');
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Запрос списка записей...');
      
      // Пока используем моковые данные, так как API для записей ещё не создан
      const mockAppointments: Appointment[] = [
        {
          id: 'appointment-1',
          patient_name: 'Иван Иванов',
          doctor_name: 'Петр Петров',
          clinic_name: 'Медицинский центр "Здоровье"',
          appointment_date: '2024-01-30',
          appointment_time: '10:00',
          status: 'confirmed',
          notes: 'Консультация терапевта',
          created_at: '2024-01-25T09:00:00Z'
        },
        {
          id: 'appointment-2',
          patient_name: 'Мария Сидорова',
          doctor_name: 'Анна Козлова',
          clinic_name: 'Клиника "Добрый доктор"',
          appointment_date: '2024-02-01',
          appointment_time: '14:30',
          status: 'pending',
          notes: 'Осмотр кардиолога',
          created_at: '2024-01-26T11:30:00Z'
        },
        {
          id: 'appointment-3',
          patient_name: 'Алексей Волков',
          doctor_name: 'Петр Петров',
          clinic_name: 'Медицинский центр "Здоровье"',
          appointment_date: '2024-01-29',
          appointment_time: '16:00',
          status: 'cancelled',
          notes: 'Отменено пациентом',
          created_at: '2024-01-24T15:45:00Z'
        }
      ];
      
      setAppointments(mockAppointments);
      console.log('📅 Список записей:', mockAppointments);
      console.log(`✅ Загружено ${mockAppointments.length} записей`);
      
      // TODO: Заменить на реальный API запрос
      // const response = await axios.get('/admin/appointments?page=1&limit=100');
      // const responseData = response.data.data || response.data;
      // setAppointments(responseData.appointments || []);
      
    } catch (err: any) {
      console.error('❌ Ошибка загрузки записей:', err);
      setError(err.response?.data?.detail || 'Ошибка загрузки списка записей');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждена';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменена';
      case 'completed': return 'Завершена';
      default: return 'Неизвестно';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <ConfirmedIcon />;
      case 'pending': return <PendingIcon />;
      case 'cancelled': return <CancelledIcon />;
      case 'completed': return <ConfirmedIcon />;
      default: return <PendingIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const handleRefresh = () => {
    console.log('🔄 Обновляем список записей');
    fetchAppointments();
  };

  const handleAddAppointment = () => {
    console.log('➕ Открываем модальное окно добавления записи');
    setAddModalOpen(true);
    setFormError(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    console.log('✏️ Открываем модальное окно редактирования записи:', appointment.id);
    setSelectedAppointment(appointment);
    setEditModalOpen(true);
    setFormError(null);
  };

  const handleSubmitAppointment = async (formData: any) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      console.log('💾 Сохраняем данные записи:', formData);
      
      // TODO: Заменить на реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      console.log('✅ Запись успешно сохранена');
      
      // Закрываем модальное окно и обновляем список
      setAddModalOpen(false);
      setEditModalOpen(false);
      setSelectedAppointment(null);
      fetchAppointments(); // Обновляем список
      
    } catch (err: any) {
      console.error('❌ Ошибка сохранения записи:', err);
      setFormError('Ошибка сохранения данных записи');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log('📝 Данные формы записи:', data);
    handleSubmitAppointment(data);
  };

  const handleCloseModal = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setSelectedAppointment(null);
    setFormError(null);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    console.log('🗑️ Открываем диалог удаления записи:', appointment.id);
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;
    
    setDeleteLoading(true);
    try {
      console.log('🗑️ Удаляем запись:', appointmentToDelete.id);
      
      // TODO: Заменить на реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      console.log('✅ Запись успешно удалена');
      
      // Обновляем список
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentToDelete.id));
      
    } catch (err: any) {
      console.error('❌ Ошибка удаления записи:', err);
      setError('Ошибка удаления записи');
    } finally {
      setDeleteLoading(false);
      setAppointmentToDelete(null);
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    console.log('👁️ Просмотр записи:', appointment.id);
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
          Управление записями
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAppointment}
            sx={{ mr: 1 }}
          >
            Добавить запись
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
              <TableCell>Пациент</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Клиника</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Время</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Записи не найдены
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>{appointment.id.substring(0, 8)}...</TableCell>
                  <TableCell>{appointment.patient_name}</TableCell>
                  <TableCell>{appointment.doctor_name}</TableCell>
                  <TableCell>{appointment.clinic_name}</TableCell>
                  <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(appointment.status)}
                      label={getStatusText(appointment.status)}
                      color={getStatusColor(appointment.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Просмотреть">
                      <IconButton onClick={() => handleViewAppointment(appointment)} size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => handleEditAppointment(appointment)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton onClick={() => handleDeleteAppointment(appointment)} size="small" color="error">
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
          Всего записей: {appointments.length}
        </Typography>
      </Box>

      {/* Модальное окно добавления записи */}
      <Modal
        open={addModalOpen}
        onClose={handleCloseModal}
        title="Добавить запись"
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
        <AppointmentForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
          error={formError}
        />
      </Modal>

      {/* Модальное окно редактирования записи */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseModal}
        title="Редактировать запись"
        actions={
          <>
            <Button onClick={handleCloseModal} disabled={formLoading}>
              Отмена
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleFormSubmit(selectedAppointment)}
              disabled={formLoading}
            >
              {formLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        }
      >
        <AppointmentForm
          appointment={selectedAppointment ? {
            patient_id: selectedAppointment.patient_name,
            doctor_id: selectedAppointment.doctor_name,
            clinic_id: selectedAppointment.clinic_name,
            appointment_date: selectedAppointment.appointment_date,
            appointment_time: selectedAppointment.appointment_time,
            status: selectedAppointment.status,
            notes: selectedAppointment.notes
          } : undefined}
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
           setAppointmentToDelete(null);
         }}
         onConfirm={handleConfirmDelete}
         title="Подтверждение удаления"
         message={`Вы действительно хотите удалить запись на приём для "${appointmentToDelete?.patient_name}"?`}
         confirmText="Удалить запись"
         loading={deleteLoading}
         severity="error"
       />
     </Box>
   );
 };

export default Appointments; 