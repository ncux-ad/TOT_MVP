#!/usr/bin/env python3
"""
Простой тестовый сервис для проверки работы Python и FastAPI
"""

import uvicorn
from fastapi import FastAPI
from datetime import datetime

app = FastAPI(title="Test Service", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Hello World", "timestamp": datetime.utcnow().isoformat()}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "test-service"
    }

if __name__ == "__main__":
    print("🚀 Запуск тестового сервиса...")
    print("📱 Сервис будет доступен по адресу: http://localhost:8001")
    print("🔍 Health check: http://localhost:8001/health")
    print("⏹️ Для остановки нажмите Ctrl+C")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    ) 