from fastapi import APIRouter
from app.api.v1.endpoints import health, presets, convert

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(presets.router, prefix="/presets", tags=["Presets"])
api_router.include_router(convert.router, tags=["Voice Conversion"])

