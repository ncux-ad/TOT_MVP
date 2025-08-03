# 🚀 Текущий статус проекта ТОТ MVP

## 📊 Обзор проекта

**ТОТ - Твоя Точка Опоры** - это микросервисная система для вызова врачей на дом с интеграцией российских платежных систем.

### ✅ Работающие сервисы

| Сервис | Порт | Статус | Описание |
|--------|------|--------|----------|
| **API Gateway** | 8000 | ✅ Работает | Единая точка входа для всех API |
| **User Service** | 8001 | ✅ Работает | Управление пользователями и аутентификация |
| **Profile Service** | 8002 | ✅ Работает | Профили пациентов, врачей и клиник |
| **Booking Service** | 8003 | ✅ Работает | Управление заказами вызовов врачей |
| **Payment Service** | 8005 | ✅ Работает | Платежи через ЮKassa и СБП |
| **Patient App** | 3000 | ✅ Работает | React приложение для пациентов |
| **Admin Panel** | 3003 | ✅ Работает | Material-UI админ-панель |

### 🔧 Технические изменения

#### База данных
- **Переход на SQLite**: Все сервисы используют SQLite для быстрого тестирования
- **Переменная окружения**: `DATABASE_URL=sqlite:///./tot_mvp.db`
- **Файл БД**: `tot_mvp.db` создается автоматически

#### Frontend приложения
- **Patient App**: Полнофункциональное React приложение с TypeScript
- **Admin Panel**: Material-UI админ-панель с современным дизайном
- **Обновленные зависимости**: Убраны устаревшие пакеты, установлен Node.js 24.5.0

#### Платежные системы
- **ЮKassa**: Интеграция с российским платежным провайдером
- **СБП**: Система Быстрых Платежей с QR-кодами
- **Кошелек**: Внутренняя система балансов

#### Исправления в коде
- **Payment Service**: Исправлен конфликт с зарезервированным словом `metadata` → `payment_metadata`
- **SQLAlchemy**: Добавлены `pyright: ignore` комментарии для совместимости
- **CORS**: Настроен для всех сервисов
- **TypeScript**: Исправлены ошибки типизации в admin-panel
- **Material-UI**: Переустановлены иконки для корректной работы

## 🌐 Доступные эндпоинты

### API Gateway (порт 8000)
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **OpenAPI**: http://localhost:8000/openapi.json

### User Service (порт 8001)
- **Health Check**: http://localhost:8001/health
- **Регистрация**: POST /auth/register
- **Авторизация**: POST /auth/login
- **Профиль**: GET /auth/me

### Profile Service (порт 8002)
- **Health Check**: http://localhost:8002/health
- **Профили пациентов**: /profiles/
- **Профили врачей**: /doctor-profiles/
- **Профили клиник**: /clinic-profiles/

### Booking Service (порт 8003)
- **Health Check**: http://localhost:8003/health
- **Создание заказа**: POST /bookings
- **Получение заказов**: GET /bookings
- **Отмена заказа**: PUT /bookings/{id}/cancel
- **Назначение врача**: PUT /bookings/{id}/assign
- **Завершение заказа**: PUT /bookings/{id}/complete

### Payment Service (порт 8005)
- **Health Check**: http://localhost:8005/health
- **Платежи**: /payments/
- **Кошельки**: /wallets/
- **Транзакции**: /transactions/

## 💳 Платежные методы

### 1. ЮKassa
```json
{
  "user_id": 1,
  "amount": 1500.0,
  "payment_method": "yookassa",
  "description": "Вызов врача на дом"
}
```

### 2. СБП (QR-код)
```json
{
  "user_id": 1,
  "amount": 1500.0,
  "payment_method": "sbp",
  "description": "Вызов врача на дом"
}
```

### 3. Кошелек
```json
{
  "user_id": 1,
  "amount": 1500.0,
  "payment_method": "wallet",
  "description": "Вызов врача на дом"
}
```

## 🚀 Запуск системы

### Быстрый запуск
```powershell
# Запуск всех сервисов одной командой
.\scripts\start-all.ps1

# Или пошагово:
.\scripts\start-backend.ps1
.\scripts\start-frontend.ps1
```

