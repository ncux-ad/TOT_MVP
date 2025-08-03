/**
 * @file: Clinics.tsx
 * @description: Страница управления клиниками в админ-панели
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
  Business as ClinicIcon
} from '@mui/icons-material';
import Modal from '../components/Modal';
import ClinicForm from '../components/ClinicForm';
import ConfirmDialog from '../components/ConfirmDialog';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const Clinics: React.FC = () => {
  console.log('🏥 Компонент Clinics загружен');
  
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Модальные окна
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Диалог подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState<Clinic | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 useEffect: загружаем клиники');
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Запрос списка клиник...');
      
      // Пока используем моковые данные, так как API для клиник ещё не создан
      const mockClinics: Clinic[] = [
        {
          id: 'clinic-1',
          name: 'Медицинский центр "Здоровье"',
          address: 'ул. Ленина, 123, Москва',
          phone: '+7 (495) 123-45-67',
          email: 'info@zdorovie.ru',
          description: 'Современный медицинский центр с широким спектром услуг',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'clinic-2', 
          name: 'Клиника "Добрый доктор"',
          address: 'пр. Мира, 456, Санкт-Петербург',
          phone: '+7 (812) 987-65-43',
          email: 'contact@dobrydoctor.ru',
          description: 'Семейная клиника с индивидуальным подходом',
          is_active: true,
          created_at: '2024-01-20T14:30:00Z'
        }
      ];
      
      setClinics(mockClinics);
      console.log('🏥 Список клиник:', mockClinics);
      console.log(`✅ Загружено ${mockClinics.length} клиник`);
      
      // TODO: Заменить на реальный API запрос
      // const response = await axios.get('/admin/clinics?page=1&limit=100');
      // const responseData = response.data.data || response.data;
      // setClinics(responseData.clinics || []);
      
    } catch (err: any) {
      console.error('❌ Ошибка загрузки клиник:', err);
      setError(err.response?.data?.detail || 'Ошибка загрузки списка клиник');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активна' : 'Неактивна';
  };

  const handleRefresh = () => {
    console.log('🔄 Обновляем список клиник');
    fetchClinics();
  };

  const handleAddClinic = () => {
    console.log('➕ Открываем модальное окно добавления клиники');
    setAddModalOpen(true);
    setFormError(null);
  };

  const handleEditClinic = (clinic: Clinic) => {
    console.log('✏️ Открываем модальное окно редактирования клиники:', clinic.id);
    setSelectedClinic(clinic);
    setEditModalOpen(true);
    setFormError(null);
  };

  const handleSubmitClinic = async (formData: any) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      console.log('💾 Сохраняем данные клиники:', formData);
      
      // TODO: Заменить на реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      console.log('✅ Клиника успешно сохранена');
      
      // Закрываем модальное окно и обновляем список
      setAddModalOpen(false);
      setEditModalOpen(false);
      setSelectedClinic(null);
      fetchClinics(); // Обновляем список
      
    } catch (err: any) {
      console.error('❌ Ошибка сохранения клиники:', err);
      setFormError('Ошибка сохранения данных клиники');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log('📝 Данные формы клиники:', data);
    handleSubmitClinic(data);
  };

  const handleCloseModal = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setSelectedClinic(null);
    setFormError(null);
  };

  const handleDeleteClinic = (clinic: Clinic) => {
    console.log('🗑️ Открываем диалог удаления клиники:', clinic.id);
    setClinicToDelete(clinic);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clinicToDelete) return;
    
    setDeleteLoading(true);
    try {
      console.log('🗑️ Удаляем клинику:', clinicToDelete.id);
      
      // TODO: Заменить на реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      console.log('✅ Клиника успешно удалена');
      
      // Обновляем список
      setClinics(prev => prev.filter(clinic => clinic.id !== clinicToDelete.id));
      
    } catch (err: any) {
      console.error('❌ Ошибка удаления клиники:', err);
      setError('Ошибка удаления клиники');
    } finally {
      setDeleteLoading(false);
      setClinicToDelete(null);
    }
  };

  const handleViewClinic = (clinic: Clinic) => {
    console.log('👁️ Просмотр клиники:', clinic.id);
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
          Управление клиниками
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClinic}
            sx={{ mr: 1 }}
          >
            Добавить клинику
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
              <TableCell>Название</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clinics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Клиники не найдены
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clinics.map((clinic) => (
                <TableRow key={clinic.id} hover>
                  <TableCell>{clinic.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ClinicIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {clinic.name}
                    </Box>
                  </TableCell>
                  <TableCell>{clinic.address}</TableCell>
                  <TableCell>{clinic.phone}</TableCell>
                  <TableCell>{clinic.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(clinic.is_active)}
                      color={getStatusColor(clinic.is_active) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Просмотреть">
                      <IconButton onClick={() => handleViewClinic(clinic)} size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => handleEditClinic(clinic)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton onClick={() => handleDeleteClinic(clinic)} size="small" color="error">
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
          Всего клиник: {clinics.length}
        </Typography>
      </Box>

      {/* Модальное окно добавления клиники */}
      <Modal
        open={addModalOpen}
        onClose={handleCloseModal}
        title="Добавить клинику"
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
        <ClinicForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
          error={formError}
        />
      </Modal>

      {/* Модальное окно редактирования клиники */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseModal}
        title="Редактировать клинику"
        actions={
          <>
            <Button onClick={handleCloseModal} disabled={formLoading}>
              Отмена
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleFormSubmit(selectedClinic)}
              disabled={formLoading}
            >
              {formLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        }
      >
        <ClinicForm
          clinic={selectedClinic || undefined}
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
           setClinicToDelete(null);
         }}
         onConfirm={handleConfirmDelete}
         title="Подтверждение удаления"
         message={`Вы действительно хотите удалить клинику "${clinicToDelete?.name}"?`}
         confirmText="Удалить клинику"
         loading={deleteLoading}
         severity="error"
       />
     </Box>
   );
 };

export default Clinics; 