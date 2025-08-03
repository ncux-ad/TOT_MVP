# 🏥 ТОТ - Твоя Точка Опоры
**Микросервисная система для вызова врачей на дом с интеграцией российских платежных систем**

## 🚀 Текущий статус
### ✅ Работающие сервисы
- **API Gateway** (порт 8000) - Единая точка входа
- **User Service** (порт 8001) - Управление пользователями
- **Profile Service** (порт 8002) - Профили пациентов/врачей/клиник
- **Booking Service** (порт 8003) - Управление заказами вызовов врачей
- **Payment Service** (порт 8005) - Платежи через ЮKassa и СБП

### 🎉 Frontend приложения готовы!
- **Patient App** (порт 3000) - Полнофункциональное React приложение для пациентов
- **Admin Panel** (порт 3003) - Админ-панель на Material-UI для управления системой
- Современный дизайн с Tailwind CSS / Material-UI
- Темная/светлая тема
- Адаптивный интерфейс
- Все основные страницы реализованы

## 🌐 Доступ из локальной сети
Система настроена для доступа из локальной сети:
| Сервис | Локальный URL | Сетевой URL |
|--------|---------------|-------------|
| API Gateway | `http://localhost:8000` | `http://192.168.1.107:8000` |
| User Service | `http://localhost:8001` | `http://192.168.1.107:8001` |
| Profile Service | `http://localhost:8002` | `http://192.168.1.107:8002` |
| Booking Service | `http://localhost:8003` | `http://192.168.1.107:8003` |
| Payment Service | `http://localhost:8005` | `http://192.168.1.107:8005` |
| **Patient App** | `http://localhost:3000` | `http://192.168.1.107:3000` |
| **Admin Panel** | `http://localhost:3003` | `http://192.168.1.107:3003` |

## 🚀 Быстрый старт

### 1. Настройка переменных окружения
```powershell
# Создать .env файл с настройками
.\scripts\manage-env.ps1 -Action create

# Просмотреть текущие настройки
.\scripts\manage-env.ps1 -Action show
```

### 2. Запуск всей системы
```powershell
# Запуск всех сервисов одной командой
.\scripts\start-all.ps1
```

### 🔧 Пошаговый запуск:
```powershell
# 1. Запуск Backend сервисов
.\scripts\start-backend.ps1

# 2. Запуск Frontend приложения
.\scripts\start-frontend.ps1
```

### 🛑 Остановка системы:
```powershell
# Остановка всех сервисов
.\scripts\stop-all.ps1
```

### 3. Откройте в браузере
- **Patient App:** http://localhost:3000
- **Admin Panel:** http://localhost:3003
- **Демо аккаунты:**
  - Patient App: patient@example.com / password123
  - Admin Panel: admin@tot.ru / admin123

## 📱 Созданные страницы Patient App

### ✅ Реализованные страницы:
1. **Вход/Регистрация** (`/login`, `/register`)
2. **Главная страница** (`/`) - Дашборд с быстрыми действиями
3. **Профиль** (`/profile`) - Информация о пользователе
4. **Врачи** (`/doctors`) - Список врачей с рейтингами
5. **Записи** (`/bookings`) - История записей к врачам
6. **Платежи** (`/payments`) - Баланс и история транзакций
7. **Чат** (`/chat`) - Общение с врачами
8. **Экстренные вызовы** (`/emergency`) - Для критических ситуаций

## 🎛️ Созданные страницы Admin Panel

### ✅ Реализованные страницы:
1. **Вход** (`/login`) - Аутентификация администратора
2. **Дашборд** (`/`) - Общая статистика и графики
3. **Пользователи** (`/users`) - Управление пользователями
4. **Врачи** (`/doctors`) - Управление врачами и одобрения
5. **Клиники** (`/clinics`) - Управление клиниками
6. **Записи** (`/appointments`) - Просмотр всех записей
7. **Отчеты** (`/reports`) - Генерация отчетов и аналитика
8. **Настройки** (`/settings`) - Конфигурация системы

## 🛠️ Технологии

### Backend:
- **Python 3.8+** с FastAPI
- **SQLite** для локальной разработки
- **JWT** аутентификация
- **Pydantic** валидация данных
- **SQLAlchemy** ORM

### Frontend:
- **React 18** + **TypeScript**
- **Tailwind CSS** для стилизации
- **Material-UI** для админ-панели
- **React Router v6** для навигации
- **React Query** для состояния
- **React Hook Form** для форм
- **Lucide React** для иконок

