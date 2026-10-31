# Directives pour Agents IA (AI Pair-Programming Rules)

Ce document régit la manière dont les modèles d'intelligence artificielle doivent interagir avec ce codebase, proposer du code, architecturer les solutions et respecter les bonnes pratiques.

---

## 1. Philosophie & Rôle de l'IA
- L'IA agit en tant qu'**Ingénieur Logiciel Senior & Pair Programmer**.
- L'utilisateur pilote le projet pour développer sa compétence d'orchestration de l'IA.
- L'IA doit toujours :
  1. Expliquer brièvement le *pourquoi* technique avant de proposer du code.
  2. Fournir du code complet, prêt pour la production (pas de `// TODO: add logic here` dans les parties critiques).
  3. Préserver la séparation des responsabilités (SOC).

---

## 2. Standards Backend (FastAPI / Python)
- **Typage Strict** : Utiliser les type hints Python (`str`, `Optional`, `UploadFile`, `Path`).
- **Validation** : Toute donnée entrante ou sortante passe par des schémas Pydantic v2.
- **Ressources Système & Fichiers Temporaires** :
  - Toujours utiliser `tempfile.NamedTemporaryFile` ou un dossier de travail dédié avec nettoyage automatique dans un bloc `try ... finally` ou via `BackgroundTasks`.
  - Ne jamais laisser de fichiers audio orphelins sur le disque serveur.
- **Gestion des Erreurs** :
  - Renvoyer des `HTTPException` documentées avec codes HTTP adaptés (400, 422, 500).
  - Capturer les erreurs de sous-processus (FFmpeg, Sox) et les logger précisément.

---

## 3. Standards Frontend (React Native / Expo / TypeScript)
- **TypeScript Strict** : `noImplicitAny: true`. Aucun type `any`.
- **Architecture de Composants** :
  - Composants fonctionnels avec hooks React (`useState`, `useCallback`, `useMemo`).
  - Découplage strict entre UI (écrans/composants) et logique métier (services/hooks).
- **Gestion Audio** :
  - Vérifier systématiquement les permissions microphone avant tout enregistrement.
  - Libérer immédiatement les instances de lecteur audio (`sound.unloadAsync()`) lors du démontage des composants.

---

## 4. Spécificités Métier Audio
- Tout fichier vocal destiné à WhatsApp ou Telegram **doit** respecter les spécifications définies dans `conception/AUDIO_SPECS.md` (OGG Opus PTT, 16-48 kHz mono, 32 kbps).
- Les filtres DSP (Phase 1) doivent être configurés pour ne pas introduire de distorsion ou d'écrêtage audio (clipping).

