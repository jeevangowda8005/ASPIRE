# ASPIRE — GitHub Copilot Instructions

This file is automatically read by GitHub Copilot in VS Code.
It gives Copilot full context about this project so every suggestion
is accurate and consistent with the existing codebase.

## Project overview
ASPIRE is a full-stack student wellness app:
- Academic Stress Prediction & Intervention Recommendation Engine
- Built as an IDP project at BMSIT&M, AI&ML department, VTU

## Tech stack

### Backend (Python)
- FastAPI 0.138+ with uvicorn
- SQLAlchemy 2.x + SQLite (dev) / PostgreSQL (prod)
- Pydantic v2 (use model_validate, not from_orm)
- JWT auth via python-jose, passwords via passlib + bcrypt==4.0.1
- ML: scikit-learn RandomForestClassifier + XGBClassifier soft VotingClassifier
- NLP: vaderSentiment SentimentIntensityAnalyzer
- SMOTE from imbalanced-learn for class balancing

### Frontend (JavaScript)
- React 18 + Vite + Tailwind CSS
- React Router v6 (use useNavigate, not useHistory)
- Axios for API calls (baseURL from import.meta.env.VITE_API_URL)
- Recharts for the stress trend line chart
- lucide-react for all icons

## Critical rules Copilot must follow

### Never suggest these (already fixed bugs — do not reintroduce):
- `bcrypt` version other than 4.0.1 — newer versions break passlib
- `extracurricular_activity` (singular) — must be `extracurricular_activities`
- `from_orm()` — use `model_validate()` in Pydantic v2
- `allow_origins=["*"]` in production CORS — use specific domains
- Trailing slash in VITE_API_URL environment variable
- `venv/Scripts/activate` on Mac — use `venv/bin/activate`

### Always do this:
- Truncate passwords to 72 bytes before bcrypt hashing
- Use `Optional[str]` not `str | None` for Python < 3.10 compatibility
- Import React explicitly: `import React from 'react'`
- Use Tailwind custom colours: `cream`, `ink`, `peach`, `mint`, `skyBlue`, `lilac`, `rose`
- All API endpoints are prefixed with `/api/`
- Protected routes use the `ProtectedRoute` wrapper component

## File structure
```
aspire/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app, CORS, router registration
│   │   ├── auth.py           # JWT + bcrypt (bcrypt==4.0.1 pinned)
│   │   ├── database.py       # SQLAlchemy engine + session
│   │   ├── models.py         # ORM: User, Checkin, Recommendation
│   │   ├── schemas.py        # Pydantic v2 schemas
│   │   ├── routers/
│   │   │   ├── auth_router.py       # /api/auth/register, /login, /me
│   │   │   └── assessment_router.py # /api/checkins, /dashboard, /history
│   │   ├── services/
│   │   │   ├── scoring_service.py       # hybrid rule-based + ML scoring
│   │   │   ├── nlp_service.py           # VADER sentiment
│   │   │   ├── recommendation_service.py # action plan card generator
│   │   │   └── summary_service.py       # AI summary paragraph
│   │   └── ml/
│   │       └── train_model.py  # RF + XGBoost ensemble training
│   ├── data/                   # StressLevelDataset.csv goes here
│   ├── models/                 # trained .joblib artifacts saved here
│   ├── tests/
│   │   └── test_api.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx             # BrowserRouter + ProtectedRoute
        ├── pages/              # Landing, Login, Register, Assessment, Dashboard, History
        ├── components/         # Navbar, UI (Card/Badge/Button), Slider
        ├── context/            # AuthContext (user, login, register, logout)
        └── lib/
            └── api.js          # axios instance + authApi + assessmentApi
```

## API contract
```
POST /api/auth/register   { name, email, password, university? } → Token + User
POST /api/auth/login      { email, password }                    → Token + User
GET  /api/auth/me         (Bearer token)                         → User
POST /api/checkins        (Bearer token) + CheckinCreate         → CheckinOut
GET  /api/dashboard       (Bearer token)                         → DashboardOut
GET  /api/history         (Bearer token)                         → CheckinOut[]
GET  /api/health                                                 → health status
```

## Deployment
- Frontend: Vercel (auto-deploys on git push to main)
- Backend: Render (auto-deploys on git push to main)
- Render backend URL: https://aspire-gkl3.onrender.com
- Git branch: main
