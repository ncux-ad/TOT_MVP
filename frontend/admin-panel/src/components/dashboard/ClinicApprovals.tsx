import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Avatar,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

const ClinicApprovals: React.FC = () => {
  // В реальном приложении данные будут загружаться из API
  const clinics = [
    {
      id: '1',
      name: 'Клиника №1',
      address: 'ул. Ленина, 123',
      type: 'Многопрофильная клиника',
      status: 'pending',
    },
    {
      id: '2',
      name: 'Медицинский центр "Здоровье"',
      address: 'пр. Мира, 45',
      type: 'Диагностический центр',
      status: 'pending',
    },
    // ... другие клиники
  ];

  const handleApprove = (clinicId: string) => {
    // Реализация одобрения клиники
    console.log('Approve clinic:', clinicId);
  };

  const handleReject = (clinicId: string) => {
    // Реализация отклонения клиники
    console.log('Reject clinic:', clinicId);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Заявки на регистрацию клиник
      </Typography>
      <List>
        {clinics.map((clinic) => (
          <ListItem key={clinic.id}>
            <ListItemAvatar>
              <Avatar>
                <BusinessIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={clinic.name}
              secondary={`${clinic.type} • ${clinic.address}`}
            />
            <ListItemSecondaryAction>
              <Button
                size="small"
                color="success"
                onClick={() => handleApprove(clinic.id)}
                sx={{ mr: 1 }}
              >
                Одобрить
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleReject(clinic.id)}
              >
                Отклонить
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ClinicApprovals;
