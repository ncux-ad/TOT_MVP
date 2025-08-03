from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import os
import logging
from typing import Optional
import jwt
from datetime import datetime, timedelta

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ТОТ API Gateway",
    description="API Gateway для системы ТОТ – Твоя Точка Опоры",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Настройка безопасности
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # В продакшене указать конкретные хосты
)

# Схема аутентификации
security = HTTPBearer()

# Конфигурация сервисов
SERVICES = {
    "user": os.getenv("USER_SERVICE_URL", "http://localhost:8001"),
    "profile": os.getenv("PROFILE_SERVICE_URL", "http://localhost:8002"),
    "booking": os.getenv("BOOKING_SERVICE_URL", "http://localhost:8003"),
    "geo": os.getenv("GEO_SERVICE_URL", "http://localhost:8004"),
    "payment": os.getenv("PAYMENT_SERVICE_URL", "http://localhost:8005"),
    "notification": os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8006"),
    "chat": os.getenv("CHAT_SERVICE_URL", "http://localhost:8007"),
    "rating": os.getenv("RATING_SERVICE_URL", "http://localhost:8008"),
    "event": os.getenv("EVENT_SERVICE_URL", "http://localhost:8009"),
    "emergency": os.getenv("EMERGENCY_SERVICE_URL", "http://localhost:8010"),
    "security": os.getenv("SECURITY_SERVICE_URL", "http://localhost:8011"),
}

# JWT настройки
JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-jwt-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

class UserRole:
    PATIENT = "patient"
    DOCTOR = "doctor"
    CLINIC = "clinic"
    ADMIN = "admin"

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Проверка JWT токена"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        # Проверка срока действия токена
        exp = payload.get("exp")
        if exp and datetime.now() > datetime.fromtimestamp(exp):
            raise HTTPException(status_code=401, detail="Token expired")
        
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Token verification failed")

