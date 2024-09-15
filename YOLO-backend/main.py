from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.userbase import router as userbaseRoute
from routes.parkings import router as parkingRoute
from routes.machineLearning import router as mlRoute
from routes.dynamicPricing import router as dpRoute
from databaseConnection import engine, Base


app = FastAPI(
    title="Parkour",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine) # Create the tables in the database

app.include_router(userbaseRoute)
app.include_router(parkingRoute)
app.include_router(mlRoute)
app.include_router(dpRoute)

@app.get("/")
def home():
    return {"hello": "world"}

