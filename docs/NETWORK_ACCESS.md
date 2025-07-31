# 🌐 Доступ к TOT API из локальной сети

## 📋 Обзор

Данный документ описывает, как настроить доступ к API системы ТОТ из локальной сети для разработки и тестирования.

## 🔧 Текущая конфигурация

### IP адрес сервера
- **IP адрес**: `192.168.1.107`
- **Сеть**: `192.168.1.0/24`
- **Шлюз**: `192.168.1.100`

### Порт сервисов
| Сервис | Порт | URL |
|--------|------|-----|
| API Gateway | 8000 | `http://192.168.1.107:8000` |
| User Service | 8001 | `http://192.168.1.107:8001` |
| Profile Service | 8002 | `http://192.168.1.107:8002` |
| Payment Service | 8005 | `http://192.168.1.107:8005` |

## 🚀 Быстрый старт

### 1. Проверка доступности
```bash
# API Gateway
curl http://192.168.1.107:8000/health

# User Service
curl http://192.168.1.107:8001/health

# Profile Service
curl http://192.168.1.107:8002/health

# Payment Service
curl http://192.168.1.107:8005/health
```

### 2. Тестирование API
```bash
# Регистрация пользователя
curl -X POST http://192.168.1.107:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Иван",
    "last_name": "Иванов",
    "role": "patient"
  }'

# Создание платежа
curl -X POST http://192.168.1.107:8000/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 1000.0,
    "currency": "RUB",
    "payment_method": "yookassa",
    "description": "Консультация врача"
  }'
```

## 🔒 Безопасность

### Настройки CORS
API Gateway настроен для работы с следующими доменами:
- `http://localhost:3000` (Patient App)
- `http://localhost:3001` (Doctor App)
- `http://localhost:3002` (Clinic Web)
- `http://localhost:3003` (Admin Panel)

### Trusted Hosts
В продакшене необходимо указать конкретные хосты вместо `"*"`.

## 🌍 Доступ из других устройств

### В той же сети
Любое устройство в сети `192.168.1.0/24` может получить доступ к API:

```bash
# С мобильного устройства
curl http://192.168.1.107:8000/health

# С другого компьютера
curl http://192.168.1.107:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123","first_name":"Test","last_name":"User"}'
```

### Через браузер
Откройте в браузере:
- `http://192.168.1.107:8000/docs` - Swagger документация API Gateway
- `http://192.168.1.107:8001/docs` - Swagger документация User Service
- `http://192.168.1.107:8002/docs` - Swagger документация Profile Service
- `http://192.168.1.107:8005/docs` - Swagger документация Payment Service

## 🔧 Настройка сервисов

### Переменные окружения
```bash
# Для API Gateway
$env:API_GATEWAY_HOST="0.0.0.0"
$env:API_GATEWAY_PORT="8000"

# Для всех сервисов
$env:DATABASE_URL="sqlite:///./tot_mvp.db"
```

### Запуск сервисов
```powershell
# API Gateway
$env:DATABASE_URL="sqlite:///./tot_mvp.db"; $env:API_GATEWAY_HOST="0.0.0.0"; python backend/api-gateway/main.py

# User Service
$env:DATABASE_URL="sqlite:///./tot_mvp.db"; python backend/user-service/main.py

# Profile Service
$env:DATABASE_URL="sqlite:///./tot_mvp.db"; python backend/profile-service/main.py

# Payment Service
$env:DATABASE_URL="sqlite:///./tot_mvp.db"; python backend/payment-service/main.py
```

## 🛠️ Устранение неполадок

### Проблема: Сервис недоступен с других устройств

#### Решение 1: Настройка брандмауэра Windows
```powershell
# Запустите PowerShell от имени администратора
.\scripts\setup-firewall.ps1
```

#### Решение 2: Временное отключение брандмауэра
```powershell
# В PowerShell от имени администратора
netsh advfirewall set allprofiles state off
```

#### Решение 3: Ручная настройка
1. Откройте "Брандмауэр Защитника Windows"
2. Выберите "Дополнительные параметры"
3. Создайте правила для портов 8000, 8001, 8002, 8005

### Диагностика проблем
```bash
# Проверьте, что сервис запущен
Get-Process python

# Проверьте порт
netstat -an | findstr :8000

# Проверьте IP адрес
ipconfig

# Проверьте доступность с другого устройства
ping 192.168.1.107
```

### Проблема: Ошибка подключения
1. Убедитесь, что IP адрес правильный: `ipconfig`
2. Проверьте, что устройства в одной сети
3. Настройте брандмауэр Windows
4. Проверьте, что сервисы запущены с `host="0.0.0.0"`

### Проблема: CORS ошибки
Добавьте домен в настройки CORS в `backend/api-gateway/main.py`:
```python
allow_origins=os.getenv("CORS_ORIGINS", "http://192.168.1.107:3000,http://localhost:3000").split(",")
```

## 📱 Мобильное тестирование

### Android
```bash
# Установите Termux и выполните:
curl http://192.168.1.107:8000/health
```

### iOS
```bash
# Используйте любой HTTP клиент
GET http://192.168.1.107:8000/health
```

## 🔄 Обновление IP адреса

Если IP адрес изменился:

1. Узнайте новый IP:
```bash
ipconfig
```

2. Обновите документацию
3. Перезапустите сервисы
4. Обновите настройки клиентов

## 📊 Мониторинг

### Проверка статуса всех сервисов
```bash
$services = @(8000, 8001, 8002, 8005)
foreach ($port in $services) {
    $response = curl http://192.168.1.107:$port/health -ErrorAction SilentlyContinue
    Write-Host "Port $port`: $response"
}
```

### Логи сервисов
Логи выводятся в консоль. Для продакшена рекомендуется настроить файловое логирование.

## 🚀 Следующие шаги

1. **Настройка HTTPS** - для безопасного доступа
2. **Настройка аутентификации** - для защиты API
3. **Настройка мониторинга** - для отслеживания состояния
4. **Настройка CI/CD** - для автоматического развертывания
5. **Настройка Docker** - для контейнеризации

---

**Примечание**: Данная конфигурация предназначена для разработки и тестирования. Для продакшена необходимо настроить дополнительные меры безопасности. 