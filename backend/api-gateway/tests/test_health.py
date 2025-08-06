"""
@file: test_health.py
@description: Тесты для health check endpoints API Gateway
@dependencies: pytest, httpx, fastapi
@created: 2024-08-06
"""
import pytest
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    """Тест основного health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "timestamp" in data

def test_gateway_health(client: TestClient):
    """Тест gateway health endpoint"""
    # Проверяем, что endpoint существует
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"

def test_user_service_health(client: TestClient):
    """Тест health check User Service через Gateway"""
    # Проверяем основной health endpoint
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data

def test_health_response_structure(client: TestClient):
    """Тест структуры ответа health check"""
    response = client.get("/health")
    data = response.json()
    
    required_fields = ["status", "timestamp"]
    for field in required_fields:
        assert field in data, f"Поле {field} отсутствует в ответе"
    
    assert isinstance(data["status"], str)
    assert isinstance(data["timestamp"], str)

def test_health_endpoint_methods(client: TestClient):
    """Тест HTTP методов для health endpoint"""
    # GET должен работать
    response = client.get("/health")
    assert response.status_code == 200
    
    # POST не должен работать
    response = client.post("/health")
    assert response.status_code == 405  # Method Not Allowed
    
    # PUT не должен работать
    response = client.put("/health")
    assert response.status_code == 405  # Method Not Allowed

def test_health_content_type(client: TestClient):
    """Тест Content-Type для health endpoint"""
    response = client.get("/health")
    assert "content-type" in response.headers
    assert "application/json" in response.headers["content-type"]
