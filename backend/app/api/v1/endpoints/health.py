from fastapi import APIRouter
from app.services.ffmpeg_service import FFmpegService

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "online",
        "ffmpeg_available": FFmpegService.is_ffmpeg_available()
    }

