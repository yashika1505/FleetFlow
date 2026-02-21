"""Pydantic schema package.

Avoid wildcard exports to reduce import side effects and circular chains.
"""

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .vehicle import VehicleCreate, VehicleResponse
    from .driver import DriverCreate, DriverResponse
    from .trip import TripCreate, TripResponse
    from .maintenance import MaintenanceCreate, MaintenanceResponse
    from .expense import ExpenseCreate, ExpenseResponse

__all__ = [
    "VehicleCreate",
    "VehicleResponse",
    "DriverCreate",
    "DriverResponse",
    "TripCreate",
    "TripResponse",
    "MaintenanceCreate",
    "MaintenanceResponse",
    "ExpenseCreate",
    "ExpenseResponse",
]