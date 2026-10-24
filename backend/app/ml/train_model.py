"""
Trains ASPIRE's stress-prediction ensemble:
    RandomForestClassifier + XGBClassifier (soft voting VotingClassifier)

Real dataset (Kaggle):
    "Student Stress Factors: A Comprehensive Analysis" by rxnach
    https://www.kaggle.com/datasets/rxnach/student-stress-factors-a-comprehensive-analysis
    Place at: backend/data/StressLevelDataset.csv

Falls back to synthetic data automatically if CSV is absent.

Run from backend/:
    python -m app.ml.train_model
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_PATH = os.path.join(BASE_DIR, "data", "StressLevelDataset.csv")
ROOT_DATA_PATH = os.path.join(os.path.dirname(BASE_DIR), "StressLevelDataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# NOTE: uses 'extracurricular_activities' (plural) — matches real Kaggle CSV column name
FEATURE_COLUMNS = [
    "anxiety_level",
    "self_esteem",
    "sleep_quality",
    "academic_performance",
    "study_load",
    "future_career_concerns",
    "social_support",
    "extracurricular_activities",
    "bullying",
]
TARGET_COLUMN = "stress_level"


def _generate_synthetic_dataset(n=1500, seed=42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    anxiety = rng.integers(0, 11, n)
    self_esteem = rng.integers(0, 11, n)
    sleep_quality = rng.integers(0, 11, n)
    academic_performance = rng.integers(0, 11, n)
    study_load = rng.integers(0, 11, n)
    future_career_concerns = rng.integers(0, 11, n)
    social_support = rng.integers(0, 11, n)
    extracurricular_activities = rng.integers(0, 11, n)
    bullying = rng.integers(0, 4, n)
    latent = (
        anxiety * 1.4 + study_load * 1.2 + future_career_concerns * 0.9 + bullying * 1.0
        - self_esteem * 0.9 - sleep_quality * 1.1 - social_support * 0.7
        - extracurricular_activities * 0.3 + rng.normal(0, 3.5, n)
    )
    q1, q2 = np.quantile(latent, [0.4, 0.75])
    stress_level = np.where(latent <= q1, 0, np.where(latent <= q2, 1, 2))
    return pd.DataFrame({
        "anxiety_level": anxiety, "self_esteem": self_esteem, "sleep_quality": sleep_quality,
        "academic_performance": academic_performance, "study_load": study_load,
        "future_career_concerns": future_career_concerns, "social_support": social_support,
        "extracurricular_activities": extracurricular_activities,
        "bullying": bullying, "stress_level": stress_level,
    })


def load_dataset():
    data_path = DATA_PATH if os.path.exists(DATA_PATH) else ROOT_DATA_PATH
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        missing = [c for c in FEATURE_COLUMNS + [TARGET_COLUMN] if c not in df.columns]
        if missing:
            print(f"[train_model] WARNING: CSV missing columns {missing}. Using synthetic fallback.")
            return _generate_synthetic_dataset(), "synthetic (schema mismatch fallback)"
        return df[FEATURE_COLUMNS + [TARGET_COLUMN]].dropna(), "real (Kaggle: rxnach/student-stress-factors)"
    return _generate_synthetic_dataset(), "synthetic (no Kaggle CSV found)"


def train():
    df, source = load_dataset()
    print(f"[train_model] Training on {len(df)} rows | source: {source}")
    X = df[FEATURE_COLUMNS].values
    y = df[TARGET_COLUMN].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    if HAS_SMOTE:
        sm = SMOTE(random_state=42)
        X_train_scaled, y_train = sm.fit_resample(X_train_scaled, y_train)
        print(f"[train_model] Applied SMOTE -> {len(y_train)} balanced training rows")
    rf = RandomForestClassifier(n_estimators=300, max_depth=10, min_samples_leaf=3,
                                 random_state=42, class_weight="balanced")
    if HAS_XGBOOST:
        boosted = XGBClassifier(n_estimators=300, max_depth=5, learning_rate=0.05,
                                subsample=0.85, colsample_bytree=0.85, random_state=42,
                                eval_metric="mlogloss")
        boosted_name = "xgboost"
    else:
        boosted = GradientBoostingClassifier(n_estimators=300, max_depth=5,
                                              learning_rate=0.05, subsample=0.85, random_state=42)
        boosted_name = "gradient_boosting"
    ensemble = VotingClassifier(estimators=[("random_forest", rf), (boosted_name, boosted)], voting="soft")
    ensemble.fit(X_train_scaled, y_train)
    preds = ensemble.predict(X_test_scaled)
    acc = accuracy_score(y_test, preds)
    print(f"[train_model] Test accuracy: {acc:.3f}")
    print(classification_report(y_test, preds, target_names=["Low", "Moderate", "High"]))
    joblib.dump(ensemble, os.path.join(MODELS_DIR, "ensemble_model.joblib"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.joblib"))
    joblib.dump(FEATURE_COLUMNS, os.path.join(MODELS_DIR, "feature_columns.joblib"))
    joblib.dump(source, os.path.join(MODELS_DIR, "data_source.joblib"))
    print(f"[train_model] Saved model artifacts to {MODELS_DIR}")

if __name__ == "__main__":
    train()
