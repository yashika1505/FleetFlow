from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.driver import DriverCreate, DriverResponse
from app.crud.driver import create_driver, get_drivers

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.post("/", response_model=DriverResponse)
def add_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    return create_driver(db, driver)

@router.get("/", response_model=list[DriverResponse])
def read_drivers(db: Session = Depends(get_db)):
    return get_drivers(db)