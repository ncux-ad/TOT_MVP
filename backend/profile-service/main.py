from fastapi import FastAPI, HTTPException, Depends, Header
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Profile Service", version="1.0.0")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://tot_user:tot_password@localhost:5432/tot_mvp")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    middle_name = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    birth_date = Column(DateTime)
    gender = Column(String(10))
    address = Column(Text)
    emergency_contact = Column(String(100))
    emergency_phone = Column(String(20))
    medical_history = Column(Text)
    allergies = Column(Text)
    medications = Column(Text)
    insurance_number = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    specialization = Column(String(100))
    license_number = Column(String(50))
    experience_years = Column(Integer)
    education = Column(Text)
    certifications = Column(Text)
    languages = Column(Text)
    consultation_price = Column(Integer)
    is_available = Column(Boolean, default=True)
    rating = Column(Integer, default=0)
    total_reviews = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ClinicProfile(Base):
    __tablename__ = "clinic_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    clinic_name = Column(String(200))
    license_number = Column(String(50))
    address = Column(Text)
    phone = Column(String(20))
    email = Column(String(100))
    website = Column(String(200))
    working_hours = Column(Text)
    services = Column(Text)
    rating = Column(Integer, default=0)
    total_reviews = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic models
class ProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None
    insurance_number: Optional[str] = None

class ProfileCreate(ProfileBase):
    user_id: int

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DoctorProfileBase(BaseModel):
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    experience_years: Optional[int] = None
    education: Optional[str] = None
    certifications: Optional[str] = None
    languages: Optional[str] = None
    consultation_price: Optional[int] = None
    is_available: Optional[bool] = True

class DoctorProfileCreate(DoctorProfileBase):
    user_id: int

class DoctorProfileUpdate(DoctorProfileBase):
    pass

class DoctorProfileResponse(DoctorProfileBase):
    id: int
    user_id: int
    rating: int
    total_reviews: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClinicProfileBase(BaseModel):
    clinic_name: Optional[str] = None
    license_number: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    working_hours: Optional[str] = None
    services: Optional[str] = None

class ClinicProfileCreate(ClinicProfileBase):
    user_id: int

class ClinicProfileUpdate(ClinicProfileBase):
    pass

class ClinicProfileResponse(ClinicProfileBase):
    id: int
    user_id: int
    rating: int
    total_reviews: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth dependency
def get_user_from_header(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    # В реальном приложении здесь будет проверка JWT токена
    # Пока просто извлекаем user_id из заголовка
    try:
        user_id = int(authorization.split(" ")[1])
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "profile-service"}

# Profile endpoints
@app.post("/profiles/", response_model=ProfileResponse)
async def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    db_profile = Profile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/profiles/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/profiles/{user_id}", response_model=ProfileResponse)
async def update_profile(
    user_id: int, 
    profile_update: ProfileUpdate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for field, value in profile_update.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    profile.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    db.refresh(profile)
    return profile

# Doctor profile endpoints
@app.post("/doctor-profiles/", response_model=DoctorProfileResponse)
async def create_doctor_profile(profile: DoctorProfileCreate, db: Session = Depends(get_db)):
    db_profile = DoctorProfile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/doctor-profiles/{user_id}", response_model=DoctorProfileResponse)
async def get_doctor_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    return profile

@app.put("/doctor-profiles/{user_id}", response_model=DoctorProfileResponse)
async def update_doctor_profile(
    user_id: int, 
    profile_update: DoctorProfileUpdate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    
    for field, value in profile_update.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    profile.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    db.refresh(profile)
    return profile

@app.get("/doctor-profiles/", response_model=List[DoctorProfileResponse])
async def get_doctors(
    specialization: Optional[str] = None,
    is_available: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(DoctorProfile)
    
    if specialization:
        query = query.filter(DoctorProfile.specialization == specialization)
    
    if is_available is not None:
        query = query.filter(DoctorProfile.is_available == is_available)
    
    return query.all()

# Clinic profile endpoints
@app.post("/clinic-profiles/", response_model=ClinicProfileResponse)
async def create_clinic_profile(profile: ClinicProfileCreate, db: Session = Depends(get_db)):
    db_profile = ClinicProfile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/clinic-profiles/{user_id}", response_model=ClinicProfileResponse)
async def get_clinic_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(ClinicProfile).filter(ClinicProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Clinic profile not found")
    return profile

@app.put("/clinic-profiles/{user_id}", response_model=ClinicProfileResponse)
async def update_clinic_profile(
    user_id: int, 
    profile_update: ClinicProfileUpdate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    profile = db.query(ClinicProfile).filter(ClinicProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Clinic profile not found")
    
    for field, value in profile_update.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    profile.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    db.refresh(profile)
    return profile

@app.get("/clinic-profiles/", response_model=List[ClinicProfileResponse])
async def get_clinics(db: Session = Depends(get_db)):
    return db.query(ClinicProfile).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 