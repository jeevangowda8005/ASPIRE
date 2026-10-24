# ASPIRE — Academic Stress Prediction & Intervention Recommendation Engine

## Run locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m app.ml.train_model
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal (typically http://localhost:5173).

## Tests

```bash
cd backend
pip install pytest httpx
pytest tests/ -v
```

The API tests use an isolated in-memory SQLite database and do not modify the local database.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | FastAPI |
| Database | SQLite |
| Authentication | JWT + bcrypt |
| ML | RandomForest + XGBoost soft-voting ensemble |
| NLP | VADER sentiment analysis |

## Training data

The training script uses synthetic data when the Kaggle dataset is unavailable. To train
with the real dataset, place `StressLevelDataset.csv` in `backend/data/` and run:

```bash
cd backend
python -m app.ml.train_model
```
