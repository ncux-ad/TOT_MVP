// Тестовые данные для админ-панели
export const testData = {
  // Статистика
  stats: {
    totalUsers: 1250,
    totalDoctors: 45,
    totalClinics: 12,
    totalAppointments: 890,
    activeUsers: 980,
    pendingApprovals: 8
  },

  // Графики
  charts: {
    usersGrowth: [
      { month: 'Янв', users: 120 },
      { month: 'Фев', users: 150 },
      { month: 'Мар', users: 180 },
      { month: 'Апр', users: 220 },
      { month: 'Май', users: 280 },
      { month: 'Июн', users: 320 }
    ],
    appointmentsByMonth: [
      { month: 'Янв', appointments: 45 },
      { month: 'Фев', appointments: 52 },
      { month: 'Мар', appointments: 61 },
      { month: 'Апр', appointments: 73 },
      { month: 'Май', appointments: 85 },
      { month: 'Июн', appointments: 92 }
    ]
  },

  // Уведомления
  notifications: [
    {
      id: '1',
      type: 'warning',
      message: 'Новый врач ожидает одобрения',
      time: '2 минуты назад'
    },
    {
      id: '2',
      type: 'info',
      message: 'Система обновлена до версии 2.1',
      time: '1 час назад'
    },
    {
      id: '3',
      type: 'error',
      message: 'Ошибка в платежной системе',
      time: '3 часа назад'
    }
  ]
};

export default testData;
