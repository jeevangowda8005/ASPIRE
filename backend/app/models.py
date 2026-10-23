from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    university = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    checkins = relationship("Checkin", back_populates="user", cascade="all, delete-orphan")

class Checkin(Base):
    __tablename__ = "checkins"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    sleep_hours = Column(Float)
    sleep_quality = Column(Integer)
    workload_intensity = Column(Integer)
    deadlines_count = Column(Integer)
    academic_performance = Column(Integer)
    focus_ability = Column(Integer)
    mood = Column(Integer)
    anxiety_level = Column(Integer)
    self_esteem = Column(Integer)
    physical_activity_days = Column(Integer)
    social_support = Column(Integer)
    journal_text = Column(Text, nullable=True)
    sentiment_compound = Column(Float, nullable=True)
    sentiment_label = Column(String, nullable=True)
    rule_based_score = Column(Float)
    ml_score = Column(Float)
    final_score = Column(Float)
    stress_category = Column(String)
    top_drivers = Column(JSON)
    ai_summary = Column(Text)
    user = relationship("User", back_populates="checkins")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    checkin_id = Column(Integer, ForeignKey("checkins.id"), nullable=False)
    priority = Column(String)
    category = Column(String)
    title = Column(String)
    description = Column(Text)
    action_items = Column(JSON)
