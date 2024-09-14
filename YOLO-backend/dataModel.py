from pydantic import BaseModel, EmailStr
from typing import Optional, List

class User:
    id:int

# name, userid, email, phoneNo, password, vechile no, parking history
# unique parkingid, photos, address, contact no, cost per hour (vechile wise:scooter, car), total capacity, currently occupied

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    vehicle_number: str


class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    parking_history: Optional[List["ParkingHistoryResponse"]] = []

    class Config:
        orm_mode = True


class ParkingHistoryResponse(BaseModel):
    id: int
    parking_lot_id: int
    entry_time: str
    exit_time: Optional[str]

    class Config:
        orm_mode = True

class ParkingLotBase(BaseModel):
    address: str
    contact_no: str
    scooter_cost_per_hour: float
    car_cost_per_hour: float
    total_capacity: int
    currently_occupied: int

class ParkingHistoryBase(BaseModel):
    user_id: int
    parking_lot_id: int
    entry_time: str
    exit_time: str
    
    class Config:
        orm_mode = True
