from typing import List
from fastapi import APIRouter, Depends, HTTPException
from dataModel import UserBase, UserCreate, UserResponse
from databaseConnection import SessionLocal
from sqlalchemy.orm import Session
from databaseSchema import User
from passlib.context import CryptContext

# Password hashing utility
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

# Create a new user
def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_password,
        vehicle_number=user.vehicle_number
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get user by ID
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Get all users
def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(User).offset(skip).limit(limit).all()

# Verify password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Login User
def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

router = APIRouter(
    prefix="/user",
    tags=["Userbase"]
)

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=UserResponse)
def createUser(user: UserCreate, db: Session = Depends(get_db)):
    db_user = create_user(db, user)
    return db_user

@router.get("/findbyID/{user_id}", response_model=UserResponse)
def readUser(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/all", response_model=List[UserResponse])
def readUsers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = get_users(db, skip=skip, limit=limit)
    return users

@router.get("/findbyEmail/{email}", response_model=UserResponse)
def read_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/login", response_model=UserResponse)
def loginUser(email: str, password:str, db: Session = Depends(get_db)):
    db_user = login_user(db, email, password)
    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return db_user