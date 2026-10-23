from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    university: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    university: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class CheckinCreate(BaseModel):
    sleep_hours: float = Field(ge=0, le=12)
    sleep_quality: int = Field(ge=1, le=10)
    workload_intensity: int = Field(ge=1, le=10)
    deadlines_count: int = Field(ge=0, le=15)
    academic_performance: int = Field(ge=1, le=10)
    focus_ability: int = Field(ge=1, le=10)
    mood: int = Field(ge=1, le=10)
    anxiety_level: int = Field(ge=1, le=10)
    self_esteem: int = Field(ge=1, le=10)
    physical_activity_days: int = Field(ge=0, le=7)
    social_support: int = Field(ge=1, le=10)
    journal_text: Optional[str] = None

class RecommendationOut(BaseModel):
    priority: str
    category: str
    title: str
    description: str
    action_items: list[str]
    class Config:
        from_attributes = True

class CheckinOut(BaseModel):
    id: int
    created_at: datetime
    sleep_hours: float
    sleep_quality: int
    workload_intensity: int
    deadlines_count: int
    academic_performance: int
    focus_ability: int
    mood: int
    anxiety_level: int
    self_esteem: int
    physical_activity_days: int
    social_support: int
    journal_text: Optional[str] = None
    sentiment_compound: Optional[float] = None
    sentiment_label: Optional[str] = None
    final_score: float
    stress_category: str
    top_drivers: dict
    ai_summary: str
    recommendations: list[RecommendationOut] = []
    class Config:
        from_attributes = True

class DashboardOut(BaseModel):
    latest: Optional[CheckinOut] = None
    history: list[CheckinOut] = []
    avg_score: Optional[float] = None
    delta_since_start: Optional[float] = None
    checkin_count: int = 0
