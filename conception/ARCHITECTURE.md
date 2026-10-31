# Architecture & Flux de Données - VoiceMorph

Ce document détaille l'architecture système, les interactions entre composants et le cycle de vie d'un message vocal.

---

## 1. Diagramme d'Architecture Globale

```mermaid
graph TD
    subgraph Client [Application Mobile - React Native Expo]
        UI[UI Principale / Recorder]
        Overlay[Bulle Flottante Android Overlay]
        AudioRec[Service Audio Record - Expo-AV]
        ShareMgr[Service Partage Natif - Intent / ShareSheet]
    end

    subgraph Server [Backend FastAPI]
        Router[API Router - /api/v1]
        Val[Validation & File Inspector]
        
        subgraph Pipeline [Moteur de Transformation Audio]
            DSP[DSP Service - Pitch & Formants Shifter]
            RVC[RVC Service - Neural Voice Conversion]
            FFmpeg[FFmpeg Converter - OGG Opus WhatsApp PTT]
        end
        
        Cleaner[Background Task - Nettoyage Fichiers Temporaires]
    end

    subgraph MessagingApps [Applications Cibles]
        WhatsApp[WhatsApp Messenger]
        Telegram[Telegram]
    end

    UI -->|Déclenche Record| AudioRec
    Overlay -->|Déclenche Record| AudioRec
    AudioRec -->|Upload Audio M4A/WAV| Router
    Router --> Val
    Val -->|Phase 1| DSP
    Val -->|Phase 2| RVC
    DSP --> FFmpeg
    RVC --> FFmpeg
    FFmpeg -->|Retourne Audio OGG| ShareMgr
    FFmpeg -.->|Signal fin| Cleaner
    ShareMgr -->|Android Intent PTT| WhatsApp
    ShareMgr -->|Android Intent PTT| Telegram
```

---

## 2. Diagramme de Séquence Détaillé (Cycle de Vie d'un Voice)

```mermaid
sequenceDiagram
    autonumber
    actor User as Utilisateur
    participant App as React Native (In-App ou Overlay)
    participant API as FastAPI (Backend)
    participant Engine as Engine (DSP / FFmpeg)
    participant TargetApp as WhatsApp / Telegram

    User->>App: Début d'appui sur le bouton Enregistrer
    App->>App: Initialise Audio.Recording (WAV / M4A)
    User->>App: Parle dans le micro
    User->>App: Relâche le bouton Enregistrer
    App->>App: Arrête et finalise le fichier audio local
    
    User->>App: Sélectionne l'avatar vocal (ex: "girl", "grandfather")
    App->>API: POST /api/v1/convert (multipart/form-data: audio + preset)
    
    API->>API: Valide la taille et l'extension du fichier
    API->>Engine: Applique les filtres de pitch, formants et égalisation
    Engine->>Engine: Encodage libopus (32 kbps, 16 kHz mono, conteneur OGG)
    Engine-->>API: Fichier audio optimisé prêt
    
    API-->>App: Réponse HTTP 200 (Stream audio / binary OGG)
    API->>API: BackgroundTask : Suppression des fichiers temporaires
    
    App->>App: Sauvegarde du fichier reçu en cache local
    App->>TargetApp: Déclenche Intent Android (action: SEND, mimeType: audio/ogg)
    TargetApp-->>User: Affiche l'écran de sélection de contact / discussion active
    User->>TargetApp: Valide l'envoi
    Note over TargetApp: Le message vocal s'affiche avec la waveform native PTT !
```

---

## 3. Stratégie de Résilience & Performance

- **Latence Cible** : 
  - En Phase 1 (DSP) : Temps de traitement < 500 ms pour un message de 15 secondes.
  - En Phase 2 (RVC) : Temps de traitement < 2000 ms avec GPU.
- **Gestion Mémoire** : Aucun fichier audio n'est stocké en mémoire vive complète dans FastAPI ; ils sont traités via des descripteurs de fichiers temporaires (`tempfile`).
- **Mode Hors-Ligne (Futur)** : Le moteur DSP pourra être compilé en C++ natif (WebAssembly ou bibliothèque C++ via JSI) directement dans l'application mobile pour fonctionner sans connexion Internet.