### Платежные системы:
- **ЮKassa** - основная платежная система
- **СБП** (Система Быстрых Платежей)
- **Внутренний кошелек** для баланса

## 📁 Структура проекта

```
TOT_MVP/
├── backend/                 # Backend микросервисы
│   ├── api-gateway/        # API Gateway (порт 8000)
│   ├── user-service/       # User Service (порт 8001)
│   ├── profile-service/    # Profile Service (порт 8002)
│   ├── booking-service/    # Booking Service (порт 8003)
│   ├── payment-service/    # Payment Service (порт 8005)
│   └── ...                 # Другие сервисы
├── frontend/               # Frontend приложения
│   ├── patient-app/        # ✅ Patient App (порт 3000)
│   ├── doctor-app/         # 🔄 Doctor App (планируется)
│   ├── clinic-web/         # 🔄 Clinic Web (планируется)
│   └── admin-panel/        # ✅ Admin Panel (порт 3003)
├── docs/                   # Документация
├── scripts/                # Скрипты установки
└── README.md
```

## 🔧 Конфигурация

### Переменные окружения
Скопируйте `env.example` в `.env` и настройте:
```env
# База данных
DATABASE_URL=sqlite:///./tot_mvp.db

# JWT
JWT_SECRET=tot-mvp-super-secret-key-2024
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# ЮKassa
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key

# СБП
SBP_MERCHANT_ID=your_merchant_id
SBP_PRIVATE_KEY_PATH=path/to/private.key

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## 📚 Документация

- [📋 Архитектура](docs/ARCHITECTURE.md)
- [🔍 Ревью проекта](docs/PROJECT_REVIEW.md)
- [🚀 Развертывание](docs/DEPLOYMENT.md)
- [🌐 Сетевой доступ](docs/NETWORK_ACCESS.md)
- [🎨 Frontend](docs/FRONTEND_COMPLETE.md)
- [📊 Текущий статус](docs/CURRENT_STATUS.md)

## 🔄 Roadmap

### Phase 1: ✅ Завершено
- [x] Backend микросервисы
- [x] API Gateway
- [x] User/Profile/Payment сервисы
- [x] Booking Service
- [x] Интеграция ЮKassa и СБП
- [x] Patient App (React)
- [x] Admin Panel (Material-UI)
- [x] Современный UI/UX
- [x] Адаптивный дизайн

### Phase 2: 🔄 В разработке
- [ ] Doctor App (React)
- [ ] Clinic Web (React)
- [ ] Notification Service
- [ ] Chat Service
- [ ] Geo Service

### Phase 3: 📋 Планируется
- [ ] Push уведомления
- [ ] Видео-звонки
- [ ] Геолокация
- [ ] Мобильные приложения

## 🐛 Известные проблемы

- **Безопасность**: Хардкод секретов в коде (требует исправления)
- **Тестирование**: Отсутствуют unit и integration тесты
- **Типизация**: Частично отсутствует строгая типизация в TypeScript
- **Мониторинг**: Нет структурированного логирования

## 🆘 Поддержка

### 📚 Документация
- [🚀 Скрипты управления](docs/SCRIPTS.md) - Подробная документация по скриптам
- [🔧 Переменные окружения](docs/ENVIRONMENT_SETUP.md) - Настройка переменных окружения
- [📋 Архитектура](docs/ARCHITECTURE.md) - Архитектура системы
- [🌐 Сетевой доступ](docs/NETWORK_ACCESS.md) - Настройка доступа из сети
- [🎨 Frontend](docs/FRONTEND_COMPLETE.md) - Документация по React приложению

### Полезные команды
```powershell
# Проверка статуса сервисов
netstat -ano | findstr ":800"
netstat -ano | findstr ":3000"

# Настройка брандмауэра
.\scripts\setup-firewall.ps1

# Установка Node.js
.\scripts\install-nodejs.ps1
```

### Логи
- Backend логи выводятся в консоль
- Frontend логи в браузере (F12)

## 🎯 Демо данные

### Patient App
- **URL**: http://localhost:3000
- **Email**: patient@example.com
- **Пароль**: password123

### Admin Panel
- **URL**: http://localhost:3003
- **Email**: admin@tot.ru
- **Пароль**: admin123

### API документация
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

**🎉 ТОТ MVP готов к использованию!**

Откройте http://localhost:3000 и наслаждайтесь современным интерфейсом! 