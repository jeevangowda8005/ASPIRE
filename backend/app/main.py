from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth_router, assessment_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ASPIRE API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(assessment_router.router)

@app.get("/")
def root():
    return {"status": "ok", "service": "ASPIRE API", "docs": "/docs"}

@app.get("/api/health")
def health():
    from app.services import scoring_service
    try:
        source = scoring_service.get_data_source()
        return {"status": "ok", "ml_model": "loaded", "training_data_source": source}
    except Exception as e:
        return {"status": "ok", "ml_model": f"not loaded: {e}"}
