# Настройка переменных окружения

## 📋 Обзор

Проект ТОТ использует переменные окружения для конфигурации различных сервисов. Все переменные хранятся в файле `.env` в корневой папке проекта.

## 🚀 Быстрый старт

### 1. Создание .env файла

```powershell
# Создать шаблон .env файла
.\scripts\manage-env.ps1 -Action create
```

### 2. Просмотр текущих настроек

```powershell
# Показать все переменные
.\scripts\manage-env.ps1 -Action show
```

### 3. Изменение переменных

```powershell
# Установить переменную
.\scripts\manage-env.ps1 -Action set -Key DATABASE_URL -Value "sqlite:///./tot_mvp.db"

# Установить JWT секрет
.\scripts\manage-env.ps1 -Action set -Key JWT_SECRET -Value "your-secret-key"
```

### 4. Тестирование переменных

```powershell
# Проверить загрузку переменных
.\scripts\manage-env.ps1 -Action test
```

## 🔧 Основные переменные

### База данных
```env
# SQLite для локальной разработки
DATABASE_URL=sqlite:///./tot_mvp.db

# PostgreSQL для продакшена
# DATABASE_URL=postgresql://user:password@localhost:5432/tot_mvp
```

### JWT Аутентификация
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

### CORS настройки
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
```

### Платежные системы

#### ЮKassa
```env
YUKASSA_SHOP_ID=your-yookassa-shop-id
YUKASSA_SECRET_KEY=your-yookassa-secret-key
```

#### СБП (Система быстрых платежей)
```env
SBP_MERCHANT_ID=your-sbp-merchant-id
SBP_PRIVATE_KEY_PATH=/path/to/sbp/private/key.pem
```

### Уведомления
```env
# Twilio для SMS
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Firebase для push-уведомлений
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
```

### Геолокация
```env
GEOCODING_API_KEY=your-geocoding-api-key
```

### Мониторинг
```env
PROMETHEUS_PORT=9090
GRAFANA_PORT=3004
```

### Логирование
```env
LOG_LEVEL=INFO
```

### Режим разработки
```env
DEBUG=true
ENVIRONMENT=development
```

## 🛠️ Управление через скрипты

### Просмотр переменных
```powershell
.\scripts\manage-env.ps1 -Action show
```

### Установка переменной
```powershell
.\scripts\manage-env.ps1 -Action set -Key KEY -Value VALUE
```

### Тестирование
```powershell
.\scripts\manage-env.ps1 -Action test
```

### Создание шаблона
```powershell
.\scripts\manage-env.ps1 -Action create
```

## 🔒 Безопасность

### Важные правила:
1. **Никогда не коммитьте .env файл** в репозиторий
2. **Используйте разные секреты** для разработки и продакшена
3. **Регулярно меняйте JWT_SECRET** в продакшене
4. **Храните секреты** в безопасном месте

### .gitignore
Файл `.env` уже добавлен в `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production
```

## 🚨 Устранение проблем

### Проблема: Переменные не загружаются
```powershell
# Проверьте, что файл .env существует
Test-Path .env

# Проверьте загрузку переменных
.\scripts\manage-env.ps1 -Action test
```

### Проблема: Неправильная база данных
```powershell
# Установите правильный DATABASE_URL
.\scripts\manage-env.ps1 -Action set -Key DATABASE_URL -Value "sqlite:///./tot_mvp.db"
```

### Проблема: Ошибки JWT
```powershell
# Установите JWT_SECRET
.\scripts\manage-env.ps1 -Action set -Key JWT_SECRET -Value "your-secret-key"
```

## 📚 Дополнительные ресурсы

- [Документация python-dotenv](https://github.com/theskumar/python-dotenv)
- [FastAPI Environment Variables](https://fastapi.tiangolo.com/advanced/settings/)
- [SQLAlchemy Database URLs](https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls) 