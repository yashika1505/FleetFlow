"""SQLAlchemy model package.

Keep this module lightweight to avoid circular imports during app startup.
"""

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .vehicle import Vehicle
    from .driver import Driver
    from .trip import Trip
    from .maintenance import Maintenance
    from .expense import Expense

__all__ = ["Vehicle", "Driver", "Trip", "Maintenance", "Expense"]