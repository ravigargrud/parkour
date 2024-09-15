from pydantic import BaseModel, EmailStr
from typing import Optional, List

# Base User Schema
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    vehicle_number: str


class UserCreate(UserBase):
    password: str


# Response for user with parking history
class UserResponse(UserBase):
    id: int
    parking_history: Optional[List["ParkingHistoryResponse"]] = []

    class Config:
        orm_mode = True  # Enables conversion from SQLAlchemy model to Pydantic model


# Parking history response schema
class ParkingHistoryResponse(BaseModel):
    id: int
    parking_lot_id: int
    entry_time: str
    exit_time: Optional[str]

    class Config:
        orm_mode = True


# Location schema for ParkingLot
class Location(BaseModel):
    latitude: float
    longitude: float
    address: str


# Parking lot photos schema
class ParkingPhotoBase(BaseModel):
    imgLink: str

    class Config:
        orm_mode = True


# Parking lot schema, linking it to a user via user_id
class ParkingLotBase(BaseModel):
    location: Location
    contact_no: str
    scooter_cost_per_hour: float
    car_cost_per_hour: float
    parking_photos: Optional[List[ParkingPhotoBase]] = []
    total_capacity: int
    currently_occupied: int
    user_id: int  # Added user_id to link the ParkingLot with a User

    class Config:
        orm_mode = True


# Login schema for authentication
class LoginSchema(BaseModel):
    email: str
    password: str


# Base model for parking history creation
class ParkingHistoryBase(BaseModel):
    user_id: int
    parking_lot_id: int
    entry_time: str
    exit_time: Optional[str]

    class Config:
        orm_mode = True
