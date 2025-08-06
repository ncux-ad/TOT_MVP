#!/usr/bin/env python3
"""
Тест авторизации админ-панели
"""

import requests
import json

def test_admin_auth():
    print("🔐 Тестируем авторизацию админ-панели...")
    
    # 1. Авторизация
    print("\n1️⃣ Авторизация...")
    login_data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(
            "http://localhost:8000/auth/login",
            json=login_data,
            timeout=10
        )
        
        print(f"Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            token = login_data.get("access_token")
            print(f"✅ Токен получен: {token[:50]}...")
            
            # 2. Тест /admin/users
            print("\n2️⃣ Тест /admin/users...")
            headers = {"Authorization": f"Bearer {token}"}
            
            users_response = requests.get(
                "http://localhost:8000/admin/users",
                headers=headers,
                timeout=10
            )
            
            print(f"Status: {users_response.status_code}")
            print(f"Response: {users_response.text[:200]}...")
            
            if users_response.status_code == 200:
                print("✅ /admin/users работает!")
            else:
                print(f"❌ Ошибка /admin/users: {users_response.text}")
            
            # 3. Тест /api/users
            print("\n3️⃣ Тест /api/users...")
            
            api_users_response = requests.get(
                "http://localhost:8000/api/users",
                headers=headers,
                timeout=10
            )
            
            print(f"Status: {api_users_response.status_code}")
            print(f"Response: {api_users_response.text[:200]}...")
            
            if api_users_response.status_code == 200:
                print("✅ /api/users работает!")
            else:
                print(f"❌ Ошибка /api/users: {api_users_response.text}")
                
        else:
            print(f"❌ Ошибка авторизации: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    test_admin_auth() 