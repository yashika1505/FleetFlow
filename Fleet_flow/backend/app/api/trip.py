from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.trip import TripCreate, TripResponse
from app.crud.trip import create_trip, get_trips

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("/", response_model=TripResponse)
def add_trip(trip: TripCreate, db: Session = Depends(get_db)):
    return create_trip(db, trip)

@router.get("/", response_model=list[TripResponse])
def read_trips(db: Session = Depends(get_db)):
    return get_trips(db)