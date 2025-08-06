/**
 * @file: Sidebar.tsx
 * @description: Боковое меню навигации админ-панели
 * @dependencies: React, @mui/material, @mui/icons-material
 * @created: 2024-01-28
 */
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as DoctorsIcon,
  Business as ClinicsIcon,
  Event as AppointmentsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Главная', icon: DashboardIcon },
  { id: 'users', label: 'Пользователи', icon: PeopleIcon },
  { id: 'doctors', label: 'Врачи', icon: DoctorsIcon },
  { id: 'clinics', label: 'Клиники', icon: ClinicsIcon },
  { id: 'appointments', label: 'Записи', icon: AppointmentsIcon },
  { id: 'reports', label: 'Отчёты', icon: ReportsIcon },
  { id: 'settings', label: 'Настройки', icon: SettingsIcon }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onClose, 
  onNavigate, 
  currentPage 
}) => {
  console.log('📱 Компонент Sidebar загружен');

  const handleItemClick = (pageId: string) => {
    console.log('🔄 Навигация к странице:', pageId);
    onNavigate(pageId);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Админ-панель ТОТ
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isSelected = currentPage === item.id;
          
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.id)}
                selected={isSelected}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: isSelected ? 'inherit' : 'text.secondary',
                  minWidth: 40 
                }}>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar; 