# ASPIRE — Academic Stress Prediction & Intervention Recommendation Engine

## To run locally (every time)

### Terminal 1 — Backend
```bash
cd backend
source venv/Scripts/activate        # Windows Git Bash
uvicorn app.main:app --reload --port 8000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## First-time setup (only once on a new machine)

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python -m app.ml.train_model
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

---

## Tech stack
| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | SQLite |
| Auth | JWT + bcrypt |
| ML | RandomForest + XGBoost soft-voting ensemble, SMOTE |
| NLP | VADER Sentiment Analysis |

## Real Kaggle dataset
Download **StressLevelDataset.csv** from:
https://www.kaggle.com/datasets/rxnach/student-stress-factors-a-comprehensive-analysis

Place it at `backend/data/StressLevelDataset.csv` then retrain:
```bash
python -m app.ml.train_model
```
