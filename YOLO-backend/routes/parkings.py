from typing import List
from fastapi import APIRouter, Depends, HTTPException
from dataModel import ParkingLotBase, ParkingHistoryBase, ParkingPhotoBase
from databaseConnection import SessionLocal
from sqlalchemy.orm import Session
from databaseSchema import ParkingLot, ParkingHistory, ParkingPhoto
import math

def create_parking_lot(db: Session, parking_lot: ParkingLotBase):
    db_parking_lot = ParkingLot(
        latitude=parking_lot.location.latitude,
        longitude=parking_lot.location.longitude,
        address=parking_lot.location.address,
        contact_no=parking_lot.contact_no,
        scooter_cost_per_hour=parking_lot.scooter_cost_per_hour,
        car_cost_per_hour=parking_lot.car_cost_per_hour,
        total_capacity=parking_lot.total_capacity,
        currently_occupied=parking_lot.currently_occupied
    )
    
    db.add(db_parking_lot)
    db.commit()
    db.refresh(db_parking_lot)

    # Add parking photos
    for photo in parking_lot.parking_photos:
        db_parking_photo = ParkingPhoto(
            imgLink=photo.imgLink,
            parking_lot_id=db_parking_lot.id
        )
        db.add(db_parking_photo)
    
    db.commit()
    return db_parking_lot

# Get parking lot by ID
def get_parking_lot(db: Session, parking_lot_id: int):
    return db.query(ParkingLot).filter(ParkingLot.id == parking_lot_id).first()

# Get all parking lots
def get_parking_lots(db: Session, skip: int = 0, limit: int = 10):
    return db.query(ParkingLot).offset(skip).limit(limit).all()


def add_parking_history(db: Session, parkinghistory:ParkingHistoryBase):
    db_parking_history = ParkingHistory(
        user_id = parkinghistory.user_id,
        parking_lot_id = parkinghistory.parking_lot_id,
        entry_time = parkinghistory.entry_time,
        exit_time = parkinghistory.exit_time
    )
    db.add(db_parking_history)
    db.commit()
    db.refresh(db_parking_history)
    return db_parking_history

# Get parking history for a user
def get_parking_history(db: Session, user_id: int):
    return db.query(ParkingHistory).filter(ParkingHistory.user_id == user_id).all()

def getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the earth in km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = (
        math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
        math.sin(dLon / 2) * math.sin(dLon / 2)
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = R * c  # Distance in km
    return d

router = APIRouter(
    prefix="/parking",
    tags=["Parking"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new parking lot
@router.post("/create-lot")
def create_new_parking_lot(parking_lot: ParkingLotBase, db: Session = Depends(get_db)):
    return create_parking_lot(db=db, parking_lot=parking_lot)

# Get parking lot by ID
@router.get("/get-lot-by-id/{parking_lot_id}")
def read_parking_lot(parking_lot_id: int, db: Session = Depends(get_db)):
    db_parking_lot = get_parking_lot(db, parking_lot_id=parking_lot_id)
    if db_parking_lot is None:
        raise HTTPException(status_code=404, detail="Parking lot not found")
    return db_parking_lot

# Get all parking lots
@router.get("/get-lots")
def read_parking_lots(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    parking_lots = get_parking_lots(db, skip=skip, limit=limit)
    return parking_lots

# Add parking history
@router.post("/create-parking-history", response_model=ParkingHistoryBase)
def create_parking_history(parking_history: ParkingHistoryBase, db: Session = Depends(get_db)):
    return add_parking_history(db=db, parkinghistory=parking_history)

# Get parking history for a user
@router.get("/get-parking-history/{user_id}", response_model=list[ParkingHistoryBase])
def read_parking_history(user_id: int, db: Session = Depends(get_db)):
    history = get_parking_history(db, user_id=user_id)
    return history

# Get parkings by latitude and longitude within a specified range
@router.get("/get-parking-by-lat-long")
def getParkingByLatLong(latitude: float, longitude: float, range_km: float, db: Session = Depends(get_db)):
    # Get all parking lots
    parking_lots = db.query(ParkingLot).all()

    # Filter parking lots by distance
    nearby_parking_lots = []
    for lot in parking_lots:
        distance = getDistanceFromLatLonInKm(latitude, longitude, lot.latitude, lot.longitude)
        if distance <= range_km:
            nearby_parking_lots.append(lot)
    
    if not nearby_parking_lots:
        raise HTTPException(status_code=404, detail="No parking lots found within the specified range.")
    
    return nearby_parking_lots