async def forward_request(
    service_name: str,
    path: str,
    method: str = "GET",
    data: Optional[dict] = None,
    headers: Optional[dict] = None,
    user_token: Optional[dict] = None
) -> dict:
    """Пересылка запроса к соответствующему сервису"""
    if service_name not in SERVICES:
        raise HTTPException(status_code=404, detail=f"Service {service_name} not found")
    
    service_url = SERVICES[service_name]
    url = f"{service_url}{path}"
    
    # Подготовка заголовков
    request_headers = headers or {}
    if user_token:
        # Для User Service передаем токен в заголовке Authorization
        if service_name == "user":
            # Создаем новый токен для передачи в User Service
            token_data = {
                "user_id": user_token.get("user_id"),
                "email": user_token.get("email"),
                "role": user_token.get("role")
            }
            import jwt
            new_token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
            request_headers["Authorization"] = f"Bearer {new_token}"
        else:
            # Для других сервисов передаем через X-User-ID и X-User-Role
            request_headers["X-User-ID"] = str(user_token.get("user_id"))
            request_headers["X-User-Role"] = user_token.get("role", "")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method.upper() == "GET":
                response = await client.get(url, headers=request_headers)
            elif method.upper() == "POST":
                response = await client.post(url, json=data, headers=request_headers)
            elif method.upper() == "PUT":
                response = await client.put(url, json=data, headers=request_headers)
            elif method.upper() == "DELETE":
                response = await client.delete(url, headers=request_headers)
            else:
                raise HTTPException(status_code=405, detail="Method not allowed")
            
            return {
                "status_code": response.status_code,
                "data": response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
            }
    except httpx.RequestError as e:
        logger.error(f"Request error to {service_name}: {e}")
        raise HTTPException(status_code=503, detail=f"Service {service_name} unavailable")
    except Exception as e:
        logger.error(f"Unexpected error forwarding to {service_name}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Health check
@app.get("/health")
async def health_check():
    """Проверка состояния API Gateway"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "api-gateway"
    }

# User Service routes
@app.post("/auth/register")
async def register_user(data: dict):
    """Регистрация пользователя"""
    return await forward_request("user", "/auth/register", "POST", data)

@app.post("/auth/login")
async def login_user(data: dict):
    """Авторизация пользователя"""
    return await forward_request("user", "/auth/login", "POST", data)

@app.get("/auth/me")
async def get_current_user(user_token: dict = Depends(verify_token)):
    """Получение информации о текущем пользователе"""
    return await forward_request("user", "/auth/me", "GET", user_token=user_token)

# Profile Service routes
@app.get("/profiles/{user_id}")
async def get_profile(user_id: str, user_token: dict = Depends(verify_token)):
    """Получение профиля пользователя"""
    return await forward_request("profile", f"/profiles/{user_id}", "GET", user_token=user_token)

@app.put("/profiles/{user_id}")
async def update_profile(user_id: str, data: dict, user_token: dict = Depends(verify_token)):
    """Обновление профиля пользователя"""
    return await forward_request("profile", f"/profiles/{user_id}", "PUT", data, user_token=user_token)

# Booking Service routes
@app.post("/bookings")
async def create_booking(data: dict, user_token: dict = Depends(verify_token)):
    """Создание заказа вызова врача"""
    return await forward_request("booking", "/bookings", "POST", data, user_token=user_token)

@app.get("/bookings/{booking_id}")
async def get_booking(booking_id: str, user_token: dict = Depends(verify_token)):
    """Получение информации о заказе"""
    return await forward_request("booking", f"/bookings/{booking_id}", "GET", user_token=user_token)

@app.put("/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: str, user_token: dict = Depends(verify_token)):
    """Отмена заказа"""
    return await forward_request("booking", f"/bookings/{booking_id}/cancel", "PUT", user_token=user_token)

# Geo Service routes
@app.get("/geo/doctors/nearby")
async def get_nearby_doctors(lat: float, lon: float, radius: float = 5.0, user_token: dict = Depends(verify_token)):
    """Поиск врачей поблизости"""
    params = {"lat": lat, "lon": lon, "radius": radius}
    return await forward_request("geo", f"/geo/doctors/nearby?lat={lat}&lon={lon}&radius={radius}", "GET", user_token=user_token)

@app.post("/geo/track")
async def track_location(data: dict, user_token: dict = Depends(verify_token)):
    """Отслеживание местоположения"""
    return await forward_request("geo", "/geo/track", "POST", data, user_token=user_token)

# Payment Service routes
@app.post("/payments/create")
async def create_payment(data: dict, user_token: dict = Depends(verify_token)):
    """Создание платежа"""
    return await forward_request("payment", "/payments/create", "POST", data, user_token=user_token)

@app.get("/payments/{payment_id}")
async def get_payment(payment_id: str, user_token: dict = Depends(verify_token)):
    """Получение информации о платеже"""
    return await forward_request("payment", f"/payments/{payment_id}", "GET", user_token=user_token)

# Chat Service routes
@app.post("/chat/rooms")
async def create_chat_room(data: dict, user_token: dict = Depends(verify_token)):
    """Создание чат-комнаты"""
    return await forward_request("chat", "/chat/rooms", "POST", data, user_token=user_token)

@app.get("/chat/rooms/{room_id}/messages")
async def get_chat_messages(room_id: str, user_token: dict = Depends(verify_token)):
    """Получение сообщений чата"""
    return await forward_request("chat", f"/chat/rooms/{room_id}/messages", "GET", user_token=user_token)

@app.post("/chat/rooms/{room_id}/messages")
async def send_message(room_id: str, data: dict, user_token: dict = Depends(verify_token)):
    """Отправка сообщения"""
    return await forward_request("chat", f"/chat/rooms/{room_id}/messages", "POST", data, user_token=user_token)

# Rating Service routes
@app.post("/ratings")
async def create_rating(data: dict, user_token: dict = Depends(verify_token)):
    """Создание отзыва и рейтинга"""
    return await forward_request("rating", "/ratings", "POST", data, user_token=user_token)

@app.get("/ratings/doctors/{doctor_id}")
async def get_doctor_ratings(doctor_id: str):
    """Получение рейтингов врача"""
    return await forward_request("rating", f"/ratings/doctors/{doctor_id}", "GET")

# Event Service routes
@app.get("/events")
async def get_events():
    """Получение списка мероприятий"""
    return await forward_request("event", "/events", "GET")

@app.post("/events")
async def create_event(data: dict, user_token: dict = Depends(verify_token)):
    """Создание мероприятия"""
    return await forward_request("event", "/events", "POST", data, user_token=user_token)

# Emergency Service routes
@app.post("/emergency/alert")
async def create_emergency_alert(data: dict, user_token: dict = Depends(verify_token)):
    """Создание экстренного вызова"""
    return await forward_request("emergency", "/emergency/alert", "POST", data, user_token=user_token)

@app.put("/emergency/{alert_id}/status")
async def update_emergency_status(alert_id: str, data: dict, user_token: dict = Depends(verify_token)):
    """Обновление статуса экстренного вызова"""
    return await forward_request("emergency", f"/emergency/{alert_id}/status", "PUT", data, user_token=user_token)

# Notification Service routes
@app.post("/notifications/send")
async def send_notification(data: dict, user_token: dict = Depends(verify_token)):
    """Отправка уведомления"""
    return await forward_request("notification", "/notifications/send", "POST", data, user_token=user_token)

@app.get("/notifications")
async def get_notifications(user_token: dict = Depends(verify_token)):
    """Получение уведомлений пользователя"""
    return await forward_request("notification", "/notifications", "GET", user_token=user_token)

# Admin routes
@app.get("/admin/users")
async def get_users(
    page: int = 1,
    limit: int = 10,
    user_token: dict = Depends(verify_token)
):
    """Получение списка пользователей (только для админов)"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users?page={page}&limit={limit}", "GET", user_token=user_token)

