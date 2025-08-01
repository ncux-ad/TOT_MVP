import React, { useState, useEffect } from 'react';
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
  TablePagination,
  Chip,
  Button,
} from '@mui/material';
import { adminAPI } from '../services/api';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experience: number;
  status: string;
  createdAt: string;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getDoctors({
        page: page + 1,
        limit: rowsPerPage,
      });
      setDoctors(response.data.doctors);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApprove = async (doctorId: string) => {
    try {
      await adminAPI.approveDoctor(doctorId);
      fetchDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleReject = async (doctorId: string) => {
    try {
      await adminAPI.rejectDoctor(doctorId);
      fetchDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Врачи
      </Typography>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Специализация</TableCell>
                <TableCell>Опыт</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{`${doctor.firstName} ${doctor.lastName}`}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{`${doctor.experience} лет`}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          doctor.status === 'pending'
                            ? 'На рассмотрении'
                            : doctor.status === 'approved'
                            ? 'Подтвержден'
                            : 'Отклонен'
                        }
                        color={
                          doctor.status === 'pending'
                            ? 'warning'
                            : doctor.status === 'approved'
                            ? 'success'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {doctor.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleApprove(doctor.id)}
                            sx={{ mr: 1 }}
                          >
                            Одобрить
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleReject(doctor.id)}
                          >
                            Отклонить
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Строк на странице:"
        />
      </Paper>
    </Box>
  );
};

export default Doctors;
