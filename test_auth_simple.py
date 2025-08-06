import requests
import json

def test_direct_user_service():
    """Тест прямого обращения к User Service"""
    url = "http://localhost:8001/auth/login"
    data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    print("🔍 Тестируем прямое обращение к User Service...")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ User Service работает!")
            return result.get('access_token', '')
        else:
            print("❌ User Service не отвечает")
            return None
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return None

def test_api_gateway():
    """Тест обращения через API Gateway"""
    url = "http://localhost:8000/auth/login"
    data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    print("\n🔍 Тестируем обращение через API Gateway...")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Gateway работает!")
            return result.get('data', {}).get('access_token', '')
        else:
            print("❌ API Gateway не отвечает")
            return None
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return None

if __name__ == "__main__":
    print("=== Тест авторизации ===\n")
    
    # Тест User Service
    user_token = test_direct_user_service()
    
    # Тест API Gateway
    gateway_token = test_api_gateway()
    
    print("\n=== Результаты ===")
    if user_token:
        print("✅ User Service: OK")
    else:
        print("❌ User Service: FAILED")
        
    if gateway_token:
        print("✅ API Gateway: OK")
    else:
        print("❌ API Gateway: FAILED") 