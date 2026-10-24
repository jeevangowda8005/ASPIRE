"""
ASPIRE API Test Suite
Run: cd backend && pytest tests/ -v
"""
import pytest, sys, os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, get_db
from app import auth, models

@pytest.fixture(autouse=True)
def reset_db():
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    testing_session_local = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = testing_session_local()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield testing_session_local
    app.dependency_overrides.pop(get_db, None)
    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()

client = TestClient(app)

VALID_USER = {
    "name": "Jeevan H M",
    "email": "jeevan@bmsit.in",
    "password": "Test1234",
    "university": "BMSIT&M"
}

VALID_CHECKIN = {
    "sleep_hours": 7, "sleep_quality": 6,
    "workload_intensity": 6, "deadlines_count": 3,
    "academic_performance": 6, "focus_ability": 5,
    "mood": 6, "anxiety_level": 6, "self_esteem": 6,
    "physical_activity_days": 2, "social_support": 7,
    "journal_text": "Feeling a bit overwhelmed but managing."
}

def register_and_login():
    client.post("/api/auth/register", json=VALID_USER)
    res = client.post("/api/auth/login", json={
        "email": VALID_USER["email"],
        "password": VALID_USER["password"]
    })
    return res.json()["access_token"]


# ── AUTH TESTS ─────────────────────────────────────────────────

class TestAuth:
    def test_root_returns_ok(self):
        res = client.get("/")
        assert res.status_code == 200
        assert res.json()["status"] == "ok"

    def test_register_success(self):
        res = client.post("/api/auth/register", json=VALID_USER)
        assert res.status_code == 201
        assert "access_token" in res.json()
        assert res.json()["user"]["email"] == VALID_USER["email"]
        assert res.json()["user"]["name"] == VALID_USER["name"]

    def test_register_duplicate_email(self):
        client.post("/api/auth/register", json=VALID_USER)
        res = client.post("/api/auth/register", json=VALID_USER)
        assert res.status_code == 400
        assert "already exists" in res.json()["detail"]

    def test_login_success(self):
        client.post("/api/auth/register", json=VALID_USER)
        res = client.post("/api/auth/login", json={
            "email": VALID_USER["email"],
            "password": VALID_USER["password"]
        })
        assert res.status_code == 200
        assert "access_token" in res.json()

    def test_login_wrong_password(self):
        client.post("/api/auth/register", json=VALID_USER)
        res = client.post("/api/auth/login", json={
            "email": VALID_USER["email"],
            "password": "wrongpassword"
        })
        assert res.status_code == 401

    def test_login_unknown_email(self):
        res = client.post("/api/auth/login", json={
            "email": "nobody@nowhere.com",
            "password": "anything"
        })
        assert res.status_code == 401

    def test_me_requires_auth(self):
        res = client.get("/api/auth/me")
        assert res.status_code == 401

    def test_malformed_user_id_token_returns_unauthorized(self):
        token = auth.create_access_token({"sub": "not-an-id"})
        res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 401

    def test_me_returns_user(self):
        token = register_and_login()
        res = client.get("/api/auth/me",
                         headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        assert res.json()["email"] == VALID_USER["email"]


# ── CHECKIN TESTS ──────────────────────────────────────────────

class TestCheckin:
    def test_checkin_requires_auth(self):
        res = client.post("/api/checkins", json=VALID_CHECKIN)
        assert res.status_code == 401

    def test_checkin_success(self):
        token = register_and_login()
        res = client.post("/api/checkins", json=VALID_CHECKIN,
                          headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 201
        data = res.json()
        assert 0 <= data["final_score"] <= 100
        assert data["stress_category"] in ["Low", "Moderate", "High", "Critical"]
        assert data["sentiment_label"] in ["positive", "neutral", "negative"]
        assert len(data["recommendations"]) >= 4

    def test_checkin_without_journal(self):
        token = register_and_login()
        payload = {**VALID_CHECKIN, "journal_text": None}
        res = client.post("/api/checkins", json=payload,
                          headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 201
        assert res.json()["sentiment_label"] is None

    def test_checkin_validates_sleep_hours(self):
        token = register_and_login()
        payload = {**VALID_CHECKIN, "sleep_hours": 99}
        res = client.post("/api/checkins", json=payload,
                          headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 422

    def test_checkin_validates_anxiety_range(self):
        token = register_and_login()
        payload = {**VALID_CHECKIN, "anxiety_level": 0}
        res = client.post("/api/checkins", json=payload,
                          headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 422


# ── DASHBOARD TESTS ────────────────────────────────────────────

    def test_failed_recommendations_do_not_save_partial_checkin(self, monkeypatch, reset_db):
        token = register_and_login()

        def fail_recommendations(payload):
            raise RuntimeError("recommendations unavailable")

        monkeypatch.setattr(
            "app.routers.assessment_router.recommendation_service.generate_recommendations",
            fail_recommendations,
        )
        failing_client = TestClient(app, raise_server_exceptions=False)
        res = failing_client.post(
            "/api/checkins",
            json=VALID_CHECKIN,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 500
        with reset_db() as db:
            assert db.query(models.Checkin).count() == 0


class TestDashboard:
    def test_health_reports_unavailable_model(self, monkeypatch):
        from app.services import scoring_service

        def fail_to_load():
            raise RuntimeError("model missing")

        monkeypatch.setattr(scoring_service, "get_data_source", fail_to_load)
        res = client.get("/api/health")
        assert res.status_code == 503
    def test_dashboard_requires_auth(self):
        res = client.get("/api/dashboard")
        assert res.status_code == 401

    def test_dashboard_empty_when_no_checkins(self):
        token = register_and_login()
        res = client.get("/api/dashboard",
                         headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        assert res.json()["latest"] is None
        assert res.json()["checkin_count"] == 0

    def test_dashboard_after_checkin(self):
        token = register_and_login()
        headers = {"Authorization": f"Bearer {token}"}
        client.post("/api/checkins", json=VALID_CHECKIN, headers=headers)
        res = client.get("/api/dashboard", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["checkin_count"] == 1
        assert data["latest"] is not None
        assert 0 <= data["latest"]["final_score"] <= 100
        assert len(data["latest"]["recommendations"]) >= 4

    def test_history_shows_all_checkins(self):
        token = register_and_login()
        headers = {"Authorization": f"Bearer {token}"}
        client.post("/api/checkins", json=VALID_CHECKIN, headers=headers)
        client.post("/api/checkins", json=VALID_CHECKIN, headers=headers)
        res = client.get("/api/history", headers=headers)
        assert res.status_code == 200
        assert len(res.json()) == 2
