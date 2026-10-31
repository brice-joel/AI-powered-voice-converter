---
name: mobile-backend-security
description: Contrôles de sécurité pour la communication mobile-backend et la manipulation de fichiers audio.
---

# Contrôle de Sécurité Mobile & Backend

Ce skill définit les garde-fous de sécurité à appliquer sur les composants mobiles et l'API FastAPI.

## 1. Sécurité de l'Upload Audio (Backend)
- **Validation du MIME-type et de la taille** :
  - Rejeter les fichiers dépassant 10 Mo (un message vocal WhatsApp de 60 secondes fait généralement < 500 Ko).
  - Vérifier les signatures de fichiers (Magic bytes) pour refuser les fichiers malveillants déguisés en audio.
- **Défense contre l'injection de commandes FFmpeg** :
  - Ne jamais exécuter de commandes shell avec `shell=True` dans Python `subprocess`.
  - Toujours passer les arguments sous forme de liste de chaînes (`["ffmpeg", "-i", path, ...]`).
  - Nettoyer ou valider les chaînes de paramètres provenant des requêtes clientes.

## 2. Sécurité Mobile
- **Permissions Android à la demande** : Ne jamais demander la permission micro ou overlay sans écran explicatif préalable.
- **Stockage temporaire sécurisé** : Stocker les fichiers audio enregistrés dans le cache de l'application (`FileSystem.cacheDirectory`) plutôt que sur le stockage externe public.
- **Intents sécurisés** : Utiliser `FileProvider` sur Android pour accorder temporairement les droits de lecture (`FLAG_GRANT_READ_URI_PERMISSION`) à WhatsApp ou Telegram sans exposer tout le système de fichiers.

