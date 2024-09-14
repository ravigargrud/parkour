from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from databaseConnection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True)
    hashed_password = Column(String)
    vehicle_number = Column(String, unique=True, nullable=False)

    # Relationship for parking history
    parking_history = relationship("ParkingHistory", back_populates="user")

class ParkingHistory(Base):
    __tablename__ = "parking_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    parking_lot_id = Column(Integer, ForeignKey("parking_lots.id"))
    entry_time = Column(String)
    exit_time = Column(String)

    # Relationships
    user = relationship("User", back_populates="parking_history")
    parking_lot = relationship("ParkingLot", back_populates="parking_history")

class ParkingLot(Base):
    __tablename__ = "parking_lots"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String)
    contact_no = Column(String)
    scooter_cost_per_hour = Column(Float)
    car_cost_per_hour = Column(Float)
    total_capacity = Column(Integer)
    currently_occupied = Column(Integer, default=0)

    # Relationship for parking history
    parking_history = relationship("ParkingHistory", back_populates="parking_lot")