@app.get("/admin/users/{user_id}")
async def get_user(user_id: str, user_token: dict = Depends(verify_token)):
    """Получение информации о пользователе (только для админов)"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users/{user_id}", "GET", user_token=user_token)

@app.put("/admin/users/{user_id}")
async def update_user(user_id: str, data: dict, user_token: dict = Depends(verify_token)):
    """Обновление пользователя (только для админов)"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users/{user_id}", "PUT", data, user_token=user_token)

@app.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, user_token: dict = Depends(verify_token)):
    """Удаление пользователя (только для админов)"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users/{user_id}", "DELETE", user_token=user_token)

@app.get("/admin/me")
async def get_admin_profile(user_token: dict = Depends(verify_token)):
    """Получение профиля админа"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", "/auth/me", "GET", user_token=user_token)

# Admin Panel API endpoints
@app.get("/api/users")
async def api_get_users(
    page: int = 1,
    size: int = 10,
    user_token: dict = Depends(verify_token)
):
    """Получение списка пользователей через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users?page={page}&limit={size}", "GET", user_token=user_token)

@app.get("/api/users/{user_id}")
async def api_get_user(user_id: str, user_token: dict = Depends(verify_token)):
    """Получение информации о пользователе через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users/{user_id}", "GET", user_token=user_token)

@app.post("/api/users")
async def api_create_user(data: dict, user_token: dict = Depends(verify_token)):
    """Создание пользователя через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", "/auth/register", "POST", data, user_token=user_token)

@app.put("/api/users/{user_id}")
async def api_update_user(user_id: str, data: dict, user_token: dict = Depends(verify_token)):
    """Обновление пользователя через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users/{user_id}", "PUT", data, user_token=user_token)

@app.delete("/api/users/{user_id}")
async def api_delete_user(user_id: str, user_token: dict = Depends(verify_token)):
    """Удаление пользователя через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", f"/users/{user_id}", "DELETE", user_token=user_token)

@app.get("/api/doctors")
async def api_get_doctors(
    page: int = 1,
    size: int = 10,
    user_token: dict = Depends(verify_token)
):
    """Получение списка врачей через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", "/doctor-profiles/", "GET", user_token=user_token)

@app.get("/api/doctors/{doctor_id}")
async def api_get_doctor(doctor_id: str, user_token: dict = Depends(verify_token)):
    """Получение информации о враче через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", f"/doctor-profiles/{doctor_id}", "GET", user_token=user_token)

@app.post("/api/doctors")
async def api_create_doctor(data: dict, user_token: dict = Depends(verify_token)):
    """Создание врача через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", "/doctor-profiles/", "POST", data, user_token=user_token)

