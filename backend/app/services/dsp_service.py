import os
import tempfile
from typing import Dict, Any, List
from app.services.ffmpeg_service import FFmpegService

class DSPVoiceService:
    """Service de transformation de voix par traitement de signal (DSP)."""

    PRESETS: Dict[str, Dict[str, Any]] = {
        "girl": {
            "name": "Fille / Aiguë",
            "description": "Voix plus haute et claire avec équilibrage formantique",
            "filter": "asetrate=44100*1.30,atempo=1/1.30,equalizer=f=2500:t=q:w=1:g=3"
        },
        "grandfather": {
            "name": "Grand-père / Âgé",
            "description": "Voix plus grave avec léger chevrotement",
            "filter": "asetrate=44100*0.86,atempo=1/0.86,tremolo=f=4.5:d=0.25,equalizer=f=300:t=q:w=1:g=2"
        },
        "deep_man": {
            "name": "Homme Grave / Deep Voice",
            "description": "Voix basse, profonde et chaleureuse",
            "filter": "asetrate=44100*0.78,atempo=1/0.78,equalizer=f=180:t=q:w=1:g=5"
        },
        "robot": {
            "name": "Robot",
            "description": "Effet robotique métallique",
            "filter": "flanger=delay=8:depth=6:regen=65,aecho=0.8:0.88:4:0.5"
        },
        "chipmunk": {
            "name": "Chipmunk / Écureuil",
            "description": "Voix comique très aiguë",
            "filter": "asetrate=44100*1.55,atempo=1/1.55,highpass=f=250"
        }
    }

    @classmethod
    def list_presets(cls) -> List[Dict[str, Any]]:
        return [
            {
                "id": key,
                "name": data["name"],
                "description": data["description"]
            }
            for key, data in cls.PRESETS.items()
        ]

    @classmethod
    def convert(cls, input_file_path: str, preset_id: str) -> str:
        """
        Transforme le fichier audio selon le preset choisi et l'encode
        au format OGG Opus compatible WhatsApp / Telegram Voice Note (PTT).
        """
        if preset_id not in cls.PRESETS:
            raise ValueError(f"Preset invalide : {preset_id}. Presets autorisés : {list(cls.PRESETS.keys())}")

        preset = cls.PRESETS[preset_id]
        audio_filter = preset["filter"]

        # Fichier temporaire de sortie
        output_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".ogg")
        output_path = output_temp.name
        output_temp.close()

        # Commande FFmpeg conforme aux spécifications WhatsApp PTT
        cmd = [
            "ffmpeg", "-y",
            "-i", input_file_path,
            "-af", audio_filter,
            "-c:a", "libopus",
            "-b:a", "32k",
            "-vbr", "on",
            "-compression_level", "10",
            "-ar", "16000",
            "-ac", "1",
            "-f", "ogg",
            output_path
        ]

        FFmpegService.execute_ffmpeg(cmd)
        return output_path

