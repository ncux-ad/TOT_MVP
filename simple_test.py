#!/usr/bin/env python3
"""
@file: simple_test.py
@description: Простой тест подключения API Gateway к User Service
@dependencies: requests
@created: 2024-12-19
"""

import requests
import json

def simple_test():
    """Простой тест подключения"""
    print("🔍 Простой тест подключения...")
    
    # Тест 1: Прямое подключение к User Service
    print("\n1️⃣ Прямое подключение к User Service:")
    try:
        response = requests.get("http://127.0.0.1:8001/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 2: Через API Gateway
    print("\n2️⃣ Через API Gateway:")
    try:
        response = requests.get("http://localhost:8000/test-connection", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 3: Авторизация через API Gateway
    print("\n3️⃣ Авторизация через API Gateway:")
    try:
        data = {"email": "admin@tot.ru", "password": "admin123"}
        response = requests.post(
            "http://localhost:8000/auth/login",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    simple_test() 