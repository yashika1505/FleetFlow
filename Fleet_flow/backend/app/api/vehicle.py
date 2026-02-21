from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.vehicle import VehicleCreate, VehicleResponse
from app.crud.vehicle import create_vehicle, get_vehicles

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.post("/", response_model=VehicleResponse)
def add_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    return create_vehicle(db, vehicle)

@router.get("/", response_model=list[VehicleResponse])
def read_vehicles(db: Session = Depends(get_db)):
    return get_vehicles(db)