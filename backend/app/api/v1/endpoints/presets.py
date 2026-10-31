from fastapi import APIRouter
from app.services.dsp_service import DSPVoiceService

router = APIRouter()

@router.get("/")
def get_presets():
    """Renvoie la liste des avatars vocaux disponibles."""
    return {
        "presets": DSPVoiceService.list_presets()
    }

