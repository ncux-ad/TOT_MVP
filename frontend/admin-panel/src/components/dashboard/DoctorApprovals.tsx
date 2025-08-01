import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Box,
  Avatar,
  Stack,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { adminAPI } from '../../services/api';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experience: number;
  avatar?: string;
}

const DoctorApprovals: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminAPI.getDoctors({ status: 'pending', limit: 5 });
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleApprove = async (doctorId: string) => {
    try {
      await adminAPI.approveDoctor(doctorId);
      setDoctors(doctors.filter(d => d.id !== doctorId));
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleReject = async (doctorId: string) => {
    try {
      await adminAPI.rejectDoctor(doctorId);
      setDoctors(doctors.filter(d => d.id !== doctorId));
    } catch (error) {
      console.error('Error rejecting doctor:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Заявки врачей на рассмотрении
      </Typography>

      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : doctors.length === 0 ? (
        <Typography>Нет заявок на рассмотрении</Typography>
      ) : (
        <List>
          {doctors.map((doctor) => (
            <ListItem key={doctor.id}>
              <Avatar src={doctor.avatar} sx={{ mr: 2 }}>
                {doctor.firstName[0]}
              </Avatar>
              <ListItemText
                primary={`${doctor.firstName} ${doctor.lastName}`}
                secondary={`${doctor.specialization} • Опыт: ${doctor.experience} лет`}
              />
              <ListItemSecondaryAction>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(doctor.id)}
                    startIcon={<CheckIcon />}
                  >
                    Одобрить
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(doctor.id)}
                    startIcon={<CloseIcon />}
                  >
                    Отклонить
                  </Button>
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DoctorApprovals;
