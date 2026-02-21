from pydantic import BaseModel

class TripCreate(BaseModel):
    vehicle_id: int
    driver_id: int
    origin: str
    destination: str
    cargo_weight: float
    fuel_estimate: float
    status: str

class TripResponse(TripCreate):
    id: int

    class Config:
        from_attributes = True