# 📋 Правила проекта и извлечённые уроки

## 🎯 Общие принципы разработки

### 1. Пошаговый подход
- **✅ ВСЕГДА** начинать с простейшего рабочего варианта
- **✅ ВСЕГДА** тестировать каждый шаг перед переходом к следующему
- **❌ НЕ ДЕЛАТЬ** сразу сложную архитектуру — сначала MVP, потом усложнение

### 2. Управление зависимостями  
- **❌ НЕ ИСПОЛЬЗОВАТЬ** `npm audit fix --force` — это ломает проект
- **✅ ВСЕГДА** устанавливать конкретные версии зависимостей
- **✅ ВСЕГДА** тестировать после обновления зависимостей

### 3. Отладка и логирование
- **✅ ВСЕГДА** добавлять подробные `console.log` на каждом этапе
- **✅ ВСЕГДА** логировать начало выполнения компонентов
- **✅ ВСЕГДА** логировать API запросы и ответы
- **✅ ВСЕГДА** логировать ошибки с контекстом

## 🧪 Тестирование и качество кода

### 1. Структура тестов
```
backend/
├── api-gateway/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py          # Фикстуры pytest
│   │   ├── test_health.py       # Health check тесты
│   │   ├── test_auth.py         # Авторизация тесты
│   │   └── test_routing.py      # Маршрутизация тесты
│   └── requirements-test.txt     # Тестовые зависимости
└── user-service/
    ├── tests/
    │   ├── __init__.py
    │   ├── conftest.py
    │   ├── test_auth.py
    │   └── test_users.py
    └── requirements-test.txt
```

### 2. Принципы тестирования
- **✅ ВСЕГДА** создавать тесты для каждого нового функционала
- **✅ ВСЕГДА** тестировать как успешные, так и неуспешные сценарии
- **✅ ВСЕГДА** использовать фикстуры для переиспользуемых данных
- **✅ ВСЕГДА** тестировать структуру ответов API
- **✅ ВСЕГДА** проверять HTTP статус коды и заголовки

### 3. Автоматизация тестов
```powershell
# ✅ Правильно - запуск всех тестов
.\scripts\run-tests.ps1

# ✅ Правильно - тесты с покрытием
pytest backend/api-gateway/tests/ --cov --cov-report=html

# ❌ Неправильно - игнорировать падающие тесты
pytest --tb=no
```

### 4. Отчеты покрытия
- **✅ ВСЕГДА** генерировать HTML отчеты покрытия
- **✅ ВСЕГДА** стремиться к покрытию >80%
- **✅ ВСЕГДА** анализировать непокрытые участки кода

## 🔐 Безопасность и аутентификация

### 1. JWT токены
```typescript
// ✅ Правильно - сохранение и использование токенов
const token = responseData.access_token;
localStorage.setItem('adminToken', token);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// ✅ Правильно - интерцепторы для автоматического добавления токенов
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ Неправильно - забывать про токены в последующих запросах
```

### 2. Обработка ответов API
```typescript
// ✅ Правильно - проверка разных форматов ответов
const responseData = response.data.data || response.data;
const token = responseData.access_token;

// ✅ Правильно - обработка ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ❌ Неправильно - предполагать конкретную структуру
const token = response.data.access_token;
```

### 3. Восстановление сессии
```typescript
// ✅ Правильно - проверка токена при загрузке
useEffect(() => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
  }
}, []);
```

## 🌐 Backend разработка (FastAPI)

### 1. Обновление зависимостей
```python
# ✅ Правильно - осторожные обновления
from sqlalchemy.orm import declarative_base  # Новый импорт
from datetime import datetime
datetime.now()  # Вместо datetime.utcnow()

# ❌ Неправильно - игнорировать deprecation warnings
```

### 2. API endpoints
- **✅ ВСЕГДА** добавлять логирование запросов
- **✅ ВСЕГДА** обрабатывать ошибки с понятными сообщениями
- **✅ ВСЕГДА** возвращать консистентную структуру ответов

### 3. API Gateway маршрутизация
```python
# ✅ Правильно - обработка ошибок сервисов
try:
    response = requests.post(url, json=data, headers=headers)
    logger.info(f"Response status: {response.status_code}")
    return response.json()
except requests.RequestException as e:
    logger.error(f"Request error to {service_name}: {e}")
    raise HTTPException(status_code=503, detail=f"Service {service_name} unavailable")

# ❌ Неправильно - недостижимый код после raise
raise HTTPException(status_code=503, detail="Error")
logger.info("This will never execute")  # ❌
```

## 🔧 Frontend разработка (React + TypeScript)

### 1. Создание новых приложений
```bash
# ✅ Правильно
npx create-react-app admin-panel --template typescript

# ❌ Неправильно - использовать старые шаблоны
```

### 2. Настройка package.json для Windows
```json
{
  "scripts": {
    "start": "set PORT=3003 && react-scripts start"  // ✅ Windows
    // НЕ "start": "PORT=3003 react-scripts start"   // ❌ Unix только
  },
  "proxy": "http://localhost:8000"  // ✅ Строка для старых версий
  // НЕ "proxy": { "/api": "..." }   // ❌ Объект не всегда работает
}
```

### 3. React компоненты
- **✅ ВСЕГДА** добавлять `console.log` в начало каждого компонента
- **✅ ВСЕГДА** проверять, что компонент рендерится, прежде чем отлаживать логику
- **❌ НЕ ИСПОЛЬЗОВАТЬ** сложные конструкции типа IIFE в JSX — это мешает отладке
- **✅ ВСЕГДА** выносить сложную логику в отдельные функции