### Проверка статуса
```powershell
# Backend сервисы
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8005/health

# Frontend приложения
# Patient App: http://localhost:3000
# Admin Panel: http://localhost:3003
```

## 📱 Frontend приложения

### Patient App (порт 3000)
**Функциональность:**
- ✅ Авторизация и регистрация
- ✅ Главная страница с быстрыми действиями
- ✅ Поиск и выбор врача
- ✅ Создание заказа
- ✅ Отслеживание статуса заказа
- ✅ История записей
- ✅ Платежи и кошелек
- ✅ Чат с врачами
- ✅ Экстренные вызовы
- ✅ Профиль пользователя

**Демо аккаунт:**
- Email: `patient@example.com`
- Пароль: `password123`

### Admin Panel (порт 3003)
**Функциональность:**
- ✅ Авторизация администратора
- ✅ Дашборд с общей статистикой
- ✅ Управление пользователями
- ✅ Управление врачами и одобрения
- ✅ Управление клиниками
- ✅ Просмотр всех записей
- ✅ Генерация отчетов
- ✅ Настройки системы

**Демо аккаунт:**
- Email: `admin@tot.ru`
- Пароль: `admin123`

## 📦 Зависимости

### Backend (Python)
- `fastapi==0.104.1` - веб-фреймворк
- `uvicorn[standard]==0.24.0` - ASGI сервер
- `sqlalchemy==2.0.23` - ORM
- `pydantic==2.5.0` - валидация данных
- `PyJWT==2.8.0` - JWT токены
- `passlib[bcrypt]==1.7.4` - хеширование паролей

### Платежные системы
- `yookassa==3.6.0` - ЮKassa SDK
- `qrcode==8.2` - генерация QR-кодов
- `cryptography==45.0.5` - шифрование

### Frontend (Node.js)
- `react==18.2.0` - UI библиотека
- `typescript==5.3.0` - типизация
- `@mui/material==5.15.0` - UI компоненты
- `@mui/icons-material==5.18.0` - иконки
- `axios==1.6.0` - HTTP клиент
- `react-router-dom==6.20.0` - маршрутизация

## 🔧 Конфигурация

### Переменные окружения
```bash
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
SBP_PRIVATE_KEY_PATH=/path/to/private.key

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## 📋 Следующие шаги

### 1. Разработка (В процессе)
- [x] ✅ Backend микросервисы
- [x] ✅ API Gateway
- [x] ✅ User/Profile/Payment сервисы
- [x] ✅ Booking Service
- [x] ✅ Patient App (React)
- [x] ✅ Admin Panel (Material-UI)
- [ ] 🔄 Doctor App (React)
- [ ] 🔄 Clinic Web (React)
- [ ] 🔄 Notification Service
- [ ] 🔄 Chat Service
- [ ] 🔄 Geo Service

### 2. Тестирование (Планируется)
- [ ] Unit тесты для всех сервисов
- [ ] Integration тесты
- [ ] E2E тесты
- [ ] Performance тесты

### 3. Развертывание (Планируется)
- [ ] Настройка PostgreSQL для продакшена
- [ ] Docker контейнеризация
- [ ] CI/CD pipeline
- [ ] Мониторинг и логирование

### 4. Безопасность (Критично)
- [ ] JWT токены с правильной валидацией
- [ ] HTTPS настройка
- [ ] Rate limiting
- [ ] Input validation
- [ ] Audit logging

## 🐛 Известные проблемы

1. **Безопасность**: Хардкод секретов в коде (требует исправления)
2. **Тестирование**: Отсутствуют unit и integration тесты
3. **Типизация**: Частично отсутствует строгая типизация в TypeScript
4. **Мониторинг**: Нет структурированного логирования

## 📞 Поддержка

Для вопросов и проблем обращайтесь к документации:
- `README.md` - общая информация
- `docs/ARCHITECTURE.md` - архитектура системы
- `docs/PROJECT_REVIEW.md` - детальный ревью проекта
- `docs/DEPLOYMENT.md` - инструкции по развертыванию
- `docs/MULTIPLATFORM.md` - мультиплатформенная настройка

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

**Последнее обновление**: 3 августа 2025  
**Версия**: 1.0.0  
**Статус**: MVP - Работающие сервисы с frontend приложениями 