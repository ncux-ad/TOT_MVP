# 🚀 Скрипты управления сервисами ТОТ

## 📋 Обзор

Созданы удобные PowerShell скрипты для управления всеми сервисами проекта ТОТ.

## 🛠️ Доступные скрипты

### 1. **start-all.ps1** - Запуск всех сервисов
```powershell
.\scripts\start-all.ps1
```
**Что делает:**
- ✅ Проверяет статус всех сервисов
- ✅ Запускает Backend сервисы (API Gateway, User, Profile, Payment)
- ✅ Запускает Frontend приложение (React)
- ✅ Проверяет успешность запуска
- ✅ Показывает все доступные URL

### 2. **stop-all.ps1** - Остановка всех сервисов
```powershell
.\scripts\stop-all.ps1
```
**Что делает:**
- 🛑 Останавливает все Backend сервисы
- 🛑 Останавливает Frontend приложение
- 🔍 Проверяет статус остановки
- 📊 Показывает результат

### 3. **start-backend.ps1** - Запуск только Backend
```powershell
.\scripts\start-backend.ps1
```
**Что делает:**
- ✅ Активирует виртуальное окружение Python
- ✅ Проверяет зависимости
- ✅ Запускает все Backend сервисы
- ✅ Проверяет health endpoints
- 📚 Показывает Swagger документацию

### 4. **stop-backend.ps1** - Остановка только Backend
```powershell
.\scripts\stop-backend.ps1
```
**Что делает:**
- 🛑 Находит процессы на портах 8000, 8001, 8002, 8005
- 🛑 Завершает процессы
- 📊 Показывает результат остановки

### 5. **start-frontend.ps1** - Запуск только Frontend
```powershell
.\scripts\start-frontend.ps1
```
**Что делает:**
- ✅ Проверяет Node.js и npm
- ✅ Устанавливает зависимости (если нужно)
- ✅ Запускает React приложение
- 🌐 Показывает доступные URL

### 6. **install-nodejs.ps1** - Установка Node.js
```powershell
.\scripts\install-nodejs.ps1
```
**Что делает:**
- 📦 Устанавливает Chocolatey (если нужно)
- 📦 Устанавливает Node.js и npm
- ✅ Проверяет установку
- 💡 Показывает следующие шаги

### 7. **setup-firewall.ps1** - Настройка брандмауэра
```powershell
.\scripts\setup-firewall.ps1
```
**Что делает:**
- 🔥 Добавляет правила для портов 8000, 8001, 8002, 8005, 3000
- 🌐 Разрешает доступ из локальной сети
- ⚠️ Требует права администратора

## 🚀 Быстрый старт

### Полный запуск системы:
```powershell
# 1. Перейдите в корневую папку проекта
cd D:\OneDrive\Projects\TOT_MVP

# 2. Запустите все сервисы
.\scripts\start-all.ps1
```

### Пошаговый запуск:
```powershell
# 1. Запуск Backend
.\scripts\start-backend.ps1

# 2. Запуск Frontend
.\scripts\start-frontend.ps1
```

### Остановка системы:
```powershell
# Остановка всех сервисов
.\scripts\stop-all.ps1
```

## 🌐 Доступные URL после запуска

### Backend сервисы:
- **API Gateway:** http://localhost:8000
- **User Service:** http://localhost:8001
- **Profile Service:** http://localhost:8002
- **Payment Service:** http://localhost:8005

### Frontend приложение:
- **React App:** http://localhost:3000

### Документация:
- **Swagger UI:** http://localhost:8000/docs

### Сетевой доступ:
- **API Gateway:** http://192.168.1.107:8000
- **React App:** http://192.168.1.107:3000

## 📱 Демо аккаунты

### Patient App:
- **Email:** patient@example.com
- **Пароль:** password123

## 🔧 Требования

### Для Backend:
- ✅ Python 3.8+
- ✅ Виртуальное окружение (venv)
- ✅ Зависимости из requirements.txt

### Для Frontend:
- ✅ Node.js 18+
- ✅ npm

### Для сетевого доступа:
- ✅ Права администратора для настройки брандмауэра

## 🐛 Устранение проблем

### Ошибка "Python не найден"
```powershell
# Активируйте виртуальное окружение
venv\Scripts\Activate.ps1
```

### Ошибка "Node.js не найден"
```powershell
# Установите Node.js
.\scripts\install-nodejs.ps1
```

### Ошибка "Порт занят"
```powershell
# Остановите все сервисы
.\scripts\stop-all.ps1

# Затем запустите заново
.\scripts\start-all.ps1
```

### Ошибка "Нет доступа из сети"
```powershell
# Настройте брандмауэр (требует права администратора)
.\scripts\setup-firewall.ps1
```

### Ошибка "Зависимости не установлены"
```powershell
# Установите Python зависимости
pip install -r requirements.txt

# Установите Node.js зависимости
cd frontend\patient-app
npm install
```

## 📊 Мониторинг

### Проверка статуса сервисов:
```powershell
# Проверка портов
netstat -ano | findstr ":800"
netstat -ano | findstr ":3000"

# Проверка процессов
Get-Process | Where-Object {$_.ProcessName -like "*python*"}
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

### Логи сервисов:
- **Backend логи:** Выводятся в консоль при запуске
- **Frontend логи:** В браузере (F12 → Console)

## 💡 Полезные команды

### Проверка здоровья сервисов:
```powershell
# API Gateway
Invoke-WebRequest -Uri "http://localhost:8000/health"

# User Service
Invoke-WebRequest -Uri "http://localhost:8001/health"

# Profile Service
Invoke-WebRequest -Uri "http://localhost:8002/health"

# Payment Service
Invoke-WebRequest -Uri "http://localhost:8005/health"
```

### Открытие в браузере:
```powershell
# React приложение
Start-Process "http://localhost:3000"

# Swagger документация
Start-Process "http://localhost:8000/docs"
```

## 🔄 Автоматизация

### Создание ярлыков:
1. **Создайте ярлык для запуска:**
   - Цель: `powershell.exe -NoExit -Command "cd 'D:\OneDrive\Projects\TOT_MVP'; .\scripts\start-all.ps1"`
   - Название: "Запуск ТОТ"

2. **Создайте ярлык для остановки:**
   - Цель: `powershell.exe -NoExit -Command "cd 'D:\OneDrive\Projects\TOT_MVP'; .\scripts\stop-all.ps1"`
   - Название: "Остановка ТОТ"

### Добавление в PATH:
```powershell
# Добавьте папку scripts в PATH для быстрого доступа
$env:PATH += ";D:\OneDrive\Projects\TOT_MVP\scripts"
```

---

**🎉 Теперь управление сервисами ТОТ стало максимально простым!**

Используйте `.\scripts\start-all.ps1` для быстрого запуска всей системы! 