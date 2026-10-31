from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "VoiceMorph API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Sécurité & limites
    MAX_AUDIO_SIZE_MB: int = 15
    ALLOWED_AUDIO_EXTENSIONS: List[str] = [".wav", ".mp3", ".m4a", ".aac", ".ogg", ".opus", ".3gp"]
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

