import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Clinics: React.FC = () => {
  const columns = [
    { field: 'name', headerName: 'Название', width: 200 },
    { field: 'address', headerName: 'Адрес', width: 250 },
    { field: 'phone', headerName: 'Телефон', width: 150 },
    { field: 'type', headerName: 'Тип', width: 200 },
    { field: 'status', headerName: 'Статус', width: 130 },
    { field: 'doctorsCount', headerName: 'Кол-во врачей', width: 130 },
  ];

  const rows = [
    {
      id: 1,
      name: 'Клиника №1',
      address: 'ул. Ленина, 123',
      phone: '+7 (999) 123-45-67',
      type: 'Многопрофильная',
      status: 'Активна',
      doctorsCount: 15,
    },
    // ... другие клиники
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Клиники
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Clinics;
