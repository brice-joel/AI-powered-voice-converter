# Roadmap du Projet - VoiceMorph

Ce document décrit les jalons de développement, depuis le prototype initial jusqu'à la version production avec IA neuronale avancée.

---

## 🎯 Phase 1 : MVP DSP (Objectif : Validation UX, Latence < 1s)

Validation de la boucle complète d'utilisation : Enregistrement -> Transformation instantanée DSP -> Réception -> Partage WhatsApp en voice note natif.

- [x] **Architecture & Conception**
  - [x] Arborescence structurée et standardisée.
  - [x] Spécifications techniques audio (WhatsApp Opus/OGG PTT).
  - [x] Directives de gouvernance pour le pilotage de l'IA (AGENTS.md + Skills).
- [ ] **Backend FastAPI (DSP Engine)**
  - [ ] Configuration de l'application FastAPI, CORS et gestion d'erreurs.
  - [ ] Service `ffmpeg_service.py` : Conversion OGG Opus (32 kbps, 16 kHz mono).
  - [ ] Service `dsp_service.py` : Filtres acoustiques (Voix Fille, Homme Grave, Grand-père, Robot, Chipmunk).
  - [ ] Endpoint `POST /api/v1/convert` : Upload multipart audio + preset + renvoi du stream OGG.
  - [ ] Tests unitaires du backend avec pytest.
- [ ] **Frontend React Native (Expo in-app)**
  - [ ] Setup du projet Expo avec TypeScript strict.
  - [ ] Service d'enregistrement audio (`audioService.ts`) avec permission microphone.
  - [ ] Interface utilisateur : Visualiseur d'enregistrement et sélecteur de presets.
  - [ ] Service de partage (`shareService.ts`) vers WhatsApp & Telegram via Intent natif.

---

## 🚀 Phase 2 : Bulle Flottante Android (Floating Overlay)

Permettre à l'utilisateur d'enregistrer et de transformer sa voix directement par-dessus WhatsApp sans quitter la conversation.

- [ ] Configuration Android `SYSTEM_ALERT_WINDOW` & Foreground Service.
- [ ] Composant overlay flottant rétractable (icône bulle déplaçable au doigt).
- [ ] Interface miniature Push-To-Talk dans la bulle avec sélection rapide de l'avatar.
- [ ] Injection directe du fichier transformé dans la conversation active.

---

## 🧠 Phase 3 : Qualité Pro (Pipeline IA / RVC v2)

Remplacer les filtres DSP par des modèles d'IA de conversion de voix (Retrieval-based Voice Conversion) pour un réalisme absolu.

- [ ] Intégration du moteur d'inférence RVC v2 dans FastAPI (PyTorch / ONNX Runtime).
- [ ] Banque de modèles pré-entraînés (.pth / .index) :
  - Avatar Voix Féminine naturelle.
  - Avatar Grand-père / Voix mature.
  - Avatar Célébrité / Personnage.
- [ ] Optimisation de la latence : Quantization des modèles et inférence GPU (ou CPU multithreadé optimisé).
- [ ] Mode hybride : fallback automatique sur DSP si le serveur IA est saturé ou hors-ligne.

---

## 🛡️ Phase 4 : Production & Monétisation (Optionnel)

- [ ] Authentification utilisateur (JWT / API Keys) si service multi-tenant.
- [ ] Cache Redis pour les presets audio fréquents.
- [ ] Conteneurisation Docker & déploiement Cloud (FastAPI sur GPU instance type RunPod / GCP Vertex / HuggingFace).

