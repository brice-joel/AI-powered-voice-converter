---
category: technical-reference
target_audience: developers, integrator
tags: [api, fastapi, rest, endpoints, audio, curl, openapi]
last_updated: 2026-10-31
---

# Spécification de l'API REST VoiceMorph

L'API de VoiceMorph est propulsée par **FastAPI** et documentée nativement selon la spécification OpenAPI 3.0.

- **Base URL locale** : `http://localhost:8000/api/v1`
- **Swagger UI interactif** : `http://localhost:8000/docs`
- **ReDoc alternatif** : `http://localhost:8000/redoc`

---

## 1. GET `/health`
Vérifie la disponibilité opérationnelle du backend et contrôle la présence du moteur FFmpeg sur la machine hôte.

- **Méthode** : `GET`
- **Authentification** : Aucune
- **Exemple de Requête** :
  ```bash
  curl -X GET "http://localhost:8000/api/v1/health"
  ```
- **Réponse HTTP 200 (Succès)** :
  ```json
  {
    "status": "online",
    "ffmpeg_available": true
  }
  ```

---

## 2. GET `/presets/`
Retourne la liste des avatars vocaux configurés, utilisable par l'application mobile pour construire dynamiquement son carrousel d'options.

- **Méthode** : `GET`
- **Authentification** : Aucune
- **Exemple de Requête** :
  ```bash
  curl -X GET "http://localhost:8000/api/v1/presets/"
  ```
- **Réponse HTTP 200 (Succès)** :
  ```json
  {
    "presets": [
      {
        "id": "girl",
        "name": "Fille / Aiguë",
        "description": "Voix plus haute et claire avec équilibrage formantique"
      },
      {
        "id": "grandfather",
        "name": "Grand-père / Âgé",
        "description": "Voix plus grave avec léger chevrotement"
      },
      {
        "id": "deep_man",
        "name": "Homme Grave / Deep Voice",
        "description": "Voix basse, profonde et chaleureuse"
      },
      {
        "id": "robot",
        "name": "Robot",
        "description": "Effet robotique métallique"
      },
      {
        "id": "chipmunk",
        "name": "Chipmunk / Écureuil",
        "description": "Voix comique très aiguë"
      }
    ]
  }
  ```

---

## 3. POST `/convert`
Reçoit un enregistrement audio brut en `multipart/form-data`, applique le filtre de transformation choisi, ré-encode en OGG Opus PTT et renvoie le flux binaire.

- **Méthode** : `POST`
- **Content-Type** : `multipart/form-data`
- **Paramètres Form** :
  | Champ | Type | Obligatoire | Description |
  | :--- | :--- | :--- | :--- |
  | `audio` | File (Binary) | Oui | Fichier audio (.m4a, .wav, .mp3, .ogg). Max: 15 Mo. |
  | `preset` | String | Oui | Identifiant du preset (`girl`, `grandfather`, `deep_man`, `robot`, `chipmunk`). |

- **Exemple cURL** :
  ```bash
  curl -X POST "http://localhost:8000/api/v1/convert" \
    -F "audio=@mon_vocal.m4a" \
    -F "preset=girl" \
    --output vocal_transforme.ogg
  ```

- **En-têtes de Réponse HTTP 200** :
  - `Content-Type: audio/ogg`
  - `Content-Disposition: attachment; filename="voice_girl.ogg"`
  - `X-Voice-Preset: girl`

- **Codes d'Erreur** :
  - `400 Bad Request` : Format audio non supporté ou preset inconnu.
  - `413 Payload Too Large` : Taille de fichier excédant 15 Mo.
  - `500 Internal Server Error` : Défaillance de l'encodage FFmpeg.
