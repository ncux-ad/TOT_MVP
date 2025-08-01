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
} from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';

const RecentAppointments: React.FC = () => {
  // В реальном приложении данные будут загружаться из API
  const appointments = [
    {
      id: '1',
      patientName: 'Иван Петров',
      doctorName: 'Др. Сидоров',
      date: '2024-08-02',
      time: '10:00',
      status: 'pending',
    },
    {
      id: '2',
      patientName: 'Мария Иванова',
      doctorName: 'Др. Кузнецов',
      date: '2024-08-02',
      time: '11:30',
      status: 'confirmed',
    },
    // ... другие записи
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Последние записи на прием
      </Typography>
      <List>
        {appointments.map((appointment) => (
          <ListItem key={appointment.id}>
            <ListItemAvatar>
              <EventIcon color="primary" />
            </ListItemAvatar>
            <ListItemText
              primary={`${appointment.patientName} → ${appointment.doctorName}`}
              secondary={`${new Date(appointment.date).toLocaleDateString('ru-RU')} ${
                appointment.time
              }`}
            />
            <ListItemSecondaryAction>
              <Button
                size="small"
                color={appointment.status === 'confirmed' ? 'success' : 'warning'}
                variant="outlined"
              >
                {appointment.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecentAppointments;
