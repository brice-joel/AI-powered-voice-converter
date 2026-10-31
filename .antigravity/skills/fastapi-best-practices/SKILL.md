---
name: fastapi-best-practices
description: Directives d'architecture, découplage et performance pour API FastAPI en Python.
---

# Bonnes Pratiques FastAPI & Audio Processing

Ce skill définit les standards pour l'architecture et l'implémentation du backend Python FastAPI.

## 1. Architecture Modulaire
- **Routers versionnés** : Préfixer les endpoints avec `/api/v1`.
- **Dépendances & Injection** : Utiliser `Depends()` pour la validation, les services et la configuration.
- **Pydantic v2** : Définir des schémas explicites pour les réponses API (`BaseModel`, `Field`).

## 2. Manipulation des Fichiers & Audio
- Pour la réception audio, utiliser `UploadFile` plutôt que `bytes` afin de supporter les fichiers volumineux sans saturer la RAM.
- Utiliser systématiquement `tempfile.NamedTemporaryFile` pour les entrées et sorties FFmpeg.
- **Nettoyage Garanti** : Utiliser `BackgroundTasks` de FastAPI pour supprimer les fichiers temporaires dès la réponse HTTP délivrée :
  ```python
  from fastapi import BackgroundTasks
  import os

  def remove_temp_file(path: str):
      if os.path.exists(path):
          os.remove(path)

  @router.post("/convert")
  async def convert(background_tasks: BackgroundTasks, file: UploadFile):
      # ... traitement ...
      background_tasks.add_task(remove_temp_file, temp_path)
      return FileResponse(output_path, media_type="audio/ogg")
  ```

## 3. Gestion des Erreurs et Sous-Processus
- Toujours capturer les exceptions de `subprocess.run` (FFmpeg) et logger `stderr`.
- Lever des `HTTPException(status_code=400, detail=...)` clairs et documentés.

