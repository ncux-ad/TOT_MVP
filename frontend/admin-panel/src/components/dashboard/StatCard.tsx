import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';

interface StatCardProps {
  title: string;
  value: string;
  icon: 'users' | 'doctors' | 'clinics' | 'appointments';
  color: string;
}

const icons = {
  users: PeopleIcon,
  doctors: LocalHospitalIcon,
  clinics: BusinessIcon,
  appointments: EventIcon,
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const IconComponent = icons[icon];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent sx={{ color }} />
          </Box>
          <Typography variant="h6" component="div">
            {value}
          </Typography>
        </Box>
        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
