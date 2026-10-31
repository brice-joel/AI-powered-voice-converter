---
category: faq
target_audience: all
tags: [faq, troubleshooting, rag, errors, latency, quality, whatsapp]
last_updated: 2026-10-31
---

# Foire Aux Questions (FAQ) - VoiceMorph

Ce document rassemble les questions et réponses les plus courantes. Il est spécialement structuré pour alimenter les bases de connaissances vectorielles (RAG).

---

## 1. Fonctionnement Général

### Q : Est-ce que VoiceMorph change ce que je dis (le texte) ?
**R :** Non, absolument pas. VoiceMorph ne fait aucune transcription ni modification textuelle. Elle prend la matière sonore de votre voix et applique des filtres acoustiques (ou un modèle d'inférence neuronale) pour changer uniquement le timbre. Vos mots, votre accent, votre vitesse et vos émotions restent rigoureusement identiques.

### Q : Comment faire pour que WhatsApp affiche le vocal avec la waveform verte ?
**R :** WhatsApp exige un fichier au format OGG encodé avec le codec Opus à 16 kHz mono. VoiceMorph effectue automatiquement cette conversion pour chaque message vocal traité. Lors du partage, WhatsApp le détecte comme un enregistrement micro officiel (PTT - Push-To-Talk).

### Q : L'application fonctionne-t-elle sans connexion Internet ?
**R :** En Phase 1 (moteur DSP), la conversion est réalisée par le serveur FastAPI. Une future version compilera le moteur de filtres en C++ natif dans l'application mobile pour permettre un fonctionnement 100% hors-ligne. En Phase 2 (RVC), une connexion au backend est nécessaire pour exécuter les modèles d'IA sur GPU.

---

## 2. Dépannage & Erreurs Courantes

### Q : Pourquoi le serveur affiche-t-il `ffmpeg_available: false` ?
**R :** Cela signifie que l'exécutable FFmpeg n'a pas été trouvé dans le `PATH` du système d'exploitation hébergeant le backend. 
- Sur Windows : installez FFmpeg via `winget install Gyan.FFmpeg` ou téléchargez-le sur ffmpeg.org, puis ajoutez son dossier `bin` au `PATH`.
- Sur Linux/Docker : le Dockerfile fourni inclut déjà `RUN apt-get install -y ffmpeg`.

### Q : Pourquoi la commande `python` ne renvoie rien dans ma console Windows ?
**R :** Sur Windows 10 et 11, des alias d'exécution (`App Execution Aliases`) sont activés par défaut et interceptent `python.exe` pour rediriger vers le Microsoft Store. Pour utiliser votre véritable installation Python :
1. Utilisez la commande officielle `py` (le Windows Python Launcher).
2. Ou tapez "Alias d'exécution des applications" dans la barre de recherche Windows et désactivez les curseurs "Programme d'installation Python".

### Q : Quelle est la taille maximale d'un fichier audio envoyé ?
**R :** Par défaut, l'API accepte les fichiers audio jusqu'à **15 Mo**. Un message vocal classique de 30 secondes pèse généralement entre 100 Ko et 400 Ko.

### Q : Comment activer la bulle flottante par-dessus WhatsApp ?
**R :** Sur Android, vous devez accorder la permission système `Afficher par-dessus d'autres applications` (`SYSTEM_ALERT_WINDOW`) dans les paramètres de votre smartphone, dans la section *Applications > VoiceMorph > Autorisations spéciales*.
