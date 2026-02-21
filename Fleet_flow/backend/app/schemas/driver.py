from pydantic import BaseModel

class DriverCreate(BaseModel):
    name: str
    license_number: str
    expiry_date: str
    status: str

class DriverResponse(DriverCreate):
    id: int

    class Config:
        from_attributes = True