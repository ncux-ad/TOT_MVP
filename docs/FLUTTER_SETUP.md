# Flutter Mobile App Setup

## Архитектура проекта ТОТ

### Веб-приложения (React)
- **Admin Panel** (`frontend/admin-panel/`) - Админ-панель для управления системой
- **Patient App** (`frontend/patient-app/`) - Веб-приложение для пациентов

### Мобильное приложение (Flutter)
- **Mobile App** (`mobile-app/`) - Кроссплатформенное мобильное приложение

## Установка Flutter

### Windows
1. Скачайте Flutter SDK: https://docs.flutter.dev/get-started/install/windows
2. Распакуйте в `C:\flutter`
3. Добавьте `C:\flutter\bin` в PATH
4. Выполните: `flutter doctor`

### macOS
```bash
brew install flutter
```

### Linux
```bash
sudo snap install flutter --classic
```

## Создание Flutter приложения

```bash
cd mobile-app
flutter create tot_mobile_app --org com.tot.mvp
cd tot_mobile_app
```

## Структура Flutter приложения

```
mobile-app/tot_mobile_app/
├── lib/
│   ├── main.dart                 # Точка входа
│   ├── app.dart                  # Главное приложение
│   ├── config/
│   │   ├── api_config.dart       # Конфигурация API
│   │   └── theme.dart           # Тема приложения
│   ├── models/
│   │   ├── user.dart            # Модель пользователя
│   │   ├── doctor.dart          # Модель врача
│   │   ├── clinic.dart          # Модель клиники
│   │   └── appointment.dart     # Модель записи
│   ├── services/
│   │   ├── api_service.dart     # API сервис
│   │   ├── auth_service.dart    # Аутентификация
│   │   └── storage_service.dart # Локальное хранение
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── login_screen.dart
│   │   │   └── register_screen.dart
│   │   ├── patient/
│   │   │   ├── home_screen.dart
│   │   │   ├── doctors_screen.dart
│   │   │   ├── appointments_screen.dart
│   │   │   └── profile_screen.dart
│   │   └── doctor/
│   │       ├── dashboard_screen.dart
│   │       ├── patients_screen.dart
│   │       └── schedule_screen.dart
│   ├── widgets/
│   │   ├── common/
│   │   │   ├── loading_widget.dart
│   │   │   └── error_widget.dart
│   │   └── custom/
│   │       ├── doctor_card.dart
│   │       └── appointment_card.dart
│   └── utils/
│       ├── constants.dart
│       └── helpers.dart
├── assets/
│   ├── images/
│   └── icons/
└── pubspec.yaml
```

## Основные зависимости

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0              # HTTP запросы
  provider: ^6.1.1          # State management
  shared_preferences: ^2.2.2 # Локальное хранение
  dio: ^5.3.2               # HTTP клиент
  json_annotation: ^4.8.1   # JSON сериализация
  flutter_secure_storage: ^9.0.0 # Безопасное хранение
  geolocator: ^10.1.0       # Геолокация
  image_picker: ^1.0.4      # Выбор изображений
  cached_network_image: ^3.3.0 # Кэширование изображений
```

## Интеграция с Backend

### API Endpoints
- **Base URL**: `http://localhost:8000` (для разработки)
- **Auth**: `/auth/login`, `/auth/register`
- **Users**: `/auth/me`
- **Doctors**: `/api/doctors`
- **Clinics**: `/api/clinics`
- **Appointments**: `/api/appointments`

### Аутентификация
- JWT токены
- Автоматическое обновление токенов
- Безопасное хранение в `flutter_secure_storage`

## План разработки

### Этап 1: Базовая структура
- [ ] Установка Flutter
- [ ] Создание проекта
- [ ] Настройка зависимостей
- [ ] Базовая навигация

### Этап 2: Аутентификация
- [ ] Экран входа
- [ ] Экран регистрации
- [ ] Интеграция с API
- [ ] Управление токенами

### Этап 3: Основной функционал
- [ ] Главный экран
- [ ] Список врачей
- [ ] Список клиник
- [ ] Запись на прием

### Этап 4: Дополнительные функции
- [ ] Профиль пользователя
- [ ] История записей
- [ ] Уведомления
- [ ] Геолокация

## Команды для разработки

```bash
# Запуск в режиме разработки
flutter run

# Сборка для Android
flutter build apk

# Сборка для iOS
flutter build ios

# Анализ кода
flutter analyze

# Тесты
flutter test
```

## Отладка

### Android Studio / VS Code
- Установите Flutter и Dart плагины
- Настройте эмулятор Android
- Настройте симулятор iOS (macOS)

### Логирование
```dart
import 'package:flutter/foundation.dart';

debugPrint('Debug message');
if (kDebugMode) {
  print('Debug only message');
}
```

## Безопасность

- Используйте `flutter_secure_storage` для токенов
- Валидируйте все пользовательские данные
- Используйте HTTPS в продакшене
- Не храните чувствительные данные в коде

## Производительность

- Используйте `const` конструкторы где возможно
- Кэшируйте изображения
- Оптимизируйте размер приложения
- Используйте `ListView.builder` для больших списков 