---
category: architecture
target_audience: software-architects, tech-leads, developers
tags: [architecture, design, patterns, stack, components, rag]
last_updated: 2026-10-31
---

# Architecture Globale du Système - VoiceMorph

Ce document présente l'architecture d'ensemble de VoiceMorph, les flux de données et les interactions entre les briques logicielles.

---

## 1. Vue d'Ensemble des Composants

```text
┌──────────────────────────────────────────────────────────────┐
│                    APPLICATION MOBILE (CLIENT)               │
│                                                              │
│  ┌────────────────────────┐      ┌────────────────────────┐  │
│  │   UI In-App (Expo-AV)  │      │  Overlay Flottant      │  │
│  │   - Push-To-Talk       │      │  - System Alert Window │  │
│  │   - Prévisualisation   │      │  - Foreground Service  │  │
│  └───────────┬────────────┘      └───────────┬────────────┘  │
│              │                               │               │
│              └───────────────┬───────────────┘               │
│                              │                               │
│             ┌────────────────▼────────────────┐              │
│             │   Services Clients              │              │
│             │   - audioService (Enregistre)   │              │
│             │   - apiService (Upload/Download)│              │
│             │   - shareService (Intent PTT)   │              │
│             └────────────────┬────────────────┘              │
└──────────────────────────────┼───────────────────────────────┘
                               │  HTTPS / Multipart POST
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    SERVEUR BACKEND (FASTAPI)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │   API Router (/api/v1)                                 │  │
│  │   - /health (Statut système & présence FFmpeg)         │  │
│  │   - /presets (Avatars vocaux disponibles)              │  │
│  │   - /convert (Upload audio + transformation)           │  │
│  └───────────────────────────┬────────────────────────────┘  │
│                              │                               │
│  ┌───────────────────────────▼────────────────────────────┐  │
│  │   Pipeline de Traitement Audio                         │  │
│  │   - Phase 1 : DSP Shifter (Pitch/Formants)             │  │
│  │   - Phase 2 : Inférence RVC (Réseau neuronal)          │  │
│  │   - Encodage : FFmpeg OGG Opus (32 kbps mono)          │  │
│  └───────────────────────────┬────────────────────────────┘  │
│                              │                               │
│  ┌───────────────────────────▼────────────────────────────┐  │
│  │   Gestionnaire de Tâches de Fond (BackgroundTasks)     │  │
│  │   - Purge automatique des fichiers temporaires         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                               │  Fichier binaire .ogg
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    APPLICATIONS CIBLES                       │
│                                                              │
│   WhatsApp Messenger          Telegram Messenger             │
│   (Affichage Waveform PTT)    (Affichage Waveform Native)    │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Principes Fondamentaux de Conception

1. **Stateless Backend** : Le backend FastAPI ne conserve aucun état de session utilisateur ni aucun fichier audio après la réponse. Tout est nettoyé immédiatement via `BackgroundTasks`.
2. **Faible Latence** : Le pipeline DSP de la Phase 1 s'exécute en sous-processus FFmpeg direct en C++, avec une latence inférieure à 400 millisecondes.
3. **Respect du Sandboxing Mobile** : L'intégration avec WhatsApp s'effectue via les mécanismes officiels du système d'exploitation (`Intent.ACTION_SEND` avec `FileProvider` sous Android) pour garantir le fonctionnement sans nécessiter de root.
