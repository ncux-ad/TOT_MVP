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
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Настройки системы
      </Typography>

      <Grid container spacing={3}>
        {/* Основные настройки */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Основные настройки
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Название системы"
                defaultValue="ТОТ – Твоя Точка Опоры"
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Часовой пояс</InputLabel>
              <Select defaultValue="Europe/Moscow" label="Часовой пояс">
                <MenuItem value="Europe/Moscow">Москва (UTC+3)</MenuItem>
                <MenuItem value="Europe/Kaliningrad">Калининград (UTC+2)</MenuItem>
                <MenuItem value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Режим обслуживания"
            />
          </Paper>
        </Grid>

        {/* Настройки уведомлений */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Настройки уведомлений
            </Typography>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email уведомления"
              sx={{ display: 'block', mb: 2 }}
            />

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="SMS уведомления"
              sx={{ display: 'block', mb: 2 }}
            />

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Push уведомления"
              sx={{ display: 'block', mb: 2 }}
            />
          </Paper>
        </Grid>

        {/* Настройки безопасности */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Безопасность
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Минимальная длина пароля"
                type="number"
                defaultValue={8}
                variant="outlined"
              />
            </FormControl>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Двухфакторная аутентификация"
              sx={{ display: 'block', mb: 2 }}
            />

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Блокировка после неудачных попыток входа"
              sx={{ display: 'block', mb: 2 }}
            />
          </Paper>
        </Grid>

        {/* Настройки платежей */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Настройки платежей
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Основная валюта</InputLabel>
              <Select defaultValue="RUB" label="Основная валюта">
                <MenuItem value="RUB">Российский рубль (₽)</MenuItem>
                <MenuItem value="USD">US Dollar ($)</MenuItem>
                <MenuItem value="EUR">Euro (€)</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Тестовый режим оплаты"
              sx={{ display: 'block', mb: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary">
          Сохранить изменения
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
