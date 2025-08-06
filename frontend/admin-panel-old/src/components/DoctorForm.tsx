/**
 * @file: DoctorForm.tsx
 * @description: Форма для добавления/редактирования врача
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
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';

interface DoctorFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
}

interface DoctorFormProps {
  doctor?: DoctorFormData;
  onSubmit: (data: DoctorFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  doctor,
  onSubmit,
  onCancel,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'doctor',
    is_active: true
  });

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const handleChange = (field: keyof DoctorFormData) => (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown; checked?: boolean } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'is_active' ? (event.target as any).checked : value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const isEditMode = !!doctor;

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
        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        
        <TextField
          fullWidth
          label="Телефон"
          name="phone"
          value={formData.phone}
          onChange={handleChange('phone')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />

        <TextField
          fullWidth
          label="Имя"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange('first_name')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />

        <TextField
          fullWidth
          label="Фамилия"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange('last_name')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />

        <FormControl fullWidth disabled={loading}>
          <InputLabel>Роль</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange('role')}
            label="Роль"
          >
            <MenuItem value="doctor">Врач</MenuItem>
            <MenuItem value="admin">Администратор</MenuItem>
            <MenuItem value="patient">Пациент</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange('is_active')}
              disabled={loading}
            />
          }
          label="Активен"
        />
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ alignSelf: 'center' }}>
          {isEditMode ? 'Редактирование врача' : 'Добавление нового врача'}
        </Typography>
      </Box>
    </Box>
  );
};

export default DoctorForm; 