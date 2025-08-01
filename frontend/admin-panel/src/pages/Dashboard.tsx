import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Components
import StatCard from '../components/dashboard/StatCard';
import RecentUsers from '../components/dashboard/RecentUsers';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import DoctorApprovals from '../components/dashboard/DoctorApprovals';
import ClinicApprovals from '../components/dashboard/ClinicApprovals';

const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Панель управления
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего пользователей"
            value="1,234"
            icon="users"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Активные врачи"
            value="156"
            icon="doctors"
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Клиники"
            value="48"
            icon="clinics"
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Записи на прием"
            value="892"
            icon="appointments"
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <RecentUsers />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <RecentAppointments />
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <DoctorApprovals />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <ClinicApprovals />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
