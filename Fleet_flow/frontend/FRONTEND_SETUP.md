# Frontend - Backend Integration Guide

## Overview
This guide explains how the FleetFlow frontend integrates with the FastAPI backend using Axios, React hooks, and TypeScript for type safety.

---

## Frontend Setup

### Environment Configuration

**File: `.env.local`**
```
VITE_API_URL=http://127.0.0.1:8000
```

For production, create a `.env.production`:
```
VITE_API_URL=https://api.yourdomain.com
```

### Folder Structure

```
frontend/src/
├── api/
│   ├── client.ts              # Axios instance with interceptors
│   └── services/
│       ├── index.ts           # Export service functions
│       ├── vehicleService.ts  # Vehicle API functions
│       ├── driverService.ts   # (Create similar for other entities)
│       ├── tripService.ts
│       ├── maintenanceService.ts
│       └── expenseService.ts
├── hooks/
│   ├── use-mobile.tsx         # (Existing)
│   ├── use-toast.ts           # (Existing)
│   └── useFetchVehicles.ts    # Custom fetch hook
├── components/
│   ├── VehiclesList.tsx       # Main vehicle component
│   └── ... (other components)
├── pages/
│   └── ... (page components)
└── App.tsx
```

---

## How It Works

### 1. API Client (`api/client.ts`)
- Creates a centralized Axios instance
- Reads `VITE_API_URL` from environment
- Adds request/response interceptors
- Handles errors globally

**Features:**
- Request timeout: 10 seconds
- Response error handling for 401, 403, 404, 500 errors
- Ready for JWT token injection in headers

### 2. Service Layer (`api/services/vehicleService.ts`)
- Contains all API function calls
- Full TypeScript typing (Vehicle, VehicleCreate)
- Try-catch error handling in each function
- Consistent error logging

**Example:**
```typescript
import { vehicleService } from "../api/services";

// Get all vehicles
const vehicles = await vehicleService.getVehicles();

// Add a vehicle
const newVehicle = await vehicleService.addVehicle({
  plate: "ABC-123",
  model: "Volvo FH16",
  type: "Truck",
  capacity: 20000,
  odometer: 0,
  status: "Active"
});

// Delete a vehicle
await vehicleService.deleteVehicle(1);
```

### 3. Custom Hook (`hooks/useFetchVehicles.ts`)
- Manages loading, error, and data states
- Automatically fetches data on component mount
- Provides `refetch()` function to reload data
- Handles Axios errors gracefully

**Example:**
```typescript
import { useFetchVehicles } from "../hooks/useFetchVehicles";

const { vehicles, loading, error, refetch } = useFetchVehicles();
```

### 4. Component Integration (`components/VehiclesList.tsx`)
- Displays vehicle list with Tailwind styling
- Form to add new vehicles
- Button to delete vehicles
- Shows loading spinner
- Shows error messages with retry button
- Empty state when no vehicles

---

## Backend Configuration (Already Done ✓)

**File: `backend/app/main.py`**

CORS is already configured:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite frontend
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This allows:
- All HTTP methods (GET, POST, PUT, DELETE, etc.)
- All headers
- Credentials in requests
- Requests from Vite frontend on port 5173

---

## Installation & Running

### 1. Frontend Dependencies
```bash
cd frontend
npm install axios
npm run dev
```

The frontend will run on: `http://localhost:5173`

### 2. Backend
```bash
cd backend
# Activate venv
source venv/bin/activate  # Unix/Mac
# or
.venv\Scripts\Activate.ps1  # PowerShell (Windows)

# Run backend
uvicorn app.main:app --reload
```

The backend will run on: `http://127.0.0.1:8000`

---

## Error Handling

### Backend Errors (Caught by Axios Interceptor)
The client automatically handles these:
- **401**: "Unauthorized - please log in"
- **403**: "Forbidden - you don't have permission"
- **404**: "Resource not found"
- **500**: "Server error - please try again later"
- **Network errors**: "Failed to [operation]"

### Component-Level Error Handling
In `VehiclesList.tsx`:
```typescript
try {
  await vehicleService.addVehicle(formData);
  await refetch(); // Reload list
} catch (err) {
  setAddError("Failed to add vehicle");
}
```

---

## Creating Similar Services

To create a service for another entity (e.g., Drivers):

**File: `api/services/driverService.ts`**
```typescript
import apiClient from "../client";

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  expiry_date: string;
  status: string;
}

export const driverService = {
  async getDrivers() {
    const response = await apiClient.get<Driver[]>("/drivers");
    return response.data;
  },
  // ... other methods
};
```

**File: `api/services/index.ts`** (Update export)
```typescript
export { driverService, type Driver } from "./driverService";
```

---

## CORS Troubleshooting

If you see CORS errors:

1. **Check backend is running:**
   ```
   curl http://127.0.0.1:8000/health
   ```

2. **Check frontend `.env.local`:**
   - API_URL must match backend URL
   - No trailing slash

3. **Check browser console:**
   - Look for "Access-Control-Allow-Origin" errors
   - Usually means CORS middleware not configured

4. **Update backend CORS if needed:**
   ```python
   allow_origins=[
       "http://localhost:5173",
       "http://127.0.0.1:5173",
       "http://localhost:3000",  # Add more origins here
   ]
   ```

---

## Common Issues

### Issue 1: Network Error - Connection Refused
**Solution:** Make sure backend is running on port 8000

### Issue 2: CORS Error
**Solution:** Check `allow_origins` in backend `main.py`

### Issue 3: "Cannot GET /vehicles"
**Solution:** Make sure backend router is included in `main.py`

### Issue 4: Environment variable not loading
**Solution:** 
- File must be named `.env.local`
- Restart frontend dev server after creating file
- Use `import.meta.env.VITE_*` syntax

---

## Performance Tips

1. **Debounce search/filter inputs** (add 300ms delay)
2. **Implement pagination** (load 10-20 items per page)
3. **Cache responses** using React Query or SWR
4. **Lazy load components** using React.lazy()
5. **Compress large responses** on backend

---

## Next Steps

1. Create similar services for: Driver, Trip, Maintenance, Expense
2. Create custom hooks like `useFetchVehicles` for each entity
3. Create components for each page
4. Add authentication (JWT tokens)
5. Implement React Router for navigation
6. Add form validation using React Hook Form + Zod

---

## API Endpoints Reference

### Vehicles
- `GET /vehicles` - List all vehicles
- `POST /vehicles` - Create vehicle
- `PUT /vehicles/{id}` - Update vehicle
- `DELETE /vehicles/{id}` - Delete vehicle

### Drivers
- `GET /drivers` - List all drivers
- `POST /drivers` - Create driver

### Trips
- `GET /trips` - List all trips
- `POST /trips` - Create trip

### Maintenance
- `GET /maintenance` - List maintenance records
- `POST /maintenance` - Create maintenance record

### Expenses
- `GET /expenses` - List expenses
- `POST /expenses` - Create expense

### Analytics
- `GET /analytics/total-fuel-cost` - Get total fuel costs

---

## Files Created

✓ `src/api/client.ts` - Axios configuration
✓ `src/api/services/vehicleService.ts` - Vehicle API functions  
✓ `src/api/services/index.ts` - Service exports
✓ `src/hooks/useFetchVehicles.ts` - Custom fetch hook
✓ `src/components/VehiclesList.tsx` - Vehicle component
✓ `.env.example` - Environment template
✓ `.env.local` - Local development config