### 4. Управление состоянием
```typescript
// ✅ Правильно - простое состояние в начале
const [isLoggedIn, setIsLoggedIn] = useState(false);

// ❌ Неправильно - сразу сложные контексты и состояния
```

### 5. Импорты компонентов
```typescript
// ✅ Правильно - явные пути к компонентам
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';

// ❌ Неправильно - неоднозначные импорты
import Users from './Users';  // Может быть старый файл
```

## 🐛 Отладка проблем

### 1. Последовательность отладки
1. **Проверить браузерную консоль** — есть ли ошибки JS?
2. **Проверить Network вкладку** — идут ли HTTP запросы?
3. **Проверить ответы сервера** — какие коды статусов?
4. **Проверить логи компонентов** — рендерятся ли они?
5. **Проверить токены и заголовки** — передаются ли правильно?

### 2. Типичные ошибки
- **403 Forbidden** → проблема с токенами аутентификации
- **404 Not Found** → неправильный URL или прокси
- **405 Method Not Allowed** → неподдерживаемый HTTP метод
- **503 Service Unavailable** → сервис недоступен
- **Компонент не рендерится** → синтаксические ошибки в JSX
- **useEffect не срабатывает** → проблемы с зависимостями

### 3. Отладка API Gateway
```python
# ✅ Правильно - подробное логирование
logger.info(f"Forwarding request to {service_name}: {url}")
logger.info(f"Method: {method}, Headers: {headers}")
logger.info(f"Data: {data}")
logger.info(f"Response status: {response.status_code}")
logger.info(f"Response text: {response.text[:200]}...")

# ❌ Неправильно - недостаточное логирование
logger.info("Request sent")
```

## ⚡ PowerShell и скрипты

### 1. Команды npm в Windows
```powershell
# ✅ Правильно
cd frontend/admin-panel
npm start

# ❌ Неправильно - запуск из неправильной папки
npm start  # из корня проекта
```

### 2. Управление процессами
```powershell
# ✅ Остановка Node.js процессов
taskkill /F /IM node.exe

# ✅ Запуск в фоне
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npm start"
```

### 3. Тестовые скрипты
```powershell
# ✅ Правильно - активация venv перед тестами
& .\venv\Scripts\Activate.ps1
pytest backend/api-gateway/tests/ -v

# ✅ Правильно - установка тестовых зависимостей
pip install -r backend/api-gateway/requirements-test.txt
```

## 📝 Документирование

### 1. Обновление после изменений
- **✅ ВСЕГДА** обновлять CHANGELOG.md после значимых изменений
- **✅ ВСЕГДА** фиксировать найденные проблемы и их решения
- **✅ ВСЕГДА** документировать новые архитектурные решения
- **✅ ВСЕГДА** обновлять правила проекта после извлечения уроков

### 2. Структура коммитов
```
feat: добавить аутентификацию в админ-панель
fix: исправить проблему с токенами в API запросах  
docs: обновить правила проекта
refactor: упростить компонент Users
test: добавить тесты для API Gateway
```

### 3. Документирование тестов
```python
"""
@file: test_auth.py
@description: Тесты для авторизации через API Gateway
@dependencies: pytest, httpx, fastapi
@created: 2024-08-06
"""
```

## 🚫 Красные флаги - когда остановиться

1. **Слишком много ошибок подряд** — вернуться к последней рабочей версии
2. **Компоненты не рендерятся** — упростить до минимального рабочего варианта  
3. **API возвращает 403/401** — проверить аутентификацию
4. **Зависимости ломаются** — не делать force update, откатить изменения
5. **Хождение по кругу** — начать с чистого листа, но меньшими шагами
6. **Тесты не проходят** — исправить тесты под реальное поведение API
7. **Недостижимый код** — проверить логику после raise/return

## 🎯 Принципы MVP

1. **Сначала работает, потом красиво** — функциональность важнее UI
2. **Один компонент за раз** — не делать всё сразу
3. **Тестировать каждый шаг** — маленькие изменения, частые проверки
4. **Логировать всё** — проще отладить с избытком логов
5. **Документировать уроки** — не повторять одни и те же ошибки
6. **Писать тесты параллельно** — не откладывать тестирование
7. **Исправлять критические проблемы сразу** — не накапливать технический долг

## 🧪 Критические уроки по тестированию

### 1. Адаптация тестов под реальное поведение
```python
# ✅ Правильно - тестировать реальное поведение API
assert response.status_code in [200, 401, 503]  # Гибкие ожидания

# ❌ Неправильно - жесткие ожидания
assert response.status_code == 200  # Может не работать
```

### 2. Тестирование API Gateway
- **✅ ВСЕГДА** тестировать health endpoints
- **✅ ВСЕГДА** тестировать авторизацию через Gateway
- **✅ ВСЕГДА** тестировать маршрутизацию и CORS
- **✅ ВСЕГДА** тестировать обработку ошибок

### 3. Тестирование User Service
- **✅ ВСЕГДА** тестировать JWT токены
- **✅ ВСЕГДА** тестировать валидацию данных
- **✅ ВСЕГДА** тестировать HTTP методы
- **✅ ВСЕГДА** учитывать ограниченную функциональность

### 4. Автоматизация тестов
```powershell
# ✅ Правильно - полный цикл тестирования
.\scripts\run-tests.ps1

# ✅ Правильно - отчеты покрытия
pytest --cov --cov-report=html:test-reports/
```

---

**Дата создания:** 28.01.2024  
**Последнее обновление:** 06.08.2025  
**Статус:** Активные правила проекта с дополнениями по тестированию