from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.schemas.trip import TripCreate
import logging

logger = logging.getLogger(__name__)

def create_trip(db: Session, trip: TripCreate):
    """
    Create a new trip with validation of foreign key constraints.
    
    Raises:
        ValueError: If vehicle_id or driver_id don't exist, or other validation issues
        SQLAlchemyError: For database errors
    """
    try:
        # Validate that vehicle exists
        vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
        if not vehicle:
            logger.warning(f"Vehicle not found: vehicle_id={trip.vehicle_id}")
            raise ValueError(f"Vehicle with ID {trip.vehicle_id} not found")
        
        # Validate that driver exists
        driver = db.query(Driver).filter(Driver.id == trip.driver_id).first()
        if not driver:
            logger.warning(f"Driver not found: driver_id={trip.driver_id}")
            raise ValueError(f"Driver with ID {trip.driver_id} not found")
        
        # Create trip
        db_trip = Trip(**trip.dict())
        db.add(db_trip)
        db.commit()
        db.refresh(db_trip)
        logger.info(f"Trip created: id={db_trip.id}, vehicle_id={trip.vehicle_id}, driver_id={trip.driver_id}")
        return db_trip
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error creating trip: {str(e)}")
        raise ValueError("Foreign key constraint violation: Check that vehicle_id and driver_id exist")
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating trip: {str(e)}")
        raise ValueError(f"Database error: {str(e)}")

def get_trips(db: Session):
    """Get all trips."""
    try:
        trips = db.query(Trip).all()
        logger.info(f"Retrieved {len(trips)} trips")
        return trips
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching trips: {str(e)}")
        raise ValueError(f"Database error: {str(e)}")