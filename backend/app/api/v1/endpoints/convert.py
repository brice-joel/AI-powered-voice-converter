import os
import shutil
import tempfile
import base64
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Request
from fastapi.responses import FileResponse, JSONResponse
from app.core.config import settings
from app.services.dsp_service import DSPVoiceService

router = APIRouter()

def cleanup_files(*file_paths: str) -> None:
    """Supprime les fichiers temporaires après l'envoi de la réponse."""
    for path in file_paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass

@router.post("/convert")
async def convert_voice(
    request: Request,
    background_tasks: BackgroundTasks,
    audio: UploadFile = File(..., description="Fichier audio enregistré (m4a, wav, mp3, ogg)"),
    preset: str = Form(..., description="Identifiant de la voix cible (ex: girl, grandfather, deep_man, robot)"),
    response_format: Optional[str] = Form("binary", description="Format de réponse : 'binary' (défaut) ou 'base64'")
):
    """
    Convertit un enregistrement vocal dans une autre voix en utilisant le moteur DSP
    et renvoie le résultat au format OGG Opus pour WhatsApp/Telegram.
    Supporte le format binaire direct ou base64 pour intégration mobile React Native.
    """
    # 1. Validation de l'extension
    file_ext = Path(audio.filename or "audio.m4a").suffix.lower()
    if file_ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format audio non supporté : {file_ext}. Formats acceptés : {settings.ALLOWED_AUDIO_EXTENSIONS}"
        )

    # 2. Sauvegarde dans un fichier temporaire
    input_temp = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
    input_path = input_temp.name
    try:
        shutil.copyfileobj(audio.file, input_temp)
    finally:
        input_temp.close()

    # 3. Vérification de la taille max
    file_size_mb = os.path.getsize(input_path) / (1024 * 1024)
    if file_size_mb > settings.MAX_AUDIO_SIZE_MB:
        cleanup_files(input_path)
        raise HTTPException(
            status_code=413,
            detail=f"Fichier trop volumineux ({file_size_mb:.2f} MB). Maximum : {settings.MAX_AUDIO_SIZE_MB} MB"
        )

    # 4. Traitement DSP
    try:
        output_path = DSPVoiceService.convert(input_file_path=input_path, preset_id=preset)
    except ValueError as ve:
        cleanup_files(input_path)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        cleanup_files(input_path)
        raise HTTPException(status_code=500, detail=f"Erreur lors de la conversion audio : {str(e)}")

    # 5. Nettoyage garanti en tâche de fond après l'envoi de la réponse
    background_tasks.add_task(cleanup_files, input_path, output_path)

    # 6. Réponse selon le format demandé (base64 pour mobile Expo ou binaire pour cURL/test)
    if response_format == "base64" or "application/json" in request.headers.get("accept", ""):
        with open(output_path, "rb") as f:
            b64_content = base64.b64encode(f.read()).decode("utf-8")
        return {
            "status": "success",
            "preset": preset,
            "filename": f"voice_{preset}.ogg",
            "audio_base64": b64_content
        }

    return FileResponse(
        path=output_path,
        media_type="audio/ogg",
        filename=f"voice_{preset}.ogg",
        headers={
            "Content-Disposition": f'attachment; filename="voice_{preset}.ogg"',
            "X-Voice-Preset": preset
        }
    )
