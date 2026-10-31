import subprocess
import shutil
import os
from typing import List, Optional

class FFmpegService:
    """Service d'exécution sécurisée et standardisée des commandes FFmpeg."""

    @classmethod
    def get_ffmpeg_binary(cls) -> Optional[str]:
        """
        Détermine le chemin vers le binaire FFmpeg :
        1. Dans le PATH système
        2. Directement dans le dossier backend/ (ex: backend/ffmpeg.exe ou backend/bin/ffmpeg.exe)
        3. Via le package python imageio_ffmpeg si installé
        """
        # 1. Recherche dans le PATH système
        system_ffmpeg = shutil.which("ffmpeg")
        if system_ffmpeg:
            return system_ffmpeg

        # 2. Recherche locale dans le dossier backend/ ou backend/bin/
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        local_candidates = [
            os.path.join(base_dir, "ffmpeg.exe"),
            os.path.join(base_dir, "bin", "ffmpeg.exe"),
            os.path.abspath(os.path.join(base_dir, "..", "ffmpeg.exe"))
        ]
        for candidate in local_candidates:
            if os.path.exists(candidate):
                return candidate

        # 3. Via imageio_ffmpeg
        try:
            import imageio_ffmpeg
            return imageio_ffmpeg.get_ffmpeg_exe()
        except ImportError:
            pass

        return None

    @classmethod
    def is_ffmpeg_available(cls) -> bool:
        """Vérifie si un binaire FFmpeg valide est disponible."""
        bin_path = cls.get_ffmpeg_binary()
        if not bin_path:
            return False
        try:
            res = subprocess.run([bin_path, "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return res.returncode == 0
        except Exception:
            return False

    @classmethod
    def execute_ffmpeg(cls, cmd: List[str]) -> str:
        """Exécute une commande FFmpeg avec le binaire détecté et renvoie les logs stderr."""
        bin_path = cls.get_ffmpeg_binary()
        if not bin_path:
            raise RuntimeError(
                "FFmpeg n'a pas été trouvé sur votre système. "
                "Veuillez l'installer via 'winget install Gyan.FFmpeg' "
                "ou placer 'ffmpeg.exe' dans le dossier backend/."
            )

        actual_cmd = list(cmd)
        if actual_cmd and actual_cmd[0] == "ffmpeg":
            actual_cmd[0] = bin_path

        process = subprocess.run(actual_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stderr_msg = process.stderr.decode("utf-8", errors="replace")
        
        print(f"[FFmpeg] Commande: {' '.join(actual_cmd)}")
        print(f"[FFmpeg] Code retour: {process.returncode}")
        print(f"[FFmpeg] Stderr:\n{stderr_msg}")

        if process.returncode != 0:
            raise RuntimeError(f"FFmpeg error ({process.returncode}): {stderr_msg}")

        return stderr_msg
