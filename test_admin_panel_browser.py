#!/usr/bin/env python3
"""
Тест Admin Panel через браузер
"""

import requests
import json

def test_admin_panel_browser():
    print("🌐 Тестируем Admin Panel через браузер...")
    
    # 1. Авторизация через Admin Panel
    print("\n1️⃣ Авторизация через Admin Panel...")
    login_data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(
            "http://localhost:3003/auth/login",
            json=login_data,
            timeout=10
        )
        
        print(f"Status: {login_response.status_code}")
        print(f"Response: {login_response.text[:200]}...")
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            token = login_data.get("access_token")
            print(f"✅ Токен получен: {token[:50]}...")
            
            # 2. Тест /admin/users через Admin Panel
            print("\n2️⃣ Тест /admin/users через Admin Panel...")
            headers = {"Authorization": f"Bearer {token}"}
            
            users_response = requests.get(
                "http://localhost:3003/admin/users",
                headers=headers,
                timeout=10
            )
            
            print(f"Status: {users_response.status_code}")
            print(f"Response: {users_response.text[:200]}...")
            
            if users_response.status_code == 200:
                print("✅ /admin/users через Admin Panel работает!")
            else:
                print(f"❌ Ошибка /admin/users через Admin Panel: {users_response.text}")
                
        else:
            print(f"❌ Ошибка авторизации через Admin Panel: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    test_admin_panel_browser() 