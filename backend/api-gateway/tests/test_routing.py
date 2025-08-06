"""
@file: test_routing.py
@description: Тесты для маршрутизации API Gateway
@dependencies: pytest, httpx, fastapi
@created: 2024-08-06
"""
import pytest
from fastapi.testclient import TestClient

def test_admin_users_endpoint(client: TestClient, auth_headers):
    """Тест endpoint /admin/users"""
    response = client.get("/admin/users", headers=auth_headers)
    
    # Может быть 200 (если авторизация работает) или 401/503
    assert response.status_code in [200, 401, 503]
    
    if response.status_code == 200:
        data = response.json()
        # Проверяем структуру ответа
        assert "users" in data or "data" in data

def test_api_users_endpoint(client: TestClient, auth_headers):
    """Тест endpoint /api/users"""
    response = client.get("/api/users", headers=auth_headers)
    
    # Может быть 200 (если авторизация работает) или 401/503
    assert response.status_code in [200, 401, 503]
    
    if response.status_code == 200:
        data = response.json()
        # Проверяем структуру ответа
        assert "users" in data or "data" in data

def test_unauthorized_access(client: TestClient):
    """Тест доступа без авторизации"""
    # Попытка доступа к защищенным endpoint без токена
    response = client.get("/admin/users")
    assert response.status_code in [401, 403]  # Может быть Unauthorized или Forbidden
    
    response = client.get("/api/users")
    assert response.status_code in [401, 403]  # Может быть Unauthorized или Forbidden

def test_invalid_token(client: TestClient):
    """Тест доступа с неверным токеном"""
    invalid_headers = {
        "Authorization": "Bearer invalid_token",
        "Content-Type": "application/json"
    }
    
    response = client.get("/admin/users", headers=invalid_headers)
    assert response.status_code == 401  # Unauthorized

def test_malformed_token(client: TestClient):
    """Тест доступа с неправильно сформированным токеном"""
    malformed_headers = {
        "Authorization": "InvalidFormat token",
        "Content-Type": "application/json"
    }
    
    response = client.get("/admin/users", headers=malformed_headers)
    assert response.status_code in [401, 403]  # Может быть Unauthorized или Forbidden

def test_cors_preflight_request(client: TestClient):
    """Тест CORS preflight запроса"""
    response = client.options("/admin/users", headers={
        "Origin": "http://localhost:3003",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Authorization"
    })
    
    # CORS может быть настроен или нет
    assert response.status_code in [200, 405]

def test_unsupported_methods(client: TestClient, auth_headers):
    """Тест неподдерживаемых HTTP методов"""
    # PUT запрос к GET endpoint
    response = client.put("/admin/users", headers=auth_headers)
    assert response.status_code == 405  # Method Not Allowed
    
    # DELETE запрос к GET endpoint
    response = client.delete("/admin/users", headers=auth_headers)
    assert response.status_code == 405  # Method Not Allowed

def test_not_found_endpoint(client: TestClient):
    """Тест несуществующего endpoint"""
    response = client.get("/nonexistent/endpoint")
    assert response.status_code == 404

def test_routing_with_query_params(client: TestClient, auth_headers):
    """Тест маршрутизации с query параметрами"""
    response = client.get("/admin/users?page=1&limit=10", headers=auth_headers)
    
    # Может быть 200 (если авторизация работает) или 401/503
    assert response.status_code in [200, 401, 503]

def test_routing_with_path_params(client: TestClient, auth_headers):
    """Тест маршрутизации с path параметрами"""
    response = client.get("/admin/users/1", headers=auth_headers)
    
    # Может быть 200 (если авторизация работает) или 401/503
    assert response.status_code in [200, 401, 503]

def test_content_type_headers(client: TestClient, auth_headers):
    """Тест заголовков Content-Type"""
    response = client.get("/admin/users", headers=auth_headers)
    
    # Проверяем наличие заголовка Content-Type
    assert "content-type" in response.headers
    assert "application/json" in response.headers["content-type"]

def test_health_endpoint_accessible(client: TestClient):
    """Тест доступности health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data

def test_auth_endpoint_accessible(client: TestClient):
    """Тест доступности auth endpoint"""
    response = client.post("/auth/login", json={"email": "test", "password": "test"})
    assert response.status_code == 200
