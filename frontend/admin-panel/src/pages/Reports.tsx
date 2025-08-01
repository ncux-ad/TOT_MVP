import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reports: React.FC = () => {
  // Пример данных для графика
  const data = [
    { name: 'Янв', appointments: 400, revenue: 24000 },
    { name: 'Фев', appointments: 300, revenue: 18000 },
    { name: 'Мар', appointments: 500, revenue: 30000 },
    { name: 'Апр', appointments: 450, revenue: 27000 },
    { name: 'Май', appointments: 600, revenue: 36000 },
    { name: 'Июн', appointments: 550, revenue: 33000 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Отчеты
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Тип отчета</InputLabel>
                <Select value="appointments" label="Тип отчета">
                  <MenuItem value="appointments">Записи на прием</MenuItem>
                  <MenuItem value="revenue">Выручка</MenuItem>
                  <MenuItem value="doctors">Врачи</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Период</InputLabel>
                <Select value="6months" label="Период">
                  <MenuItem value="7days">Последние 7 дней</MenuItem>
                  <MenuItem value="30days">Последние 30 дней</MenuItem>
                  <MenuItem value="6months">Последние 6 месяцев</MenuItem>
                  <MenuItem value="1year">Последний год</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained">Сформировать отчет</Button>
            </Box>

            <Box sx={{ width: '100%', height: 400 }}>
              <BarChart
                width={800}
                height={400}
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="appointments" fill="#8884d8" name="Записи" />
                <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Выручка" />
              </BarChart>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
