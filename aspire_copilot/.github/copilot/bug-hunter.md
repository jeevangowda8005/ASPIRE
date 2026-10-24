# Bug Hunter — Copilot Chat Prompt

## How to use
Open Copilot Chat in VS Code (Ctrl+Shift+I or Cmd+Shift+I),
then paste any of the prompts below.

---

## Full project bug scan
```
@workspace Review the entire ASPIRE codebase and find all bugs.
For each bug report:
1. File path and line number
2. What the bug is
3. Severity: breaking / non-breaking
4. The exact fix

Focus on:
- Backend: FastAPI route errors, Pydantic v2 misuse, SQLAlchemy issues, CORS problems
- Frontend: Axios error handling, missing auth headers, broken routes
- ML pipeline: feature column name mismatches, joblib loading errors
- Auth: bcrypt version issues, JWT expiry, password validation
```

## Backend-only scan
```
@workspace Scan only the backend/ folder for bugs.
Check:
- All imports resolve correctly
- Pydantic schemas use model_validate() not from_orm()
- bcrypt is pinned to 4.0.1 in requirements.txt
- Password hashing truncates to 72 bytes before hashing
- CORS allow_origins lists the correct Vercel domain
- ML model joblib files are loaded with error handling
- All API endpoints have correct HTTP status codes
```

## Frontend-only scan
```
@workspace Scan only the frontend/src/ folder for bugs.
Check:
- VITE_API_URL has no trailing slash
- All protected pages use the ProtectedRoute wrapper
- AuthContext login/register/logout all update localStorage correctly
- Axios interceptor handles 401 and redirects to /login
- Dashboard handles null/empty check-in data gracefully
- Assessment form submits all 11 required fields
```

## Fix a specific error
```
I'm getting this error in ASPIRE:
[paste your error here]

The relevant file is [paste file path].
Find the root cause and give me the exact fix.
```

## Pre-deployment checklist
```
@workspace Run through this ASPIRE pre-deployment checklist and
tell me the status of each item:

Backend:
- [ ] bcrypt==4.0.1 in requirements.txt
- [ ] SECRET_KEY is set as environment variable, not hardcoded
- [ ] CORS allow_origins includes the Vercel URL
- [ ] /api/health endpoint returns 200
- [ ] ML model artifacts exist in backend/models/

Frontend:
- [ ] VITE_API_URL env var set in Vercel dashboard (no trailing slash)
- [ ] No console.log statements left in production code
- [ ] All pages handle loading and error states
- [ ] .env file is in .gitignore

Git:
- [ ] node_modules/ is gitignored
- [ ] venv/ is gitignored
- [ ] *.db files are gitignored
- [ ] *.joblib files are gitignored
```
