# 🎨 Установка и запуск Frontend приложений

## 📋 Требования

- **Node.js** (версия 18 или выше)
- **npm** (обычно устанавливается вместе с Node.js)
- **Backend сервисы** должны быть запущены

## 🔧 Установка Node.js

### Способ 1: Автоматическая установка (рекомендуется)

1. **Запустите PowerShell от имени администратора**
2. **Выполните скрипт установки:**
   ```powershell
   .\scripts\install-nodejs.ps1
   ```

### Способ 2: Ручная установка

1. **Перейдите на https://nodejs.org/**
2. **Скачайте LTS версию** (рекомендуется)
3. **Запустите установщик** и следуйте инструкциям
4. **Перезапустите PowerShell**

### Проверка установки

```powershell
node --version
npm --version
```

## 🚀 Запуск Patient App

### 1. Установка зависимостей

```powershell
cd frontend/patient-app
npm install
```

### 2. Запуск приложения

```powershell
npm start
```

Приложение откроется в браузере по адресу: **http://localhost:3000**

## 🌐 Доступ из сети

Для доступа с других устройств в локальной сети:

1. **Найдите IP адрес сервера:**
   ```powershell
   ipconfig
   ```

2. **Откройте в браузере:**
   ```
   http://[IP-АДРЕС]:3000
   ```
   
   Например: `http://192.168.1.107:3000`

## 📱 Демо аккаунты

### Patient App
- **Email:** patient@example.com
- **Пароль:** password123

### Doctor App (будущее)
- **Email:** doctor@example.com
- **Пароль:** password123

## 🛠️ Структура Frontend

```
frontend/
├── patient-app/          # Приложение для пациентов
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── contexts/     # React контексты
│   │   ├── pages/        # Страницы приложения
│   │   ├── services/     # API сервисы
│   │   └── styles/       # CSS стили
│   └── package.json
├── doctor-app/           # Приложение для врачей (будущее)
├── clinic-web/           # Веб-сайт клиники (будущее)
└── admin-panel/          # Админ панель (будущее)
```

## 🎨 Технологии

- **React 18** - основная библиотека
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **React Router** - маршрутизация
- **React Query** - управление состоянием
- **React Hook Form** - формы
- **Lucide React** - иконки
- **Axios** - HTTP клиент

## 🔧 Конфигурация

### API Endpoints

В файле `frontend/patient-app/src/services/api.ts` настроены следующие endpoints:

- **API Gateway:** http://192.168.1.107:8000
- **User Service:** http://192.168.1.107:8001
- **Profile Service:** http://192.168.1.107:8002
- **Payment Service:** http://192.168.1.107:8005

### Proxy настройки

В `package.json` настроен proxy для разработки:
```json
{
  "proxy": "http://192.168.1.107:8000"
}
```

## 🐛 Устранение проблем

### Ошибка "npm не найден"
1. Убедитесь, что Node.js установлен
2. Перезапустите PowerShell
3. Проверьте переменную PATH

### Ошибка "Cannot find module"
1. Удалите папку `node_modules`
2. Удалите файл `package-lock.json`
3. Выполните `npm install` заново

### Ошибка подключения к API
1. Убедитесь, что backend сервисы запущены
2. Проверьте IP адрес в настройках
3. Проверьте брандмауэр Windows

### Ошибка порта занят
1. Найдите процесс на порту 3000:
   ```powershell
   netstat -ano | findstr :3000
   ```
2. Завершите процесс или измените порт

## 📝 Команды разработки

```powershell
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Запуск тестов
npm test

# Проверка линтером
npm run lint
```

## 🔄 Обновление зависимостей

```powershell
# Обновление всех пакетов
npm update

# Обновление конкретного пакета
npm update react

# Проверка устаревших пакетов
npm outdated
```

## 📚 Дополнительные ресурсы

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query) 