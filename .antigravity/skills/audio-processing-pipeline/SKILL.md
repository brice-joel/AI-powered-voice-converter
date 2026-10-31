---
name: audio-processing-pipeline
description: Pipeline de transformation vocale, encodage et formats WhatsApp/Telegram PTT.
---

# Pipeline de Traitement Audio & Formats de Messagerie

Ce skill décrit les règles acoustiques et les étapes de transformation du son dans le projet VoiceMorph.

## 1. Chaîne de Traitement Audio
1. **Normalisation de l'entrée** : Détection du niveau sonore de crête et application d'un compresseur léger pour homogénéiser la voix avant filtrage.
2. **Filtrage Formantique / Pitch Shifting (Phase 1 DSP)** :
   - Modification conjointe du pitch (`asetrate`) et correction de tempo (`atempo`) pour éviter l'effet d'accélération/ralentissement de la parole.
   - Égalisation paramétrique (`equalizer`) pour adapter la brillance et la résonance du timbre cible.
3. **Encodage Cible (WhatsApp / Telegram)** :
   - Codec : `libopus`.
   - Conteneur : `ogg`.
   - VBR : Activé (`-vbr on`).
   - Bitrate : 32 kbps (optimisé pour la transmission réseau et la restitution PTT).
   - Sample rate : 16000 Hz ou 48000 Hz, canal mono.

## 2. Inférence Neurale RVC (Phase 2)
- Modèle cible : RVC v2 (Retrieval-based Voice Conversion).
- Pré-traitement : Extraction de la fondamentale (F0) avec algorithme Harvest ou Crepe pour une grande précision mélodique.
- Post-traitement : Normalisation et conversion FFmpeg Opus PTT identique à la Phase 1.

