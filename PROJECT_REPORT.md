# AgriSmart – AI Crop Yield Prediction (Comprehensive Project Report)

This report consolidates the project’s purpose, architecture, key features, API contracts, configuration, model behavior, testing results, deployment notes, and next steps.

## 1. Overview
- Purpose: Help farmers and stakeholders estimate crop yield, analyze soil and weather metrics, and get actionable recommendations.
- Stack:
  - Backend: FastAPI, Supabase, scikit-learn/RandomForest, optional TensorFlow deps.
  - Frontend: Vite + Tailwind (SPA, static build).
  - Services: Weather, Soil Health, Crop Recommendation, Yield Prediction.
- Status: Backend servers are running and endpoints verified. Model path resolution improved; heuristic fallback available.

## 2. Architecture
- Backend (`backend/app`):
  - Routers: `auth.py`, `dashboard.py`, `soil_health.py`, `crop_prediction.py`, `weather.py`.
  - Services: `new_yield_prediction.py`, `weather_service.py`, `environmental_monitoring_service.py`, others.
  - Models folder: joblib models (`backend/models`).
  - Supabase client: Initialized via `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Frontend (`frontend`):
  - Vite project with Tailwind CSS; consumes APIs from backend.
- ML Models:
  - Trained RandomForest crop yield and crop recommender models (joblib).
  - Heuristic fallback for yield estimation when models are missing.

## 3. Configuration
Environment variables used:
- Supabase:
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (backend auth & storage).
- External APIs:
  - `OPENWEATHERMAP_API_KEY` (weather_service), `GEOAPIFY_API_KEY` (location_service). Optional but recommended.
- Yield Prediction (new additions):
  - `YIELD_FALLBACK_MODE`: `auto` (default), `always`, `never`.
    - `auto`: Use trained model if found; fallback to heuristic otherwise.
    - `always`: Always use heuristic; skip model load.
    - `never`: Require trained model; logs error if unavailable.
  - `YIELD_MODEL_PATH`: Absolute path to `yield_prediction_model.joblib`.
  - `HEURISTIC_CONFIDENCE_BASE`: integer-like value used by the heuristic test endpoint (default `75`).

## 4. API Endpoints (Key)
All routes are under `/api` unless noted.

### Auth
- `POST /api/auth/register`
  - Request: `{ email, password, full_name, phone, lat, lon, region }`
  - Creates user in Supabase, hashes password, geocodes location, returns `TokenResponse` with `access_token` and user profile.
- `POST /api/auth/login`
  - Request: `{ email, password }`
  - Returns `TokenResponse` with `access_token` and user profile.
- `GET /api/auth/me` (Bearer token)
  - Returns current authenticated user details.

### Dashboard – Yield Prediction
- `POST /api/dashboard/yield-prediction` (Bearer token)
  - Request (pydantic `YieldPredictionRequest`): `{ state: str, district: str, crop: str, year: str, season: str, area: float }`
  - Behavior:
    - Uses RandomForest/new model service if available.
    - Falls back to heuristic if model not available or dataset missing.
    - Returns normalized yield, total production, confidence, category, factors analysis, and recommendations.
- `POST /api/dashboard/yield-prediction-test` (Unauthenticated)
  - Same request shape as above.
  - Deterministic heuristic fallback without external dataset.

### Soil & Crop
- `POST /api/soil-health/analyze`
  - Request: soil metrics (N/P/K, pH, organic matter, moisture, temperature).
  - Returns soil score, status, and recommendations.
- `POST /api/crop-prediction/recommend`
  - Request: soil, weather, crop context; returns top crop recommendations.

### Weather
- `GET /api/weather/current?lat=<>&lon=<>`
  - Returns current weather metrics for coordinates.

### Not Implemented/404 (observed)
- `/predict/pest-risk`, `/predict/rainfall` (non-`/api` paths) returned 404; either not implemented or legacy paths.

## 5. Data Models
- `YieldPredictionRequest` (dashboard.py):
  - `state: str`, `district: str`, `crop: str`, `year: str`, `season: str`, `area: float`.
- `UserRegistration` (auth.py):
  - `email, password, full_name, phone, lat, lon, region`.
- `TokenResponse` (auth.py):
  - Includes `access_token` and user profile fields (`id, email, full_name, phone, lat, lon, region, created_at, is_active`).

## 6. Model Behavior & Fallbacks
- Trained model loading:
  - Primary location: `backend/models/yield_prediction_model.joblib`.
  - Path resolution checks env override, common relative paths, and repo-wide glob.
- Heuristic fallback (`HeuristicYieldModel`):
  - Computes yield using crop- and season-aware factors.
  - Confidence defaults to `HEURISTIC_CONFIDENCE_BASE`.
  - Avoids external dataset dependency.

## 7. Testing & Verification
- Auth flow:
  - Register, login, and `me` successfully return tokens and user data.
- Unauthenticated Yield Test:
  - Example (`Wheat`, `Maharashtra`, `Rabi`, `area=2.5`): yield ≈ `3.04 t/ha`, total ≈ `7.6 t`, confidence `75`, category `Medium`.
- Authenticated Yield Prediction:
  - Same payload returns yield ≈ `3.8–3.81 t/ha`, total ≈ `9.51–9.53 t`, confidence `95`, category `Medium`, with metadata.
- Weather:
  - Current weather endpoint returns structured metrics.
- Soil Health & Crop Recommendation:
  - Soil analysis returns score and status; crop recommendations return top suggestions.

## 8. Deployment & Running
- Development server:
  - `uvicorn app.main:app --reload --port 8000` (backend root).
- Alternative servers used during testing:
  - `8002` and `8003` were used for iterative tests; prefer consolidating to `8000` now.
- Docker & Compose:
  - See `DEPLOYMENT.md` and `backend/docker-compose.yml` for containerized setup.
- Requirements:
  - `backend/requirements.txt`.

## 9. Known Issues & Warnings
- Missing API Keys:
  - Geoapify and OpenWeatherMap keys not set. Add to environment or `.env` to maximize features.
- Legacy Routes:
  - `/predict/pest-risk` and `/predict/rainfall` return 404; should be implemented or updated to `/api` routes.
- Dataset dependency:
  - Fallback logic removes dependence on missing CSV. Trained model still preferred if path is available.

## 10. Recommendations & Next Steps
- Implement the missing pest and rainfall prediction routes under `/api`.
- Tune heuristic factors by crop/state/season to align with empirical ranges.
- Add a response flag indicating when heuristic fallback is used, for UI transparency.
- Restore or update trained model path and set `YIELD_FALLBACK_MODE='never'` to validate trained model predictions.
- Add unit tests for the yield endpoints and services.

---

Last updated: {auto-generated}