@app.put("/api/doctors/{doctor_id}")
async def api_update_doctor(doctor_id: str, data: dict, user_token: dict = Depends(verify_token)):
    """Обновление врача через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", f"/doctor-profiles/{doctor_id}", "PUT", data, user_token=user_token)

@app.delete("/api/doctors/{doctor_id}")
async def api_delete_doctor(doctor_id: str, user_token: dict = Depends(verify_token)):
    """Удаление врача через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", f"/doctor-profiles/{doctor_id}", "DELETE", user_token=user_token)

@app.get("/api/doctors/list")
async def api_get_doctors_list(user_token: dict = Depends(verify_token)):
    """Получение списка врачей для форм"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", "/doctor-profiles/", "GET", user_token=user_token)

@app.get("/api/clinics")
async def api_get_clinics(
    page: int = 1,
    size: int = 10,
    user_token: dict = Depends(verify_token)
):
    """Получение списка клиник через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", "/clinic-profiles/", "GET", user_token=user_token)

@app.get("/api/clinics/{clinic_id}")
async def api_get_clinic(clinic_id: str, user_token: dict = Depends(verify_token)):
    """Получение информации о клинике через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", f"/clinic-profiles/{clinic_id}", "GET", user_token=user_token)

@app.post("/api/clinics")
async def api_create_clinic(data: dict, user_token: dict = Depends(verify_token)):
    """Создание клиники через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", "/clinic-profiles/", "POST", data, user_token=user_token)

@app.put("/api/clinics/{clinic_id}")
async def api_update_clinic(clinic_id: str, data: dict, user_token: dict = Depends(verify_token)):
    """Обновление клиники через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", f"/clinic-profiles/{clinic_id}", "PUT", data, user_token=user_token)

@app.delete("/api/clinics/{clinic_id}")
async def api_delete_clinic(clinic_id: str, user_token: dict = Depends(verify_token)):
    """Удаление клиники через API"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", f"/clinic-profiles/{clinic_id}", "DELETE", user_token=user_token)

@app.get("/api/clinics/list")
async def api_get_clinics_list(user_token: dict = Depends(verify_token)):
    """Получение списка клиник для форм"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("profile", "/clinic-profiles/", "GET", user_token=user_token)

@app.get("/api/patients")
async def api_get_patients(user_token: dict = Depends(verify_token)):
    """Получение списка пациентов"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    return await forward_request("user", "/users?role=patient", "GET", user_token=user_token)

@app.get("/api/dashboard/stats")
async def api_get_dashboard_stats(user_token: dict = Depends(verify_token)):
    """Получение статистики для дашборда"""
    if user_token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    
    try:
        # Получаем статистику от всех сервисов
        users_response = await forward_request("user", "/users/count", "GET", user_token=user_token)
        doctors_response = await forward_request("profile", "/doctor-profiles/count", "GET", user_token=user_token)
        clinics_response = await forward_request("profile", "/clinic-profiles/count", "GET", user_token=user_token)
        
        # Извлекаем данные
        total_users = users_response.get("data", {}).get("count", 0) if users_response.get("status_code") == 200 else 0
        total_doctors = doctors_response.get("data", {}).get("count", 0) if doctors_response.get("status_code") == 200 else 0
        total_clinics = clinics_response.get("data", {}).get("count", 0) if clinics_response.get("status_code") == 200 else 0
        
        # Получаем статистику от Booking Service
        bookings_response = await forward_request("booking", "/bookings/count", "GET", user_token=user_token)
        total_appointments = bookings_response.get("data", {}).get("count", 0) if bookings_response.get("status_code") == 200 else 0
        
        return {
            "total_users": total_users,
            "total_doctors": total_doctors,
            "total_clinics": total_clinics,
            "total_appointments": total_appointments,
            "active_appointments": 0,  # TODO: Добавить фильтрацию по статусу
            "pending_appointments": 0,
            "completed_appointments": 0
        }
    except Exception as e:
        logger.error(f"Ошибка получения статистики: {e}")
        return {
            "total_users": 0,
            "total_doctors": 0,
            "total_clinics": 0,
            "total_appointments": 0,
            "active_appointments": 0,
            "pending_appointments": 0,
            "completed_appointments": 0
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("API_GATEWAY_HOST", "0.0.0.0"),
        port=int(os.getenv("API_GATEWAY_PORT", 8000))
    ) 