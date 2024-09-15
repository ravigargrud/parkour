from fastapi import APIRouter, Depends
import numpy as np
from sklearn.cluster import KMeans
from sqlalchemy.orm import Session
from databaseConnection import SessionLocal
from databaseSchema import ParkingLot


router = APIRouter(
    prefix="/dynamicpricing",
    tags=["Dynamic Pricing"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Assuming you have ParkingLot data with necessary fields
def get_parking_lot_data(db: Session):
    # Retrieve all parking lots
    parking_lots = db.query(ParkingLot).all()
    
    # Extract relevant features for clustering (occupancy rate, pricing, location)
    data = np.array([[lot.currently_occupied / lot.total_capacity, lot.scooter_cost_per_hour, 
                      lot.car_cost_per_hour, lot.latitude, lot.longitude] 
                     for lot in parking_lots])
    
    return data, parking_lots

# Step 1: Perform K-Means Clustering
def cluster_parking_lots(db: Session, n_clusters: int = 5):
    data, parking_lots = get_parking_lot_data(db)
    
    # Apply KMeans clustering
    kmeans = KMeans(n_clusters=n_clusters)
    kmeans.fit(data)
    
    # Get cluster assignments
    clusters = kmeans.labels_
    
    return clusters, parking_lots

# Step 2: Analyze Occupancy in Each Cluster
def get_cluster_occupancy(db: Session, clusters, parking_lots):
    cluster_occupancy = {}
    
    for cluster_id in np.unique(clusters):
        # Filter parking lots that belong to the current cluster
        cluster_lots = [lot for idx, lot in enumerate(parking_lots) if clusters[idx] == cluster_id]
        
        # Calculate average occupancy for this cluster
        avg_occupancy = np.mean([lot.currently_occupied / lot.total_capacity for lot in cluster_lots])
        cluster_occupancy[cluster_id] = avg_occupancy
    
    return cluster_occupancy

# Step 3: Calculate the Price Increase
def calculate_parking_price_adjustments(db: Session, clusters, parking_lots, cluster_occupancy, threshold=0.8, increase_percentage=10):
    price_adjustments = []

    for cluster_id in cluster_occupancy:
        for idx, lot in enumerate(parking_lots):
            if clusters[idx] == cluster_id:
                adjustment = 0
                if cluster_occupancy[cluster_id] > threshold:  # High occupancy, suggest a price increase
                    adjustment = increase_percentage
                elif cluster_occupancy[cluster_id] < (1 - threshold):  # Low occupancy, suggest a price decrease (optional)
                    adjustment = -increase_percentage

                # Collect parking lot and price adjustment data
                price_adjustments.append({
                    "parking_lot_id": lot.id,
                    "latitude": lot.latitude,
                    "longitude": lot.longitude,
                    "current_scooter_cost_per_hour": lot.scooter_cost_per_hour,
                    "current_car_cost_per_hour": lot.car_cost_per_hour,
                    "suggested_scooter_cost_per_hour": lot.scooter_cost_per_hour * (1 + adjustment / 100),
                    "suggested_car_cost_per_hour": lot.car_cost_per_hour * (1 + adjustment / 100),
                    "adjustment_percentage": adjustment
                })

    return price_adjustments

# Main function to execute the dynamic pricing strategy and return adjustments
def dynamic_pricing_with_adjustments(db: Session):
    clusters, parking_lots = cluster_parking_lots(db)
    cluster_occupancy = get_cluster_occupancy(db, clusters, parking_lots)
    price_adjustments = calculate_parking_price_adjustments(db, clusters, parking_lots, cluster_occupancy)
    return price_adjustments

@router.get("/get-price-adjustments")
def get_price_adjustments(db: Session = Depends(get_db)):
    price_adjustments = dynamic_pricing_with_adjustments(db)
    return price_adjustments
