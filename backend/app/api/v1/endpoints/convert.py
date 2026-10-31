import os
import shutil
import tempfile
import base64
from pathlib import Path
from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Request
from fastapi.responses import FileResponse
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

class ConvertBase64Request(BaseModel):
    audio_base64: str = Field(..., description="Contenu audio enregistré encodé en base64")
    preset: str = Field(..., description="Identifiant de la voix cible (ex: girl, grandfather, deep_man, robot)")
    filename: Optional[str] = Field("recording.m4a", description="Nom du fichier source avec extension")
    response_format: Optional[str] = Field("base64", description="Format de réponse : 'base64'")

@router.post("/convert-base64")
async def convert_voice_base64(
    payload: ConvertBase64Request,
    background_tasks: BackgroundTasks,
):
    """
    Endpoint JSON/Base64 dédié aux applications mobiles React Native.
    Évite les incompatibilités FormData de la New Architecture React Native 0.88.
    """
    # 1. Validation de l'extension
    file_ext = Path(payload.filename or "recording.m4a").suffix.lower()
    if not file_ext or file_ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        # Fallback sur .m4a si pas d'extension valide
        file_ext = ".m4a"

    # 2. Sauvegarde du base64 dans un fichier temporaire
    input_temp = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
    input_path = input_temp.name
    try:
        audio_bytes = base64.b64decode(payload.audio_base64)
        print(f"[VoiceMorph] Base64 reçu: {len(payload.audio_base64)} chars, Audio décodé: {len(audio_bytes)} octets")
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Le fichier audio envoyé est vide (0 octet).")
        input_temp.write(audio_bytes)
    except HTTPException:
        input_temp.close()
        cleanup_files(input_path)
        raise
    except Exception as e:
        input_temp.close()
        cleanup_files(input_path)
        raise HTTPException(status_code=400, detail=f"Données audio base64 invalides : {str(e)}")
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
        output_path = DSPVoiceService.convert(input_file_path=input_path, preset_id=payload.preset)
    except ValueError as ve:
        cleanup_files(input_path)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        cleanup_files(input_path)
        raise HTTPException(status_code=500, detail=f"Erreur lors de la conversion audio : {str(e)}")

    # 5. Vérification du fichier de sortie
    output_size = os.path.getsize(output_path) if os.path.exists(output_path) else 0
    print(f"[VoiceMorph] Fichier de sortie DSP: {output_path} ({output_size} octets)")
    if output_size == 0:
        cleanup_files(input_path, output_path)
        raise HTTPException(status_code=500, detail="La conversion audio a produit un fichier vide (0 octet).")

    # 6. Lecture du résultat en Base64
    with open(output_path, "rb") as f:
        b64_content = base64.b64encode(f.read()).decode("utf-8")

    print(f"[VoiceMorph] Envoi réponse Base64: {len(b64_content)} caractères")

    # 7. Nettoyage garanti en tâche de fond après l'envoi de la réponse
    background_tasks.add_task(cleanup_files, input_path, output_path)

    return {
        "status": "success",
        "preset": payload.preset,
        "filename": f"voice_{payload.preset}.ogg",
        "audio_base64": b64_content
    }

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
    Supporte le format binaire direct ou base64 pour intégration cURL et tests.
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

    # 6. Réponse selon le format demandé (base64 ou binaire)
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
