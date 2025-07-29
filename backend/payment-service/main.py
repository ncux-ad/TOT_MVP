from fastapi import FastAPI, HTTPException, Depends, Header
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Payment Service", version="1.0.0")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://tot_user:tot_password@localhost:5432/tot_mvp")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    booking_id = Column(Integer, index=True)
    amount = Column(Float)
    currency = Column(String(3), default="RUB")
    payment_method = Column(String(50))  # card, cash, etc.
    status = Column(String(20))  # pending, completed, failed, refunded
    transaction_id = Column(String(100), unique=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    balance = Column(Float, default=0.0)
    currency = Column(String(3), default="RUB")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"))
    payment_id = Column(Integer, ForeignKey("payments.id"))
    amount = Column(Float)
    transaction_type = Column(String(20))  # deposit, withdrawal, payment
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic models
class PaymentBase(BaseModel):
    user_id: int
    booking_id: Optional[int] = None
    amount: float
    currency: str = "RUB"
    payment_method: str
    description: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    status: Optional[str] = None
    transaction_id: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    status: str
    transaction_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class WalletBase(BaseModel):
    user_id: int
    balance: float = 0.0
    currency: str = "RUB"
    is_active: bool = True

class WalletCreate(WalletBase):
    pass

class WalletUpdate(BaseModel):
    balance: Optional[float] = None
    is_active: Optional[bool] = None

class WalletResponse(WalletBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    wallet_id: int
    payment_id: Optional[int] = None
    amount: float
    transaction_type: str
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

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
    try:
        user_id = int(authorization.split(" ")[1])
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "payment-service"}

# Payment endpoints
@app.post("/payments/", response_model=PaymentResponse)
async def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    # Генерируем уникальный transaction_id
    import uuid
    transaction_id = str(uuid.uuid4())
    
    db_payment = Payment(
        **payment.dict(),
        status="pending",
        transaction_id=transaction_id
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.get("/payments/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@app.put("/payments/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: int, 
    payment_update: PaymentUpdate, 
    db: Session = Depends(get_db)
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    for field, value in payment_update.dict(exclude_unset=True).items():
        setattr(payment, field, value)
    
    payment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(payment)
    return payment

@app.get("/payments/user/{user_id}", response_model=List[PaymentResponse])
async def get_user_payments(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return db.query(Payment).filter(Payment.user_id == user_id).all()

@app.post("/payments/{payment_id}/complete")
async def complete_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment.status = "completed"
    payment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(payment)
    return {"message": "Payment completed successfully"}

@app.post("/payments/{payment_id}/refund")
async def refund_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment.status = "refunded"
    payment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(payment)
    return {"message": "Payment refunded successfully"}

# Wallet endpoints
@app.post("/wallets/", response_model=WalletResponse)
async def create_wallet(wallet: WalletCreate, db: Session = Depends(get_db)):
    # Проверяем, не существует ли уже кошелек для этого пользователя
    existing_wallet = db.query(Wallet).filter(Wallet.user_id == wallet.user_id).first()
    if existing_wallet:
        raise HTTPException(status_code=400, detail="Wallet already exists for this user")
    
    db_wallet = Wallet(**wallet.dict())
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet

@app.get("/wallets/{user_id}", response_model=WalletResponse)
async def get_wallet(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet

@app.put("/wallets/{user_id}", response_model=WalletResponse)
async def update_wallet(
    user_id: int, 
    wallet_update: WalletUpdate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    for field, value in wallet_update.dict(exclude_unset=True).items():
        setattr(wallet, field, value)
    
    wallet.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(wallet)
    return wallet

@app.post("/wallets/{user_id}/deposit")
async def deposit_to_wallet(
    user_id: int, 
    amount: float, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    wallet.balance += amount
    wallet.updated_at = datetime.utcnow()
    
    # Создаем транзакцию
    transaction = Transaction(
        wallet_id=wallet.id,
        amount=amount,
        transaction_type="deposit",
        description=f"Deposit of {amount} {wallet.currency}"
    )
    db.add(transaction)
    db.commit()
    db.refresh(wallet)
    
    return {"message": f"Deposited {amount} {wallet.currency}", "new_balance": wallet.balance}

@app.post("/wallets/{user_id}/withdraw")
async def withdraw_from_wallet(
    user_id: int, 
    amount: float, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    if wallet.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    
    wallet.balance -= amount
    wallet.updated_at = datetime.utcnow()
    
    # Создаем транзакцию
    transaction = Transaction(
        wallet_id=wallet.id,
        amount=-amount,
        transaction_type="withdrawal",
        description=f"Withdrawal of {amount} {wallet.currency}"
    )
    db.add(transaction)
    db.commit()
    db.refresh(wallet)
    
    return {"message": f"Withdrawn {amount} {wallet.currency}", "new_balance": wallet.balance}

# Transaction endpoints
@app.get("/transactions/wallet/{wallet_id}", response_model=List[TransactionResponse])
async def get_wallet_transactions(
    wallet_id: int, 
    db: Session = Depends(get_db)
):
    return db.query(Transaction).filter(Transaction.wallet_id == wallet_id).all()

@app.get("/transactions/user/{user_id}", response_model=List[TransactionResponse])
async def get_user_transactions(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Получаем кошелек пользователя
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    return db.query(Transaction).filter(Transaction.wallet_id == wallet.id).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005) 