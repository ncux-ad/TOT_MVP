import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Appointments: React.FC = () => {
  const columns = [
    { field: 'patientName', headerName: 'Пациент', width: 200 },
    { field: 'doctorName', headerName: 'Врач', width: 200 },
    { field: 'specialization', headerName: 'Специализация', width: 150 },
    { field: 'date', headerName: 'Дата', width: 130 },
    { field: 'time', headerName: 'Время', width: 100 },
    { field: 'status', headerName: 'Статус', width: 130 },
    { field: 'clinic', headerName: 'Клиника', width: 200 },
  ];

  const rows = [
    {
      id: 1,
      patientName: 'Иван Петров',
      doctorName: 'Др. Сидоров',
      specialization: 'Терапевт',
      date: '2024-08-02',
      time: '10:00',
      status: 'Подтверждено',
      clinic: 'Клиника №1',
    },
    // ... другие записи
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Записи на прием
      </Typography>

      <Paper style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default Appointments;
