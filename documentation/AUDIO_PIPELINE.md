---
category: technical-deepdive
target_audience: audio-engineers, ai-engineers, developers
tags: [dsp, rvc, ffmpeg, opus, latency, acoustics, whatsapp, telegram]
last_updated: 2026-10-31
---

# Pipeline de Traitement Audio & Acoustique

Ce document détaille les transformations physiques et acoustiques appliquées aux signaux vocaux pour passer de la voix de l'utilisateur à un avatar vocal prêt pour WhatsApp et Telegram.

---

## 1. La Problématique des Messageries Mobiles (PTT vs Fichier Audio)

Lorsque WhatsApp reçoit un fichier audio :
1. Si le conteneur est un standard type `.mp3`, `.wav` ou `.m4a` sans métadonnées spécifiques, WhatsApp l'interprète comme un fichier musical externe (icône de note de musique, non jouable en continu, pas d'affichage de waveform).
2. Pour que WhatsApp l'affiche comme une **Note Vocale native (PTT / Push-To-Talk)** avec la waveform verte animée et la lecture accélérée (1.5x, 2x), le flux doit impérativement être formaté selon les normes suivantes :
   - **Codec** : `libopus`
   - **Conteneur** : `ogg`
   - **Sample Rate** : `16000 Hz` (ou `48000 Hz`)
   - **Canaux** : `1` (Mono)
   - **Bitrate** : `32 kbps` avec compression VBR

---

## 2. Le Moteur DSP Phase 1 (Pitch Shifting & Formants)

Le moteur DSP de VoiceMorph modifie la voix en quelques dizaines de millisecondes sans altérer le tempo (la vitesse de parole de l'utilisateur) :

```text
[Signal Entrant] 
      │
      ▼
[Resampling / Pitch Shift (asetrate)] ──> Modifie la fréquence fondamentale F0
      │
      ▼
[Compensation Tempo (atempo)] ──────────> Rétablit la vitesse originale
      │
      ▼
[Égalisation Formantique (equalizer)] ──> Colore le timbre (aigus/graves/poitrine)
      │
      ▼
[Effet Modulation (optionnel)] ─────────> Tremolo, flanger, écho court
      │
      ▼
[Encodage OGG Opus WhatsApp 32k]
```

### Détail des Filtres Appliqués :

- **Fille (`girl`)** :
  `asetrate=44100*1.30,atempo=1/1.30,equalizer=f=2500:t=q:w=1:g=3`
  - Rehausse le pitch de 30% (environ +4.5 demi-tons).
  - Égalise à 2.5 kHz pour simuler la résonance du conduit vocal féminin.

- **Homme Grave (`deep_man`)** :
  `asetrate=44100*0.78,atempo=1/0.78,equalizer=f=180:t=q:w=1:g=5`
  - Abaisse le pitch de 22% (environ -4 demi-tons).
  - Accentue les fréquences de poitrine autour de 180 Hz.

- **Grand-père (`grandfather`)** :
  `asetrate=44100*0.86,atempo=1/0.86,tremolo=f=4.5:d=0.25,equalizer=f=300:t=q:w=1:g=2`
  - Baisse modérée du pitch combinée à une oscillation d'amplitude (`tremolo`) à 4.5 Hz pour émuler la fragilité vocale.

---

## 3. Transition vers la Phase 2 (RVC v2 Neural Voice Conversion)

La Phase 2 introduira des réseaux de neurones profonds pour un réalisme vocal photo-réaliste :
- **Extraction F0** : Analyse continue de la hauteur mélodique par méthode Crepe ou Harvest.
- **ContentVec** : Extraction des représentations sémantiques et phonétiques sans dépendance au timbre d'origine.
- **Générateur HiFi-GAN** : Synthèse d'onde vocale dans le timbre de l'avatar cible.
- **Normalisation FFmpeg finale** : Le même exporteur OGG Opus PTT est réutilisé en sortie.
