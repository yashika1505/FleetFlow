from pydantic import BaseModel

class VehicleCreate(BaseModel):
    plate: str
    model: str
    type: str
    capacity: float
    odometer: float
    status: str

class VehicleResponse(VehicleCreate):
    id: int

    class Config:
        from_attributes = True