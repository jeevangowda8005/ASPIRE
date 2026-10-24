# Deployment Agent — Copilot Chat Prompts

## How to use
Open Copilot Chat in VS Code, paste the prompt you need.

---

## Check if deployment is healthy
```
My ASPIRE app is deployed at:
- Frontend: https://aspire.vercel.app
- Backend: https://aspire-gkl3.onrender.com

Help me verify the deployment is working correctly.
What endpoints should I test, and what responses should I expect?
Give me curl commands to test each one.
```

## Debug a Render deployment failure
```
My ASPIRE backend deployment on Render failed.
Here are the Render build logs:
[paste logs here]

Find the root cause and give me the exact fix.
Remember: bcrypt must be pinned to ==4.0.1 in requirements.txt.
```

## Debug a Vercel deployment failure
```
My ASPIRE frontend deployment on Vercel failed.
Here are the Vercel build logs:
[paste logs here]

Find the root cause and give me the exact fix.
Remember: VITE_API_URL must be set in Vercel environment variables
with no trailing slash.
```

## Fix CORS error
```
My ASPIRE frontend at [Vercel URL] is getting a CORS error
when calling the backend at https://aspire-gkl3.onrender.com.

The error is:
[paste CORS error from browser console]

Show me exactly what to change in backend/app/main.py
to fix the CORS configuration.
```

## Set up environment variables checklist
```
Help me set up all environment variables for ASPIRE production deployment.

Vercel (frontend) needs:
- VITE_API_URL = https://aspire-gkl3.onrender.com  (no trailing slash, type: Config)

Render (backend) needs:
- SECRET_KEY = (generate a strong random key for me)
- PYTHON_VERSION = 3.11.0

Walk me through setting each one up and explain
why each is needed.
```

## Wake up Render before a demo
```
My ASPIRE backend on Render is on the free tier and may be sleeping.
Give me the exact steps to wake it up before my demo presentation,
and how to verify it's fully awake and the ML model is loaded.
```

## Full production readiness check
```
@workspace Check my ASPIRE codebase for production readiness.
Look for:
1. Hardcoded secrets or passwords
2. Debug mode left on
3. Missing error handling on API calls
4. console.log statements in frontend
5. SQLite being used (should note this is dev-only)
6. CORS set to allow_origins=["*"] (should be specific domains)
7. Missing try/catch blocks in critical paths

Give me a prioritised list of what to fix before going live.
```
