#!/usr/bin/env python3
"""
@file: test_new_api.py
@description: Тестирование нового API Gateway после исправлений
@dependencies: requests, json
@created: 2024-12-19
"""

import requests
import json
import time

def test_api_gateway():
    """Тестирование API Gateway"""
    base_url = "http://localhost:8000"
    
    print("🔍 Тестирование API Gateway...")
    
    # 1. Тест здоровья API Gateway
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ API Gateway health: {response.status_code}")
    except Exception as e:
        print(f"❌ API Gateway недоступен: {e}")
        return
    
    # 2. Тест авторизации
    try:
        auth_data = {
            "email": "admin@tot.ru",
            "password": "admin123"
        }
        response = requests.post(
            f"{base_url}/auth/login",
            json=auth_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ Авторизация: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"📄 Ответ: {json.dumps(data, indent=2, ensure_ascii=False)}")
            token = data.get("access_token")
            if token:
                print(f"🔑 Токен получен: {token[:20]}...")
            else:
                print("❌ Токен не найден в ответе")
        else:
            print(f"❌ Ошибка авторизации: {response.text}")
    except Exception as e:
        print(f"❌ Ошибка при авторизации: {e}")
    
    # 3. Тест нового API v1
    if 'token' in locals():
        try:
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(
                f"{base_url}/api/v1/users?page=1&limit=5",
                headers=headers
            )
            print(f"✅ API v1 users: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"📄 Пользователи: {json.dumps(data, indent=2, ensure_ascii=False)}")
            else:
                print(f"❌ Ошибка API v1: {response.text}")
        except Exception as e:
            print(f"❌ Ошибка при тестировании API v1: {e}")

if __name__ == "__main__":
    print("🚀 Запуск тестирования нового API Gateway...")
    test_api_gateway()
    print("✅ Тестирование завершено") 