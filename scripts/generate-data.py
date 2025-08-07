#!/usr/bin/env python3
"""
Скрипт для генерации тестовых данных в базу данных ТОТ
"""

import sqlite3
import uuid
import random
from datetime import datetime, timedelta
import hashlib
import os
from typing import List, Dict

# Настройки
DATABASE_PATH = "./tot_mvp.db"
JWT_SECRET = "your-super-secret-jwt-key"

def hash_password(password: str) -> str:
    """Хэширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_users() -> List[Dict]:
    """Генерация пользователей"""
    users = []
    
    # Админы
    users.append({
        'id': 1,
        'email': 'admin@tot.ru',
        'phone': '+7 (495) 123-45-67',
        'password_hash': hash_password('admin123'),
        'first_name': 'Администратор',
        'last_name': 'Системы',
        'role': 'admin',
        'is_active': True,
        'is_verified': True,
        'created_at': datetime.now(),
        'updated_at': datetime.now()
    })
    
    # Пациенты
    patients = [
        {'first_name': 'Иван', 'last_name': 'Иванов', 'email': 'ivan@example.com'},
        {'first_name': 'Мария', 'last_name': 'Петрова', 'email': 'maria@example.com'},
        {'first_name': 'Алексей', 'last_name': 'Сидоров', 'email': 'alex@example.com'},
        {'first_name': 'Елена', 'last_name': 'Козлова', 'email': 'elena@example.com'},
        {'first_name': 'Дмитрий', 'last_name': 'Волков', 'email': 'dmitry@example.com'},
        {'first_name': 'Анна', 'last_name': 'Морозова', 'email': 'anna@example.com'},
        {'first_name': 'Сергей', 'last_name': 'Новиков', 'email': 'sergey@example.com'},
        {'first_name': 'Ольга', 'last_name': 'Лебедева', 'email': 'olga@example.com'},
        {'first_name': 'Павел', 'last_name': 'Соколов', 'email': 'pavel@example.com'},
        {'first_name': 'Наталья', 'last_name': 'Кузнецова', 'email': 'natalia@example.com'}
    ]
    
    for i, patient in enumerate(patients):
        users.append({
            'id': i + 2,  # Начинаем с 2, так как 1 - админ
            'email': patient['email'],
            'phone': f'+7 (495) {100 + i:03d}-{10 + i:02d}-{20 + i:02d}',
            'password_hash': hash_password('password123'),
            'first_name': patient['first_name'],
            'last_name': patient['last_name'],
            'role': 'patient',
            'is_active': True,
            'is_verified': True,
            'created_at': datetime.now() - timedelta(days=random.randint(1, 30)),
            'updated_at': datetime.now()
        })
    
    # Врачи
    doctors = [
        {'first_name': 'Петр', 'last_name': 'Петров', 'specialization': 'Терапевт', 'experience': 15},
        {'first_name': 'Анна', 'last_name': 'Козлова', 'specialization': 'Кардиолог', 'experience': 12},
        {'first_name': 'Сергей', 'last_name': 'Иванов', 'specialization': 'Хирург', 'experience': 20},
        {'first_name': 'Елена', 'last_name': 'Смирнова', 'specialization': 'Педиатр', 'experience': 8},
        {'first_name': 'Михаил', 'last_name': 'Попов', 'specialization': 'Невролог', 'experience': 18},
        {'first_name': 'Татьяна', 'last_name': 'Васильева', 'specialization': 'Офтальмолог', 'experience': 10},
        {'first_name': 'Андрей', 'last_name': 'Соколов', 'specialization': 'Ортопед', 'experience': 14},
        {'first_name': 'Ирина', 'last_name': 'Лебедева', 'specialization': 'Гинеколог', 'experience': 16}
    ]
    
    for i, doctor in enumerate(doctors):
        users.append({
            'id': i + 12,  # Начинаем с 12 (после пациентов)
            'email': f'doctor{i+1}@tot.ru',
            'phone': f'+7 (495) {200 + i:03d}-{20 + i:02d}-{30 + i:02d}',
            'password_hash': hash_password('doctor123'),
            'first_name': doctor['first_name'],
            'last_name': doctor['last_name'],
            'role': 'doctor',
            'specialization': doctor['specialization'],
            'license_number': f'MD{1000 + i:04d}',
            'experience_years': doctor['experience'],
            'is_active': True,
            'is_verified': True,
            'created_at': datetime.now() - timedelta(days=random.randint(1, 60)),
            'updated_at': datetime.now()
        })
    
    # Клиники
    clinics = [
        {'first_name': 'Медицинский', 'last_name': 'Центр "Здоровье"', 'clinic_name': 'Медицинский центр "Здоровье"'},
        {'first_name': 'Клиника', 'last_name': '"Добрый доктор"', 'clinic_name': 'Клиника "Добрый доктор"'},
        {'first_name': 'Семейная', 'last_name': 'Клиника', 'clinic_name': 'Семейная клиника'},
        {'first_name': 'Медицинский', 'last_name': 'Центр "Современник"', 'clinic_name': 'Медицинский центр "Современник"'}
    ]
    
    for i, clinic in enumerate(clinics):
        users.append({
            'id': i + 20,  # Начинаем с 20 (после врачей)
            'email': f'clinic{i+1}@tot.ru',
            'phone': f'+7 (495) {300 + i:03d}-{30 + i:02d}-{40 + i:02d}',
            'password_hash': hash_password('clinic123'),
            'first_name': clinic['first_name'],
            'last_name': clinic['last_name'],
            'role': 'clinic',
            'clinic_name': clinic['clinic_name'],
            'clinic_address': f'ул. Примерная, {100 + i}, Москва',
            'clinic_license': f'CL{2000 + i:04d}',
            'is_active': True,
            'is_verified': True,
            'created_at': datetime.now() - timedelta(days=random.randint(1, 90)),
            'updated_at': datetime.now()
        })
    
    return users

def generate_profiles(users: List[Dict]) -> List[Dict]:
    """Генерация профилей"""
    profiles = []
    
    for user in users:
        if user['role'] == 'patient':
            profiles.append({
                'id': user['id'],  # Используем тот же ID
                'user_id': user['id'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'phone': user['phone'],
                'email': user['email'],
                'birth_date': datetime.now() - timedelta(days=random.randint(6570, 25550)),  # 18-70 лет
                'gender': random.choice(['male', 'female']),
                'address': f'ул. Тестовая, {random.randint(1, 100)}, Москва',
                'emergency_contact': f'{user["first_name"]} {user["last_name"]}',
                'emergency_phone': user['phone'],
                'medical_history': 'Без особенностей',
                'allergies': 'Нет',
                'medications': 'Не принимает',
                'insurance_number': f'INS{random.randint(100000, 999999)}',
                'created_at': user['created_at'],
                'updated_at': user['updated_at']
            })
        elif user['role'] == 'doctor':
            profiles.append({
                'id': user['id'],  # Используем тот же ID
                'user_id': user['id'],
                'specialization': user['specialization'],
                'license_number': user['license_number'],
                'experience_years': user['experience_years'],
                'created_at': user['created_at'],
                'updated_at': user['updated_at']
            })
        elif user['role'] == 'clinic':
            profiles.append({
                'id': user['id'],  # Используем тот же ID
                'user_id': user['id'],
                'clinic_name': user['clinic_name'],
                'license_number': user['clinic_license'],
                'address': user['clinic_address'],
                'phone': user['phone'],
                'email': user['email'],
                'website': f'https://{user["clinic_name"].lower().replace(" ", "").replace('"', "")}.ru',
                'working_hours': 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00',
                'services': 'Консультации, диагностика, лечение',
                'rating': random.randint(4, 5),
                'total_reviews': random.randint(10, 100),
                'created_at': user['created_at'],
                'updated_at': user['updated_at']
            })
    
    return profiles

def generate_bookings(users: List[Dict]) -> List[Dict]:
    """Генерация записей к врачам"""
    bookings = []
    
    patients = [u for u in users if u['role'] == 'patient']
    doctors = [u for u in users if u['role'] == 'doctor']
    
    statuses = ['pending', 'confirmed', 'completed', 'cancelled']
    call_types = ['consultation', 'urgent', 'scheduled']
    
    for i in range(20):  # 20 записей
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        status = random.choice(statuses)
        call_type = random.choice(call_types)
        
        # Случайная дата в прошлом или будущем
        if status == 'completed':
            appointment_date = datetime.now() - timedelta(days=random.randint(1, 30))
        elif status == 'cancelled':
            appointment_date = datetime.now() - timedelta(days=random.randint(1, 15))
        else:
            appointment_date = datetime.now() + timedelta(days=random.randint(1, 30))
        
        booking = {
            'id': i + 1,  # Простые числовые ID
            'patient_id': patient['id'],
            'doctor_id': doctor['id'],
            'call_type': call_type,
            'symptoms': random.choice([
                'Головная боль', 'Температура', 'Кашель', 'Боль в животе',
                'Слабость', 'Головокружение', 'Тошнота', 'Боль в спине'
            ]),
            'address': f'ул. Пациента, {random.randint(1, 100)}, Москва',
            'latitude': 55.7558 + random.uniform(-0.1, 0.1),
            'longitude': 37.6176 + random.uniform(-0.1, 0.1),
            'status': status,
            'priority': random.choice(['low', 'normal', 'high']),
            'scheduled_time': appointment_date,
            'notes': f'Запись к {doctor["specialization"].lower()}',
            'estimated_duration': random.randint(30, 120),
            'estimated_price': random.randint(1000, 5000),
            'is_emergency': call_type == 'urgent',
            'created_at': datetime.now() - timedelta(days=random.randint(1, 60)),
            'updated_at': datetime.now()
        }
        
        # Добавляем временные метки в зависимости от статуса
        if status in ['confirmed', 'completed']:
            booking['assigned_at'] = booking['created_at'] + timedelta(hours=random.randint(1, 24))
        
        if status == 'completed':
            booking['started_at'] = booking['assigned_at'] + timedelta(hours=random.randint(1, 6))
            booking['completed_at'] = booking['started_at'] + timedelta(minutes=booking['estimated_duration'])
            booking['actual_duration'] = booking['estimated_duration']
            booking['final_price'] = booking['estimated_price']
        
        if status == 'cancelled':
            booking['cancelled_at'] = booking['created_at'] + timedelta(hours=random.randint(1, 48))
        
        bookings.append(booking)
    
    return bookings

def generate_payments(users: List[Dict], bookings: List[Dict]) -> List[Dict]:
    """Генерация платежей и кошельков"""
    payments = []
    wallets = []
    transactions = []
    
    # Создаем кошельки для всех пользователей
    for user in users:
        wallet = {
            'id': str(uuid.uuid4()),
            'user_id': user['id'],
            'balance': random.randint(0, 10000),
            'currency': 'RUB',
            'is_active': True,
            'created_at': user['created_at'],
            'updated_at': user['updated_at']
        }
        wallets.append(wallet)
    
    # Создаем платежи для завершенных записей
    completed_bookings = [b for b in bookings if b['status'] == 'completed']
    
    for booking in completed_bookings:
        payment = {
            'id': str(uuid.uuid4()),
            'user_id': booking['patient_id'],
            'booking_id': booking['id'],
            'amount': booking['final_price'],
            'currency': 'RUB',
            'payment_method': 'wallet',
            'payment_provider': 'internal',
            'status': 'completed',
            'transaction_id': str(uuid.uuid4()),
            'description': f'Оплата записи к врачу',
            'created_at': booking['completed_at'],
            'updated_at': booking['completed_at']
        }
        payments.append(payment)
        
        # Создаем транзакцию
        transaction = {
            'id': str(uuid.uuid4()),
            'wallet_id': next(w['id'] for w in wallets if w['user_id'] == booking['patient_id']),
            'payment_id': payment['id'],
            'amount': -payment['amount'],
            'transaction_type': 'payment',
            'description': f'Оплата записи к врачу',
            'created_at': payment['created_at']
        }
        transactions.append(transaction)
    
    # Добавляем пополнения кошельков
    for wallet in wallets:
        if wallet['balance'] > 0:
            transaction = {
                'id': str(uuid.uuid4()),
                'wallet_id': wallet['id'],
                'amount': wallet['balance'],
                'transaction_type': 'deposit',
                'description': 'Пополнение кошелька',
                'created_at': wallet['created_at']
            }
            transactions.append(transaction)
    
    return payments, wallets, transactions

def main():
    """Основная функция"""
    print("🚀 Генерация тестовых данных для ТОТ...")
    
    # Создаем подключение к БД
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Регистрируем адаптер для datetime
    sqlite3.register_adapter(datetime, lambda dt: dt.isoformat())
    
    try:
        # Генерируем данные
        print("👥 Генерация пользователей...")
        users = generate_users()
        
        print("📋 Генерация профилей...")
        profiles = generate_profiles(users)
        
        print("📅 Генерация записей...")
        bookings = generate_bookings(users)
        
        print("💳 Генерация платежей...")
        payments, wallets, transactions = generate_payments(users, bookings)
        
        # Очищаем существующие данные
        print("🧹 Очистка существующих данных...")
        cursor.execute("DELETE FROM users")
        cursor.execute("DELETE FROM profiles")
        cursor.execute("DELETE FROM doctor_profiles")
        cursor.execute("DELETE FROM clinic_profiles")
        cursor.execute("DELETE FROM bookings")
        
        # Проверяем существование таблиц платежей
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payments'")
        if cursor.fetchone():
            cursor.execute("DELETE FROM payments")
            cursor.execute("DELETE FROM wallets")
            cursor.execute("DELETE FROM transactions")
        
        # Вставляем пользователей
        print("💾 Сохранение пользователей...")
        for user in users:
            cursor.execute("""
                INSERT INTO users (id, email, phone, password_hash, first_name, last_name, 
                                 role, specialization, license_number, experience_years,
                                 clinic_name, clinic_address, clinic_license,
                                 is_active, is_verified, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user['id'], user['email'], user['phone'], user['password_hash'],
                user['first_name'], user['last_name'], user['role'],
                user.get('specialization'), user.get('license_number'),
                user.get('experience_years'), user.get('clinic_name'),
                user.get('clinic_address'), user.get('clinic_license'),
                user['is_active'], user['is_verified'],
                user['created_at'].isoformat(), user['updated_at'].isoformat()
            ))
        
        # Вставляем профили
        print("💾 Сохранение профилей...")
        for profile in profiles:
            if 'specialization' in profile:  # Doctor profile
                cursor.execute("""
                    INSERT INTO doctor_profiles (id, user_id, specialization, license_number,
                                               experience_years, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    profile['id'], profile['user_id'], profile['specialization'],
                    profile['license_number'], profile['experience_years'],
                    profile['created_at'].isoformat(), profile['updated_at'].isoformat()
                ))
            elif 'clinic_name' in profile:  # Clinic profile
                cursor.execute("""
                    INSERT INTO clinic_profiles (id, user_id, clinic_name, license_number,
                                               address, phone, email, website, working_hours,
                                               services, rating, total_reviews, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    profile['id'], profile['user_id'], profile['clinic_name'],
                    profile['license_number'], profile['address'], profile['phone'],
                    profile['email'], profile['website'], profile['working_hours'],
                    profile['services'], profile['rating'], profile['total_reviews'],
                    profile['created_at'].isoformat(), profile['updated_at'].isoformat()
                ))
            else:  # Patient profile
                cursor.execute("""
                    INSERT INTO profiles (id, user_id, first_name, last_name, phone,
                                       email, birth_date, gender, address,
                                       emergency_contact, emergency_phone,
                                       medical_history, allergies, medications,
                                       insurance_number, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    profile['id'], profile['user_id'], profile['first_name'],
                    profile['last_name'], profile['phone'], profile['email'],
                    profile['birth_date'].isoformat(), profile['gender'], profile['address'],
                    profile['emergency_contact'], profile['emergency_phone'],
                    profile['medical_history'], profile['allergies'],
                    profile['medications'], profile['insurance_number'],
                    profile['created_at'].isoformat(), profile['updated_at'].isoformat()
                ))
        
        # Вставляем записи
        print("💾 Сохранение записей...")
        for booking in bookings:
            cursor.execute("""
                INSERT INTO bookings (id, patient_id, doctor_id, call_type, symptoms,
                                   address, latitude, longitude, status, priority,
                                   scheduled_time, notes, estimated_duration,
                                   estimated_price, is_emergency, created_at, updated_at,
                                   assigned_at, started_at, completed_at, cancelled_at,
                                   actual_duration, final_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                booking['id'], booking['patient_id'], booking['doctor_id'],
                booking['call_type'], booking['symptoms'], booking['address'],
                booking['latitude'], booking['longitude'], booking['status'],
                booking['priority'], booking['scheduled_time'].isoformat(), booking['notes'],
                booking['estimated_duration'], booking['estimated_price'],
                booking['is_emergency'], booking['created_at'].isoformat(), booking['updated_at'].isoformat(),
                booking.get('assigned_at').isoformat() if booking.get('assigned_at') else None,
                booking.get('started_at').isoformat() if booking.get('started_at') else None,
                booking.get('completed_at').isoformat() if booking.get('completed_at') else None,
                booking.get('cancelled_at').isoformat() if booking.get('cancelled_at') else None,
                booking.get('actual_duration'), booking.get('final_price')
            ))
        
        # Вставляем кошельки
        print("💾 Сохранение кошельков...")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='wallets'")
        if cursor.fetchone():
            for wallet in wallets:
                cursor.execute("""
                    INSERT INTO wallets (id, user_id, balance, currency, is_active,
                                      created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    wallet['id'], wallet['user_id'], wallet['balance'],
                    wallet['currency'], wallet['is_active'],
                    wallet['created_at'].isoformat(), wallet['updated_at'].isoformat()
                ))
        
        # Вставляем платежи
        print("💾 Сохранение платежей...")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payments'")
        if cursor.fetchone():
            for payment in payments:
                cursor.execute("""
                    INSERT INTO payments (id, user_id, booking_id, amount, currency,
                                       payment_method, payment_provider, status,
                                       transaction_id, description, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    payment['id'], payment['user_id'], payment['booking_id'],
                    payment['amount'], payment['currency'], payment['payment_method'],
                    payment['payment_provider'], payment['status'],
                    payment['transaction_id'], payment['description'],
                    payment['created_at'].isoformat(), payment['updated_at'].isoformat()
                ))
        
        # Вставляем транзакции
        print("💾 Сохранение транзакций...")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'")
        if cursor.fetchone():
            for transaction in transactions:
                cursor.execute("""
                    INSERT INTO transactions (id, wallet_id, payment_id, amount,
                                           transaction_type, description, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    transaction['id'], transaction['wallet_id'],
                    transaction.get('payment_id'), transaction['amount'],
                    transaction['transaction_type'], transaction['description'],
                    transaction['created_at'].isoformat()
                ))
        
        # Сохраняем изменения
        conn.commit()
        
        print("✅ Данные успешно сгенерированы!")
        print(f"👥 Пользователей: {len(users)}")
        print(f"📋 Профилей: {len(profiles)}")
        print(f"📅 Записей: {len(bookings)}")
        print(f"💳 Платежей: {len(payments)}")
        print(f"💰 Кошельков: {len(wallets)}")
        print(f"📊 Транзакций: {len(transactions)}")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    main()
