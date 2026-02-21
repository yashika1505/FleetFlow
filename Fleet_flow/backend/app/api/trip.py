from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.trip import TripCreate, TripResponse
from app.crud.trip import create_trip, get_trips
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def add_trip(trip: TripCreate, db: Session = Depends(get_db)):
    """
    Create a new trip.
    
    Requires:
    - vehicle_id: Must exist in vehicles table
    - driver_id: Must exist in drivers table
    - origin, destination: Non-empty strings
    - cargo_weight, fuel_estimate: Positive numbers
    - status: Trip status (Pending, In Transit, Completed, etc.)
    
    Returns:
    - 201 Created: Trip successfully created
    - 400 Bad Request: Validation error or foreign key not found
    - 500 Internal Server Error: Unexpected database error
    """
    try:
        return create_trip(db, trip)
    except ValueError as e:
        logger.warning(f"Validation error creating trip: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating trip: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create trip: {str(e)}"
        )

@router.get("/", response_model=list[TripResponse])
def read_trips(db: Session = Depends(get_db)):
    """
    Get all trips.
    
    Returns:
    - 200 OK: List of all trips (empty list if none exist)
    - 500 Internal Server Error: Database error
    """
    try:
        return get_trips(db)
    except ValueError as e:
        logger.error(f"Error fetching trips: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )