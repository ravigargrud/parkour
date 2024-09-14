from typing import List
from fastapi import APIRouter, Depends, HTTPException
from dataModel import ParkingLotBase, ParkingHistoryBase
from databaseConnection import SessionLocal
from sqlalchemy.orm import Session
from databaseSchema import ParkingLot, ParkingHistory

def create_parking_lot(db: Session, parking_lot: ParkingLotBase):
    db_parking_lot = ParkingLot(
        unique_parking_id=parking_lot.unique_parking_id,
        address=parking_lot.address,
        contact_no=parking_lot.contact_no,
        scooter_cost_per_hour=parking_lot.scooter_cost_per_hour,
        car_cost_per_hour=parking_lot.car_cost_per_hour,
        total_capacity=parking_lot.total_capacity,
        currently_occupied=parking_lot.currently_occupied
    )
    db.add(db_parking_lot)  
    db.commit()
    db.refresh(db_parking_lot)
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
@router.post("/create-lot", response_model=ParkingLotBase)
def create_new_parking_lot(parking_lot: ParkingLotBase, db: Session = Depends(get_db)):
    return create_parking_lot(db=db, parking_lot=parking_lot)

# Get parking lot by ID
@router.get("/get-lot-by-id/{parking_lot_id}", response_model=ParkingLotBase)
def read_parking_lot(parking_lot_id: int, db: Session = Depends(get_db)):
    db_parking_lot = get_parking_lot(db, parking_lot_id=parking_lot_id)
    if db_parking_lot is None:
        raise HTTPException(status_code=404, detail="Parking lot not found")
    return db_parking_lot

# Get all parking lots
@router.get("/get-lots", response_model=list[ParkingLotBase])
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