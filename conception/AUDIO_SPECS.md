# Spécifications Techniques Audio - WhatsApp & Telegram PTT

Ce document décrit en détail les exigences de formatage audio requises pour que les messageries reconnaissent le fichier comme un **vrai message vocal (Push-To-Talk / PTT)** avec la forme d'onde animée.

---

## 1. Exigences WhatsApp PTT

Si vous envoyez un fichier `.mp3` ordinaire, WhatsApp l'affiche sous forme de fichier joint musical (icône de note de musique avec bouton de téléchargement).

Pour que WhatsApp l'affiche avec **la waveform verte et le bouton play natif** :
- **Conteneur** : OGG (`.ogg` ou `.opus`)
- **Codec Audio** : Opus (`libopus`)
- **Fréquence d'échantillonnage (Sample Rate)** : 16 000 Hz (idéal pour la voix) ou 48 000 Hz.
- **Canaux** : 1 (Mono)
- **Débit (Bitrate)** : 24 kbps à 32 kbps (voix ultra claire, taille de fichier minimale)
- **VBR** : Activé (`-vbr on`)
- **Niveau de compression** : 10 (`-compression_level 10`)

### Commande FFmpeg type :
```bash
ffmpeg -y -i input.m4a \
  -c:a libopus \
  -b:a 32k \
  -vbr on \
  -compression_level 10 \
  -ar 16000 \
  -ac 1 \
  -f ogg \
  output.ogg
```

---

## 2. Exigences Telegram Voice Message

Telegram utilise un standard très similaire :
- Conteneur OGG avec codec Opus.
- L'API Telegram / Intent mobile accepte le MIME-type `audio/ogg` ou `audio/opus`.

---

## 3. Paramètres des Filtres DSP (Phase 1)

Pour changer de voix sans altérer le débit de parole ni le contenu :

| Preset | Pitch Shift (Demi-tons) | Filtre FFmpeg Principal | Égalisation / Formants |
| :--- | :--- | :--- | :--- |
| **Fille / Aiguë** | +4.5 demi-tons | `asetrate=44100*1.30,atempo=1/1.30` | Boost des hauts-médiums (+3dB à 2.5kHz) |
| **Homme Grave / Deep Voice** | -4 demi-tons | `asetrate=44100*0.79,atempo=1/0.79` | Boost des basses (+4dB à 180Hz) |
| **Grand-père / Voix Âgée** | -2.5 demi-tons | `asetrate=44100*0.86,atempo=1/0.86` | Légère résonance et tremolo (`tremolo=f=4:d=0.3`) |
| **Robot** | 0 (harmonique) | `flanger=delay=8:depth=6:regen=65` | Écho métallique court (`aecho=0.8:0.88:4:0.5`) |
| **Chipmunk / Drôle** | +7 demi-tons | `asetrate=44100*1.50,atempo=1/1.50` | Coupe-bas (< 300Hz) |

