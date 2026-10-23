import os
import joblib
import numpy as np
from app.schemas import CheckinCreate

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "models")

_model = None
_scaler = None
_feature_columns = None
_data_source = "unknown"


def _ensure_loaded():
    global _model, _scaler, _feature_columns, _data_source
    if _model is None:
        model_path = os.path.join(MODELS_DIR, "ensemble_model.joblib")
        if not os.path.exists(model_path):
            raise RuntimeError("ML model not found. Run `python -m app.ml.train_model` first.")
        _model = joblib.load(model_path)
        _scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.joblib"))
        _feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.joblib"))
        source_path = os.path.join(MODELS_DIR, "data_source.joblib")
        _data_source = joblib.load(source_path) if os.path.exists(source_path) else "unknown"


def get_data_source() -> str:
    _ensure_loaded()
    return _data_source


def _map_checkin_to_features(c: CheckinCreate) -> dict:
    future_career_concerns = min(10, round((c.deadlines_count / 15) * 6 + (10 - c.academic_performance) * 0.4))
    extracurricular_activities = round((c.physical_activity_days / 7) * 10)
    return {
        "anxiety_level": c.anxiety_level,
        "self_esteem": c.self_esteem,
        "sleep_quality": c.sleep_quality,
        "academic_performance": c.academic_performance,
        "study_load": c.workload_intensity,
        "future_career_concerns": future_career_concerns,
        "social_support": c.social_support,
        "extracurricular_activities": extracurricular_activities,
        "bullying": 0,
    }


def ml_stress_probability(c: CheckinCreate) -> float:
    _ensure_loaded()
    feats = _map_checkin_to_features(c)
    x = np.array([[feats[col] for col in _feature_columns]])
    x_scaled = _scaler.transform(x)
    proba = _model.predict_proba(x_scaled)[0]
    score = proba[0] * 15 + proba[1] * 55 + proba[2] * 95
    return float(np.clip(score, 0, 100))


def rule_based_score(c: CheckinCreate, sentiment_compound) -> float:
    sleep_stress = np.clip((8 - c.sleep_hours) / 8, 0, 1) * 0.5 + (1 - c.sleep_quality / 10) * 0.5
    workload_stress = (c.workload_intensity / 10) * 0.6 + min(c.deadlines_count / 10, 1) * 0.4
    academic_stress = (1 - c.academic_performance / 10) * 0.5 + (1 - c.focus_ability / 10) * 0.5
    mood_stress = (1 - c.mood / 10) * 0.4 + (c.anxiety_level / 10) * 0.45 + (1 - c.self_esteem / 10) * 0.15
    lifestyle_stress = (1 - c.physical_activity_days / 7) * 0.5 + (1 - c.social_support / 10) * 0.5
    journal_stress = 0.5
    if sentiment_compound is not None:
        journal_stress = np.clip((1 - sentiment_compound) / 2, 0, 1)
    weights = {"sleep": 0.20, "workload": 0.22, "academic": 0.16,
               "mood": 0.22, "lifestyle": 0.12, "journal": 0.08}
    weighted = (sleep_stress * weights["sleep"] + workload_stress * weights["workload"]
                + academic_stress * weights["academic"] + mood_stress * weights["mood"]
                + lifestyle_stress * weights["lifestyle"] + journal_stress * weights["journal"])
    return float(np.clip(weighted * 100, 0, 100))


def compute_top_drivers(c: CheckinCreate, sentiment_compound) -> dict:
    workload_driver = (c.workload_intensity / 10) * 0.65 + min(c.deadlines_count / 10, 1) * 0.35
    anxiety_driver = c.anxiety_level / 10
    mood_driver = (1 - c.mood / 10) * 0.6 + (1 - c.self_esteem / 10) * 0.4
    sleep_driver = np.clip((8 - c.sleep_hours) / 8, 0, 1) * 0.45 + (1 - c.sleep_quality / 10) * 0.55
    return {
        "Workload": round(float(workload_driver) * 100),
        "Anxiety": round(float(anxiety_driver) * 100),
        "Mood": round(float(mood_driver) * 100),
        "Sleep Quality": round(float(sleep_driver) * 100),
    }


def category_for_score(score: float) -> str:
    if score < 35: return "Low"
    elif score < 60: return "Moderate"
    elif score < 80: return "High"
    return "Critical"


def blend_scores(rule_score: float, ml_score: float, rule_weight: float = 0.45) -> float:
    return float(np.clip(rule_score * rule_weight + ml_score * (1 - rule_weight), 0, 100))
