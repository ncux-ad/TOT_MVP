# 🏥 ТОТ - Твоя Точка Опоры
**Микросервисная система для вызова врачей на дом с интеграцией российских платежных систем**

## 🚀 Текущий статус
### ✅ Работающие сервисы
- **API Gateway** (порт 8000) - Единая точка входа
- **User Service** (порт 8001) - Управление пользователями
- **Profile Service** (порт 8002) - Профили пациентов/врачей/клиник
- **Payment Service** (порт 8005) - Платежи через ЮKassa и СБП

### 🎉 Frontend приложение готово!
- **Patient App** (порт 3000) - Полнофункциональное React приложение для пациентов
- Современный дизайн с Tailwind CSS
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
| Payment Service | `http://localhost:8005` | `http://192.168.1.107:8005` |
| **Patient App** | `http://localhost:3000` | `http://192.168.1.107:3000` |

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
- **Демо аккаунт:** patient@example.com / password123

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
│   ├── payment-service/    # Payment Service (порт 8005)
│   └── ...                 # Другие сервисы
├── frontend/               # Frontend приложения
│   ├── patient-app/        # ✅ Patient App (порт 3000)
│   ├── doctor-app/         # 🔄 Doctor App (планируется)
│   ├── clinic-web/         # 🔄 Clinic Web (планируется)
│   └── admin-panel/        # 🔄 Admin Panel (планируется)
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

# ЮKassa
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key

# СБП
SBP_MERCHANT_ID=your_merchant_id
SBP_PRIVATE_KEY_PATH=path/to/private.key
```

## 📚 Документация

- [📋 Архитектура](docs/ARCHITECTURE.md)
- [🚀 Развертывание](docs/DEPLOYMENT.md)
- [🌐 Сетевой доступ](docs/NETWORK_ACCESS.md)
- [🎨 Frontend](docs/FRONTEND_COMPLETE.md)
- [📊 Текущий статус](docs/CURRENT_STATUS.md)

## 🔄 Roadmap

### Phase 1: ✅ Завершено
- [x] Backend микросервисы
- [x] API Gateway
- [x] User/Profile/Payment сервисы
- [x] Интеграция ЮKassa и СБП
- [x] Patient App (React)
- [x] Современный UI/UX
- [x] Адаптивный дизайн

### Phase 2: 🔄 В разработке
- [ ] Doctor App (React)
- [ ] Clinic Web (React)
- [ ] Admin Panel (React)
- [ ] Интеграция с реальными API

### Phase 3: 📋 Планируется
- [ ] Push уведомления
- [ ] Видео-звонки
- [ ] Геолокация
- [ ] Мобильные приложения

## 🐛 Известные проблемы

- **favicon.ico 404**: Не критично, можно игнорировать
- **Proxy ошибки**: Нормально, если backend не запущен
- **WSL2 проблемы**: Используется локальная Windows установка

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

---

**🎉 ТОТ MVP готов к использованию!**

Откройте http://localhost:3000 и наслаждайтесь современным интерфейсом! 