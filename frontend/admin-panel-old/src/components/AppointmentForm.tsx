/**
 * @file: AppointmentForm.tsx
 * @description: Форма для добавления/редактирования записи на приём
 * @dependencies: React, @mui/material, @mui/icons-material
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { 
  Event as EventIcon, 
  Person as PersonIcon, 
  LocalHospital as DoctorIcon,
  Business as ClinicIcon,
  Schedule as TimeIcon,
  Description as NotesIcon
} from '@mui/icons-material';

interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  clinic_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
}

interface AppointmentFormProps {
  appointment?: AppointmentFormData;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSubmit,
  onCancel,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: '',
    doctor_id: '',
    clinic_id: '',
    appointment_date: '',
    appointment_time: '',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

  const handleChange = (field: keyof AppointmentFormData) => (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown; checked?: boolean } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const isEditMode = !!appointment;

  // Моковые данные для демонстрации
  const mockPatients = [
    { id: 'patient-1', name: 'Иван Иванов' },
    { id: 'patient-2', name: 'Мария Сидорова' },
    { id: 'patient-3', name: 'Алексей Волков' }
  ];

  const mockDoctors = [
    { id: 'doctor-1', name: 'Петр Петров' },
    { id: 'doctor-2', name: 'Анна Козлова' },
    { id: 'doctor-3', name: 'Сергей Иванов' }
  ];

  const mockClinics = [
    { id: 'clinic-1', name: 'Медицинский центр "Здоровье"' },
    { id: 'clinic-2', name: 'Клиника "Добрый доктор"' }
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
        gap: 2 
      }}>
        <FormControl fullWidth disabled={loading}>
          <InputLabel>Пациент</InputLabel>
          <Select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange('patient_id')}
            label="Пациент"
            required
            inputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          >
            {mockPatients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={loading}>
          <InputLabel>Врач</InputLabel>
          <Select
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleChange('doctor_id')}
            label="Врач"
            required
            inputProps={{
              startAdornment: <DoctorIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          >
            {mockDoctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={loading}>
          <InputLabel>Клиника</InputLabel>
          <Select
            name="clinic_id"
            value={formData.clinic_id}
            onChange={handleChange('clinic_id')}
            label="Клиника"
            required
            inputProps={{
              startAdornment: <ClinicIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          >
            {mockClinics.map((clinic) => (
              <MenuItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Дата приёма"
          type="date"
          name="appointment_date"
          value={formData.appointment_date}
          onChange={handleChange('appointment_date')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          fullWidth
          label="Время приёма"
          type="time"
          name="appointment_time"
          value={formData.appointment_time}
          onChange={handleChange('appointment_time')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControl fullWidth disabled={loading}>
          <InputLabel>Статус</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange('status')}
            label="Статус"
            required
          >
            <MenuItem value="pending">Ожидает</MenuItem>
            <MenuItem value="confirmed">Подтверждена</MenuItem>
            <MenuItem value="cancelled">Отменена</MenuItem>
            <MenuItem value="completed">Завершена</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Примечания"
          name="notes"
          value={formData.notes}
          onChange={handleChange('notes')}
          multiline
          rows={3}
          disabled={loading}
          InputProps={{
            startAdornment: <NotesIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ alignSelf: 'center' }}>
          {isEditMode ? 'Редактирование записи' : 'Добавление новой записи'}
        </Typography>
      </Box>
    </Box>
  );
};

export default AppointmentForm; 