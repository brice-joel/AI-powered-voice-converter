# VoiceMorph - Mobile Voice Converter

Application mobile et backend de conversion de voix en temps réel / quasi-instantané pour applications de messagerie (WhatsApp, Telegram).

## Vision du Projet

Permettre à un utilisateur mobile d'enregistrer un message vocal (soit directement dans l'application, soit via une bulle flottante au-dessus d'autres applications), de transformer sa voix selon différents avatars vocaux (fille, grand-père, deep voice, robot, etc.) sans altérer le texte ni les intonations, puis de le partager en tant que **vrai message vocal (Voice Note avec waveform)** dans WhatsApp ou Telegram.

---

## Structure du Repository

```text
voice-convertor/
├── .antigravity/
│   └── skills/                       # Guides de pilotage IA & standards de dev
│       ├── react-native-best-practices/
│       │   └── SKILL.md
│       ├── fastapi-best-practices/
│       │   └── SKILL.md
│       ├── typescript-strict/
│       │   └── SKILL.md
│       ├── mobile-backend-security/
│       │   └── SKILL.md
│       └── audio-processing-pipeline/
│           └── SKILL.md
├── conception/                       # Documentation d'architecture & design
│   ├── ARCHITECTURE.md               # Diagrammes de flux et séquence
│   ├── AUDIO_SPECS.md                # Spécifications formats audio (WhatsApp PTT)
│   └── OVERLAY_STRATEGY.md           # Stratégie bulle flottante Android
├── backend/                          # API FastAPI (Python)
│   ├── app/
│   │   ├── api/                      # Routes REST
│   │   │   └── v1/
│   │   │       ├── endpoints/        # convert.py, presets.py, health.py
│   │   │       └── router.py
│   │   ├── core/                     # config.py, security.py
│   │   ├── services/                 # dsp_service.py, ffmpeg_service.py, rvc_service.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── tests/
├── frontend/                         # Application Mobile React Native (Expo)
│   ├── src/
│   │   ├── components/               # Composants UI (Recorder, Presets, Waveform)
│   │   ├── screens/                  # Écrans (HomeScreen, OverlaySettings)
│   │   ├── services/                 # audioService, apiService, shareService
│   │   ├── types/                    # Interfaces TypeScript
│   │   └── App.tsx
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── ROADMAP.md                        # Jalons d'avancement (MVP DSP -> Pro RVC)
├── AGENTS.md                         # Directives de pair programming pour agents IA
└── README.md
```

---

## Démarrage Rapide

### 1. Backend (FastAPI)

Pré-requis : Python 3.10+ et `ffmpeg` installé sur la machine.

```bash
cd backend
python -m venv venv
# Sur Windows:
.\venv\Scripts\activate
# Sur Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Accéder à la documentation interactive : `http://localhost:8000/docs`

### 2. Frontend (React Native - Expo)

Pré-requis : Node.js 18+ et l'application mobile Expo Go ou un émulateur Android.

```bash
cd frontend
npm install
npx expo start
```

