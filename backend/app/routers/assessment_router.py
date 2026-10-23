from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app import models, schemas, auth
from app.services import scoring_service, nlp_service, recommendation_service, summary_service

router = APIRouter(prefix="/api", tags=["assessment"])

@router.post("/checkins", response_model=schemas.CheckinOut, status_code=201)
def submit_checkin(payload: schemas.CheckinCreate, db: Session = Depends(get_db),
                   current_user: models.User = Depends(auth.get_current_user)):
    sentiment_compound, sentiment_label = nlp_service.analyze_journal(payload.journal_text)
    rule_score = scoring_service.rule_based_score(payload, sentiment_compound)
    try:
        ml_score = scoring_service.ml_stress_probability(payload)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    final_score = scoring_service.blend_scores(rule_score, ml_score)
    category = scoring_service.category_for_score(final_score)
    drivers = scoring_service.compute_top_drivers(payload, sentiment_compound)
    ai_summary = summary_service.generate_summary(payload, category, drivers)
    checkin = models.Checkin(
        user_id=current_user.id, sleep_hours=payload.sleep_hours, sleep_quality=payload.sleep_quality,
        workload_intensity=payload.workload_intensity, deadlines_count=payload.deadlines_count,
        academic_performance=payload.academic_performance, focus_ability=payload.focus_ability,
        mood=payload.mood, anxiety_level=payload.anxiety_level, self_esteem=payload.self_esteem,
        physical_activity_days=payload.physical_activity_days, social_support=payload.social_support,
        journal_text=payload.journal_text, sentiment_compound=sentiment_compound,
        sentiment_label=sentiment_label, rule_based_score=rule_score, ml_score=ml_score,
        final_score=final_score, stress_category=category, top_drivers=drivers, ai_summary=ai_summary,
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    recs = recommendation_service.generate_recommendations(payload)
    rec_objects = []
    for r in recs:
        rec_obj = models.Recommendation(checkin_id=checkin.id, priority=r["priority"],
                                         category=r["category"], title=r["title"],
                                         description=r["description"], action_items=r["action_items"])
        db.add(rec_obj)
        rec_objects.append(rec_obj)
    db.commit()
    result = schemas.CheckinOut.model_validate(checkin)
    result.recommendations = [schemas.RecommendationOut.model_validate(r) for r in rec_objects]
    return result

@router.get("/dashboard", response_model=schemas.DashboardOut)
def get_dashboard(db: Session = Depends(get_db),
                  current_user: models.User = Depends(auth.get_current_user)):
    checkins = db.query(models.Checkin).filter(models.Checkin.user_id == current_user.id)\
                 .order_by(desc(models.Checkin.created_at)).all()
    if not checkins:
        return schemas.DashboardOut(latest=None, history=[], checkin_count=0)
    latest = checkins[0]
    latest_recs = db.query(models.Recommendation).filter(models.Recommendation.checkin_id == latest.id).all()
    latest_out = schemas.CheckinOut.model_validate(latest)
    latest_out.recommendations = [schemas.RecommendationOut.model_validate(r) for r in latest_recs]
    history_out = [schemas.CheckinOut.model_validate(c) for c in reversed(checkins)]
    scores = [c.final_score for c in checkins]
    avg_score = sum(scores) / len(scores)
    delta = checkins[0].final_score - checkins[-1].final_score if len(checkins) > 1 else 0.0
    return schemas.DashboardOut(latest=latest_out, history=history_out,
                                avg_score=round(avg_score, 1), delta_since_start=round(delta, 1),
                                checkin_count=len(checkins))

@router.get("/history", response_model=list[schemas.CheckinOut])
def get_history(db: Session = Depends(get_db),
                current_user: models.User = Depends(auth.get_current_user)):
    checkins = db.query(models.Checkin).filter(models.Checkin.user_id == current_user.id)\
                 .order_by(desc(models.Checkin.created_at)).all()
    results = []
    for c in checkins:
        recs = db.query(models.Recommendation).filter(models.Recommendation.checkin_id == c.id).all()
        out = schemas.CheckinOut.model_validate(c)
        out.recommendations = [schemas.RecommendationOut.model_validate(r) for r in recs]
        results.append(out)
    return results
