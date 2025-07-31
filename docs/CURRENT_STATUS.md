# 🚀 Текущий статус проекта ТОТ MVP

## 📊 Обзор проекта

**ТОТ - Твоя Точка Опоры** - это микросервисная система для вызова врачей на дом с интеграцией российских платежных систем.

### ✅ Работающие сервисы

| Сервис | Порт | Статус | Описание |
|--------|------|--------|----------|
| **API Gateway** | 8000 | ✅ Работает | Единая точка входа для всех API |
| **User Service** | 8001 | ✅ Работает | Управление пользователями и аутентификация |
| **Profile Service** | 8002 | ✅ Работает | Профили пациентов, врачей и клиник |
| **Payment Service** | 8005 | ✅ Работает | Платежи через ЮKassa и СБП |

### 🔧 Технические изменения

#### База данных
- **Переход на SQLite**: Все сервисы теперь используют SQLite для быстрого тестирования
- **Переменная окружения**: `DATABASE_URL=sqlite:///./tot_mvp.db`
- **Файл БД**: `tot_mvp.db` создается автоматически

#### Платежные системы
- **ЮKassa**: Интеграция с российским платежным провайдером
- **СБП**: Система Быстрых Платежей с QR-кодами
- **Кошелек**: Внутренняя система балансов

#### Исправления в коде
- **Payment Service**: Исправлен конфликт с зарезервированным словом `metadata` → `payment_metadata`
- **SQLAlchemy**: Добавлены `pyright: ignore` комментарии для совместимости
- **CORS**: Настроен для всех сервисов

## 🌐 Доступные эндпоинты

### API Gateway (порт 8000)
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **OpenAPI**: http://localhost:8000/openapi.json

### User Service (порт 8001)
- **Health Check**: http://localhost:8001/health
- **Регистрация**: POST /users/register
- **Авторизация**: POST /users/login
- **Профиль**: GET /users/{user_id}

### Profile Service (порт 8002)
- **Health Check**: http://localhost:8002/health
- **Профили пациентов**: /profiles/
- **Профили врачей**: /doctor-profiles/
- **Профили клиник**: /clinic-profiles/

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
# Установка переменной окружения
$env:DATABASE_URL="sqlite:///./tot_mvp.db"

# Запуск сервисов
python backend/api-gateway/main.py &
python backend/user-service/main.py &
python backend/profile-service/main.py &
python backend/payment-service/main.py &
```

### Проверка статуса
```powershell
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8005/health
```

## 📦 Зависимости

### Основные пакеты
- `fastapi==0.104.1` - веб-фреймворк
- `uvicorn[standard]==0.24.0` - ASGI сервер
- `sqlalchemy==2.0.23` - ORM
- `pydantic==2.5.0` - валидация данных

### Платежные системы
- `yookassa==3.6.0` - ЮKassa SDK
- `qrcode==8.2` - генерация QR-кодов
- `cryptography==45.0.5` - шифрование

### Дополнительные
- `redis==5.0.1` - кэширование
- `httpx==0.25.2` - HTTP клиент
- `PyJWT==2.8.0` - JWT токены

## 🔧 Конфигурация

### Переменные окружения
```bash
# База данных
DATABASE_URL=sqlite:///./tot_mvp.db

# ЮKassa
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key

# СБП
SBP_MERCHANT_ID=your_merchant_id
SBP_PRIVATE_KEY_PATH=/path/to/private.key
```

## 📋 Следующие шаги

### 1. Разработка
- [ ] Интеграция с Booking Service
- [ ] Добавление Notification Service
- [ ] Реализация Chat Service
- [ ] Настройка Geo Service

### 2. Тестирование
- [ ] Unit тесты для всех сервисов
- [ ] Integration тесты
- [ ] E2E тесты

### 3. Развертывание
- [ ] Настройка PostgreSQL для продакшена
- [ ] Docker контейнеризация
- [ ] CI/CD pipeline
- [ ] Мониторинг и логирование

### 4. Безопасность
- [ ] JWT токены с правильной валидацией
- [ ] HTTPS настройка
- [ ] Rate limiting
- [ ] Input validation

## 🐛 Известные проблемы

1. **WSL2**: Проблемы с прокси в Ubuntu WSL
2. **PostgreSQL**: Требует установки для продакшена
3. **Docker**: Не установлен в текущей среде
4. **Frontend**: Пока не реализован

## 📞 Поддержка

Для вопросов и проблем обращайтесь к документации:
- `README.md` - общая информация
- `docs/ARCHITECTURE.md` - архитектура системы
- `docs/DEPLOYMENT.md` - инструкции по развертыванию
- `docs/MULTIPLATFORM.md` - мультиплатформенная настройка

---

**Последнее обновление**: 31 июля 2025
**Версия**: 1.0.0
**Статус**: MVP - Работающие сервисы 