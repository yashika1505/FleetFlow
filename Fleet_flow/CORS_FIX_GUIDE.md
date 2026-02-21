# CORS & Origin Mismatch Fix Guide

## The Problem: `localhost` vs `127.0.0.1`

### Why They're Different in CORS

CORS (Cross-Origin Resource Sharing) checks the **exact origin**: `protocol + hostname + port`

```
http://localhost:8080      ← Frontend URL in browser
http://127.0.0.1:8000      ← Backend API URL in code
                           ↓ DIFFERENT HOSTNAMES!
```

**Browser sees**:
- Frontend origin: `http://localhost:8080` (what you type in address bar)
- API request to: `http://127.0.0.1:8000` (different hostname)
- **Result**: CORS blocks it! ❌

### The Solution: Use Consistent Hostname

**Option 1: Both use `localhost` (Recommended)** ✅
```
Frontend: http://localhost:8080
Backend:  http://localhost:8000
          (same hostname, different port is OK)
```

**Option 2: Both use `127.0.0.1` (Not recommended)**
```
Frontend: http://127.0.0.1:8080
Backend:  http://127.0.0.1:8000
```

Why Option 1? Because `localhost` is the standard hostname for local development.

---

## Changes Made

### 1. Backend: `app/main.py`
Updated CORS to handle both hostnames (for compatibility) with clear comments:
```python
ALLOWED_ORIGINS = [
    "http://localhost:8080",      # ← Frontend dev server
    "http://localhost:3000",      # ← Also support other ports
    "http://127.0.0.1:8080",      # ← Fallback (shouldn't be needed)
]
```

Added **environment-based configuration**:
```python
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

if ENVIRONMENT == "production":
    ALLOWED_ORIGINS = ["https://yourdomain.com"]
else:
    ALLOWED_ORIGINS = [...]  # dev origins
```

### 2. Frontend: `src/api/client.ts`
Changed from:
```typescript
baseURL: "http://127.0.0.1:8000"  // ❌ Mismatch!
```

To:
```typescript
baseURL: "http://localhost:8000"   // ✅ Consistent!
```

Added better error logging:
```typescript
console.error("Is backend running? Check http://localhost:8000/health")
```

### 3. Frontend: `.env`
```
VITE_API_URL=http://localhost:8000
```

Now configurable without editing code!

---

## How to Verify the Fix Works

### Step 1: Restart Backend
```powershell
cd d:\fleet_flow\Fleet_flow\backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Must show:**
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 2: Restart Frontend
```powershell
cd d:\fleet_flow\Fleet_flow\frontend
npm run dev
```

**Must show:**
```
VITE v5.x.x ready in Xms
Local: http://localhost:8080/
```

### Step 3: Test in Browser
1. Open `http://localhost:8080` (NOT `http://127.0.0.1:8080`)
2. Open DevTools (F12)
3. Go to **Network** tab
4. Try an action that creates/updates data
5. Click the failed request
6. Look for response headers (should see):
   ```
   access-control-allow-origin: http://localhost:8080
   access-control-allow-credentials: true
   ```

### Step 4: Check Console
Should see logs like:
```
[API] POST http://localhost:8000/expenses
[API] Response: 201 Created
```

NOT:
```
[API Network Error]
```

---

## CORS Headers Explained

**CORS Response Headers** (sent by backend):
```
access-control-allow-origin: http://localhost:8080
  ↓ "I allow requests from this origin"

access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
  ↓ "These HTTP methods are allowed"

access-control-allow-headers: *
  ↓ "Any headers are allowed"

access-control-allow-credentials: true
  ↓ "Allow cookies/auth in cross-origin requests"
```

---

## Production Setup

### Backend Production (`main.py`)
```python
ENVIRONMENT = "production"

ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

**Run with:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Production (`.env`)
```
VITE_API_URL=https://yourdomain.com/api
```

**Or use same domain (no CORS needed)**:
```
VITE_API_URL=/api
```
Then proxy requests in nginx/Apache to backend.

---

## Debugging Checklist

- [ ] Frontend running on `http://localhost:8080`
- [ ] Backend running on `http://localhost:8000` (or consistent hostname)
- [ ] Backend `.env` or code has `ENVIRONMENT=development`
- [ ] Backend CORS has `http://localhost:8080` in allow_origins
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:8000`
- [ ] Cache cleared (Ctrl+Shift+R)
- [ ] Backend restarted after code changes
- [ ] Frontend dev server restarted after .env changes

---

## Common Errors & Solutions

### Error: "No 'Access-Control-Allow-Origin' header"
**Cause**: CORS headers not sent
**Fix**: Backend CORS middleware not applied, or hostname mismatch
**Check**: 
```powershell
# Test backend returns CORS headers
$response = Invoke-WebRequest -Uri "http://localhost:8000/health" `
  -Headers @{'Origin'='http://localhost:8080'} -UseBasicParsing
$response.Headers['access-control-allow-origin']
# Should show: http://localhost:8080
```

### Error: "ERR_FAILED" / "Network Error"
**Cause**: Can't reach backend at all
**Fix**: Backend not running or wrong URL
**Check**:
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
# Should show: StatusCode 200
```

### Error: "Cannot find module axios"
**Cause**: Axios not installed
**Fix**:
```powershell
cd frontend && npm install axios
```

---

## Files Modified

1. **Backend CORS Configuration**: `app/main.py` (lines 1-57)
   - Added environment-based CORS
   - Added clear documentation
   - Consolidated localhost and 127.0.0.1

2. **Frontend API Client**: `src/api/client.ts`
   - Changed `127.0.0.1` → `localhost`
   - Added better error logging
   - Added development logging

3. **Frontend Configuration**: `.env`
   - Easy to change API URL without edit code
   - Production-ready format

4. **Documentation**: `.env.example`, `.env`, this file
   - Clear setup instructions
   - Production configuration guide

---

## Summary

**The Fix**: Use `http://localhost:8000` (not `127.0.0.1`) in frontend when accessing backend from `http://localhost:8080` browser URL.

**Why**: CORS treats `localhost` and `127.0.0.1` as different origins. Browsers block requests between different origins unless backend explicitly allows it.

**Verification**: Check DevTools Network tab - CORS header should be present.

**Next Steps**: After restarting frontend/backend, CORS errors should be gone and all CRUD operations should work.
