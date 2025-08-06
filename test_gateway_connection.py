import httpx
import asyncio

async def test_gateway_to_user_service():
    """Тест подключения API Gateway к User Service"""
    url = "http://localhost:8001/auth/login"
    data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    print(f"🔍 Тестируем подключение к User Service: {url}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                print("✅ Подключение к User Service успешно!")
                return True
            else:
                print("❌ Ошибка подключения к User Service")
                return False
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        return False

async def test_api_gateway_forward():
    """Тест пересылки запроса через API Gateway"""
    url = "http://localhost:8000/auth/login"
    data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    print(f"\n🔍 Тестируем пересылку через API Gateway: {url}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('status_code') == 503:
                    print("❌ API Gateway не может подключиться к User Service")
                    return False
                else:
                    print("✅ API Gateway работает корректно!")
                    return True
            else:
                print("❌ Ошибка API Gateway")
                return False
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        return False

async def main():
    print("=== Тест подключения API Gateway ===\n")
    
    # Тест прямого подключения к User Service
    user_service_ok = await test_gateway_to_user_service()
    
    # Тест через API Gateway
    gateway_ok = await test_api_gateway_forward()
    
    print("\n=== Результаты ===")
    if user_service_ok:
        print("✅ User Service доступен")
    else:
        print("❌ User Service недоступен")
        
    if gateway_ok:
        print("✅ API Gateway работает")
    else:
        print("❌ API Gateway не работает")

if __name__ == "__main__":
    asyncio.run(main()) 