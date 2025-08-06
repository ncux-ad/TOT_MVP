/**
 * @file: ClinicForm.tsx
 * @description: Форма для добавления/редактирования клиники
 * @dependencies: React, @mui/material, @mui/icons-material
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { 
  Business as BusinessIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

interface ClinicFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  is_active: boolean;
}

interface ClinicFormProps {
  clinic?: ClinicFormData;
  onSubmit: (data: ClinicFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

const ClinicForm: React.FC<ClinicFormProps> = ({
  clinic,
  onSubmit,
  onCancel,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    if (clinic) {
      setFormData(clinic);
    }
  }, [clinic]);

  const handleChange = (field: keyof ClinicFormData) => (
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

  const isEditMode = !!clinic;

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
          label="Название клиники"
          name="name"
          value={formData.name}
          onChange={handleChange('name')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
          label="Адрес"
          name="address"
          value={formData.address}
          onChange={handleChange('address')}
          required
          disabled={loading}
          InputProps={{
            startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Описание"
          name="description"
          value={formData.description}
          onChange={handleChange('description')}
          multiline
          rows={3}
          disabled={loading}
          InputProps={{
            startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
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
          label="Активна"
        />
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ alignSelf: 'center' }}>
          {isEditMode ? 'Редактирование клиники' : 'Добавление новой клиники'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ClinicForm; 