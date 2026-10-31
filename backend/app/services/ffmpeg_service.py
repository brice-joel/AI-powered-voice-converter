import subprocess
import os
from typing import List

class FFmpegService:
    """Service d'exécution sécurisée et standardisée des commandes FFmpeg."""

    @staticmethod
    def is_ffmpeg_available() -> bool:
        """Vérifie si FFmpeg est installé et accessible dans le PATH système."""
        try:
            res = subprocess.run(["ffmpeg", "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return res.returncode == 0
        except FileNotFoundError:
            return False

    @staticmethod
    def execute_ffmpeg(cmd: List[str]) -> None:
        """Exécute une commande FFmpeg sans shell=True pour la sécurité."""
        process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if process.returncode != 0:
            error_msg = process.stderr.decode("utf-8", errors="replace")
            raise RuntimeError(f"FFmpeg error: {error_msg}")

