# ASPIRE — GitHub Copilot Agent Guide

## How this works

GitHub Copilot in VS Code reads `.github/copilot-instructions.md` automatically.
This means every Copilot suggestion already knows your full stack, the known bugs,
the deployment URLs, and the rules — without you having to explain anything.

The prompt files in `.github/copilot/` are ready-to-paste commands for Copilot Chat.

---

## Setup (one time only)

1. Install VS Code extensions — open VS Code, press `Cmd+Shift+P` → "Show Recommended Extensions" → install all

2. Sign in to GitHub Copilot — press `Cmd+Shift+P` → "GitHub Copilot: Sign In"

3. Copy the agent files into your aspire project:
```bash
cp -r .github/ ../aspire/.github/
cp -r .vscode/ ../aspire/.vscode/
cp render.yaml ../aspire/render.yaml
cp -r docs/ ../aspire/docs/
cp backend/tests/test_api.py ../aspire/backend/tests/test_api.py
```

---

## Daily workflow

### Open Copilot Chat
- Mac: `Cmd + Shift + I`
- Or click the Copilot icon in the sidebar

### Run any task from VS Code
- Mac: `Cmd + Shift + P` → "Tasks: Run Task" → pick one:
  - 🚀 Start Backend
  - ⚡ Start Frontend
  - 🧠 Train ML Model
  - 🧪 Run Tests
  - 🔁 Git Push to GitHub
  - 🏥 Health Check (Backend)

---

## Agent 1: Bug Hunter

**When to use:** Something is broken, or before any deployment.

Open Copilot Chat and paste from `.github/copilot/bug-hunter.md`.

**Quick version:**
```
@workspace Find all bugs in the ASPIRE codebase and list them
with file path, line number, and the exact fix for each.
```

**After Copilot lists the bugs:**
```
Fix bug #1 in backend/app/auth.py
```
```
Fix bug #2 in frontend/src/pages/Dashboard.jsx
```

---

## Agent 2: Git Push

**When to use:** You've made changes and want to push to GitHub.

Open Copilot Chat and paste from `.github/copilot/git-agent.md`.

**Quick version:**
```
@workspace Look at my changed files and write a git commit message.
Then give me the exact commands to safely push to GitHub.
```

Or use the VS Code task: `Cmd+Shift+P` → Tasks → "🔁 Git Push to GitHub"
It will ask you for a commit message then do `git add . && git commit && git push`.

---

## Agent 3: Deployment Manager

**When to use:** Deployment fails, CORS errors, or before a demo.

Open Copilot Chat and paste from `.github/copilot/deployment-agent.md`.

**Quick version — check if live site is working:**
```
My ASPIRE backend is at https://aspire-gkl3.onrender.com
Give me curl commands to verify it's healthy and the ML model is loaded.
```

**Quick version — fix CORS error:**
```
My frontend at [your Vercel URL] is getting a CORS error.
Show me exactly what to change in backend/app/main.py.
```

---

## Agent 4: Test API endpoints

Install the **REST Client** VS Code extension, then open `docs/api-tests.http`.
Click "Send Request" above any endpoint to test it instantly without Postman.

Change `@base = {{local}}` to `@base = {{prod}}` at the top to test the live deployment.

---

## GitHub Actions (automatic CI)

Every time you `git push` to main, GitHub automatically:
1. Installs Python 3.11 and all backend dependencies
2. Trains the ML model with synthetic data
3. Runs all tests in `backend/tests/test_api.py`
4. Builds the frontend with Vite
5. Shows you a green tick ✅ or red cross ❌ on GitHub

Check results at: `https://github.com/YOUR_USERNAME/aspire/actions`

---

## Copilot Chat tips for ASPIRE

| What you want | What to type |
|---------------|-------------|
| Fix an error | Paste the error + `Fix this in ASPIRE` |
| Add a feature | `@workspace Add [feature] to ASPIRE following the existing code style` |
| Review code | `@workspace Review this file for bugs and improvements` |
| Write a test | `Write a pytest test for this endpoint following the pattern in tests/test_api.py` |
| Explain code | Select any code → right click → "Copilot: Explain" |
| Suggest refactor | Select code → `Cmd+I` → type `refactor this` |

---

## Before every demo — run this checklist

```bash
# 1. Wake up Render (run this 2 minutes before demo)
curl https://aspire-gkl3.onrender.com/api/health

# 2. Verify ML model is loaded (should show "ml_model": "loaded")
# Expected: {"status":"ok","ml_model":"loaded","training_data_source":"..."}

# 3. Open the live site
open https://your-aspire.vercel.app
```
