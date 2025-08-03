import httpx
import json

async def test_admin_api():
    """Тестируем API админ-панели"""
    async with httpx.AsyncClient() as client:
        # Логин админа
        login_data = {"email": "admin@tot.ru", "password": "admin123"}
        
        try:
            # Получаем токен
            login_response = await client.post(
                "http://localhost:8000/auth/login",
                json=login_data,
                timeout=10.0
            )
            
            if login_response.status_code == 200:
                token = login_response.json()['data']['access_token']
                print(f"✅ Токен получен: {token[:20]}...")
                
                # Тестируем /admin/users
                headers = {"Authorization": f"Bearer {token}"}
                users_response = await client.get(
                    "http://localhost:8000/admin/users",
                    headers=headers,
                    timeout=10.0
                )
                
                print(f"Status: {users_response.status_code}")
                if users_response.status_code == 200:
                    data = users_response.json()
                    users = data.get('data', {}).get('users', [])
                    print(f"✅ Найдено пользователей: {len(users)}")
                    for user in users:
                        print(f"  - {user['email']} ({user['role']})")
                else:
                    print(f"❌ Ошибка: {users_response.text}")
                    
            else:
                print(f"❌ Ошибка логина: {login_response.text}")
                
        except Exception as e:
            print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_admin_api()) 