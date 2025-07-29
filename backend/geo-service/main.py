from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from datetime import datetime, timedelta
from typing import Optional, List
import logging
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import uuid
import math
import httpx
from fastapi import Request

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ТОТ Geo Service",
    description="Сервис геолокации и поиска врачей поблизости",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# База данных
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://tot_user:tot_password@localhost:5432/tot_mvp")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Модели данных
class Location(Base):
    __tablename__ = "locations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    user_type = Column(String, nullable=False)  # "doctor", "patient", "clinic"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    accuracy = Column(Float, nullable=True)  # точность в метрах
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DoctorAvailability(Base):
    __tablename__ = "doctor_availability"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    doctor_id = Column(String, nullable=False, index=True)
    is_available = Column(Boolean, default=True)
    current_location_id = Column(String, ForeignKey("locations.id"), nullable=True)
    specialization = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    experience_years = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    location = relationship("Location")

class LocationHistory(Base):
    __tablename__ = "location_history"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    accuracy = Column(Float, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Pydantic модели
class LocationCreate(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None
    accuracy: Optional[float] = None

class LocationResponse(BaseModel):
    id: str
    user_id: str
    user_type: str
    latitude: float
    longitude: float
    address: Optional[str]
    accuracy: Optional[float]
    is_active: bool
    created_at: datetime
    updated_at: datetime

class DoctorAvailabilityResponse(BaseModel):
    id: str
    doctor_id: str
    is_available: bool
    current_location_id: Optional[str]
    specialization: Optional[str]
    rating: Optional[float]
    experience_years: Optional[int]
    location: Optional[LocationResponse]
    created_at: datetime
    updated_at: datetime

class NearbyDoctorResponse(BaseModel):
    doctor_id: str
    distance: float  # в километрах
    latitude: float
    longitude: float
    address: Optional[str]
    specialization: Optional[str]
    rating: Optional[float]
    experience_years: Optional[int]
    estimated_arrival_time: Optional[int]  # в минутах

class LocationHistoryResponse(BaseModel):
    id: str
    user_id: str
    latitude: float
    longitude: float
    address: Optional[str]
    accuracy: Optional[float]
    recorded_at: datetime

# Функции для работы с базой данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_from_header(request):
    """Получение информации о пользователе из заголовков"""
    user_id = request.headers.get("X-User-ID")
    user_role = request.headers.get("X-User-Role")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not provided"
        )
    
    return {"user_id": user_id, "role": user_role}

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Вычисление расстояния между двумя точками в километрах (формула гаверсинуса)"""
    R = 6371  # радиус Земли в километрах
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

async def geocode_address(address: str) -> Optional[tuple]:
    """Геокодирование адреса с помощью Yandex Maps API"""
    api_key = os.getenv("YANDEX_MAPS_API_KEY")
    if not api_key:
        logger.warning("Yandex Maps API key not provided")
        return None
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://geocode-maps.yandex.ru/1.x/",
                params={
                    "apikey": api_key,
                    "format": "json",
                    "geocode": address,
                    "lang": "ru_RU"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                features = data.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", [])
                
                if features:
                    coords_str = features[0]["GeoObject"]["Point"]["pos"]
                    lon, lat = map(float, coords_str.split())
                    return lat, lon
            
            return None
    except Exception as e:
        logger.error(f"Geocoding error: {e}")
        return None

# API endpoints
@app.post("/geo/track", response_model=LocationResponse)
async def track_location(
    location_data: LocationCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Отслеживание местоположения пользователя"""
    
    user_info = get_user_from_header(request)
    
    # Если адрес не предоставлен, попробуем геокодировать координаты
    address = location_data.address
    if not address:
        # Обратное геокодирование координат
        try:
            async with httpx.AsyncClient() as client:
                api_key = os.getenv("YANDEX_MAPS_API_KEY")
                if api_key:
                    response = await client.get(
                        "https://geocode-maps.yandex.ru/1.x/",
                        params={
                            "apikey": api_key,
                            "format": "json",
                            "geocode": f"{location_data.longitude},{location_data.latitude}",
                            "lang": "ru_RU"
                        }
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        features = data.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", [])
                        if features:
                            address = features[0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["text"]
        except Exception as e:
            logger.error(f"Reverse geocoding error: {e}")
    
    # Создание или обновление местоположения
    existing_location = db.query(Location).filter(
        Location.user_id == user_info["user_id"],
        Location.is_active == True
    ).first()
    
    if existing_location:
        # Обновление существующего местоположения
        existing_location.latitude = location_data.latitude
        existing_location.longitude = location_data.longitude
        existing_location.address = address
        existing_location.accuracy = location_data.accuracy
        existing_location.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_location)
        
        location = existing_location
    else:
        # Создание нового местоположения
        location = Location(
            user_id=user_info["user_id"],
            user_type=user_info["role"],
            latitude=location_data.latitude,
            longitude=location_data.longitude,
            address=address,
            accuracy=location_data.accuracy
        )
        db.add(location)
        db.commit()
        db.refresh(location)
    
    # Сохранение в историю
    history_entry = LocationHistory(
        user_id=user_info["user_id"],
        latitude=location_data.latitude,
        longitude=location_data.longitude,
        address=address,
        accuracy=location_data.accuracy
    )
    db.add(history_entry)
    db.commit()
    
    return LocationResponse(
        id=location.id,
        user_id=location.user_id,
        user_type=location.user_type,
        latitude=location.latitude,
        longitude=location.longitude,
        address=location.address,
        accuracy=location.accuracy,
        is_active=location.is_active,
        created_at=location.created_at,
        updated_at=location.updated_at
    )

@app.get("/geo/doctors/nearby", response_model=List[NearbyDoctorResponse])
async def get_nearby_doctors(
    lat: float,
    lon: float,
    radius: float = 5.0,  # радиус поиска в километрах
    specialization: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Поиск врачей поблизости"""
    
    # Получение доступных врачей с их местоположениями
    query = db.query(DoctorAvailability, Location).join(
        Location, 
        DoctorAvailability.current_location_id == Location.id
    ).filter(
        DoctorAvailability.is_available == True,
        Location.is_active == True,
        Location.user_type == "doctor"
    )
    
    if specialization:
        query = query.filter(DoctorAvailability.specialization == specialization)
    
    doctor_locations = query.all()
    
    nearby_doctors = []
    
    for doctor_avail, location in doctor_locations:
        distance = calculate_distance(lat, lon, location.latitude, location.longitude)
        
        if distance <= radius:
            # Примерная оценка времени прибытия (30 км/ч в среднем)
            estimated_arrival_time = int(distance * 2)  # 2 минуты на километр
            
            nearby_doctors.append(NearbyDoctorResponse(
                doctor_id=doctor_avail.doctor_id,
                distance=round(distance, 2),
                latitude=location.latitude,
                longitude=location.longitude,
                address=location.address,
                specialization=doctor_avail.specialization,
                rating=doctor_avail.rating,
                experience_years=doctor_avail.experience_years,
                estimated_arrival_time=estimated_arrival_time
            ))
    
    # Сортировка по расстоянию
    nearby_doctors.sort(key=lambda x: x.distance)
    
    return nearby_doctors[:limit]

@app.get("/geo/location/{user_id}", response_model=LocationResponse)
async def get_user_location(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Получение текущего местоположения пользователя"""
    
    location = db.query(Location).filter(
        Location.user_id == user_id,
        Location.is_active == True
    ).first()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    
    return LocationResponse(
        id=location.id,
        user_id=location.user_id,
        user_type=location.user_type,
        latitude=location.latitude,
        longitude=location.longitude,
        address=location.address,
        accuracy=location.accuracy,
        is_active=location.is_active,
        created_at=location.created_at,
        updated_at=location.updated_at
    )

@app.put("/geo/availability")
async def update_doctor_availability(
    is_available: bool,
    specialization: Optional[str] = None,
    rating: Optional[float] = None,
    experience_years: Optional[int] = None,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """Обновление доступности врача"""
    
    user_info = get_user_from_header(request)
    
    if user_info["role"] != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can update availability"
        )
    
    # Получение или создание записи о доступности
    availability = db.query(DoctorAvailability).filter(
        DoctorAvailability.doctor_id == user_info["user_id"]
    ).first()
    
    if availability:
        availability.is_available = is_available
        if specialization is not None:
            availability.specialization = specialization
        if rating is not None:
            availability.rating = rating
        if experience_years is not None:
            availability.experience_years = experience_years
        availability.updated_at = datetime.utcnow()
    else:
        # Получение текущего местоположения врача
        current_location = db.query(Location).filter(
            Location.user_id == user_info["user_id"],
            Location.is_active == True
        ).first()
        
        availability = DoctorAvailability(
            doctor_id=user_info["user_id"],
            is_available=is_available,
            current_location_id=current_location.id if current_location else None,
            specialization=specialization,
            rating=rating,
            experience_years=experience_years
        )
        db.add(availability)
    
    db.commit()
    
    return {"message": "Availability updated successfully"}

@app.get("/geo/doctors/{doctor_id}/location", response_model=LocationResponse)
async def get_doctor_location(
    doctor_id: str,
    db: Session = Depends(get_db)
):
    """Получение местоположения конкретного врача"""
    
    location = db.query(Location).filter(
        Location.user_id == doctor_id,
        Location.user_type == "doctor",
        Location.is_active == True
    ).first()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor location not found"
        )
    
    return LocationResponse(
        id=location.id,
        user_id=location.user_id,
        user_type=location.user_type,
        latitude=location.latitude,
        longitude=location.longitude,
        address=location.address,
        accuracy=location.accuracy,
        is_active=location.is_active,
        created_at=location.created_at,
        updated_at=location.updated_at
    )

@app.get("/geo/history/{user_id}", response_model=List[LocationHistoryResponse])
async def get_location_history(
    user_id: str,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Получение истории местоположений пользователя"""
    
    history = db.query(LocationHistory).filter(
        LocationHistory.user_id == user_id
    ).order_by(LocationHistory.recorded_at.desc()).offset(offset).limit(limit).all()
    
    return [
        LocationHistoryResponse(
            id=entry.id,
            user_id=entry.user_id,
            latitude=entry.latitude,
            longitude=entry.longitude,
            address=entry.address,
            accuracy=entry.accuracy,
            recorded_at=entry.recorded_at
        )
        for entry in history
    ]

@app.post("/geo/geocode")
async def geocode_address_endpoint(address: str):
    """Геокодирование адреса"""
    
    coords = await geocode_address(address)
    if coords:
        lat, lon = coords
        return {
            "address": address,
            "latitude": lat,
            "longitude": lon
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not geocode address"
        )

@app.get("/health")
async def health_check():
    """Проверка состояния сервиса"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "geo-service"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("GEO_SERVICE_PORT", 8004))
    ) 