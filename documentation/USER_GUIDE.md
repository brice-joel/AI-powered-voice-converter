---
category: client-guide
target_audience: end-users, developers
tags: [usage, whatsapp, telegram, voice, mobile, overlay]
last_updated: 2026-10-31
---

# Guide Utilisateur - VoiceMorph

## 1. Qu'est-ce que VoiceMorph ?

VoiceMorph est une solution mobile et backend conçue pour transformer la voix d'un utilisateur en temps réel ou quasi-instantané lors de l'envoi de messages vocaux sur des applications de messagerie comme **WhatsApp** et **Telegram**.

Contrairement aux outils de synthèse vocale (TTS) qui lisent un texte avec une voix artificielle, VoiceMorph réalise une **conversion de voix à voix (Voice-to-Voice)** :
- Vos intonations, votre émotion, vos hésitations et votre rythme de parole sont **strictement conservés**.
- Seul le timbre vocal (la signature acoustique) est modifié pour adopter l'avatar choisi (fille, grand-père, voix grave, robot, etc.).
- Le message final est formaté en **OGG Opus PTT (Push-To-Talk)**, ce qui permet à WhatsApp et Telegram de l'afficher directement avec la waveform verte et le lecteur vocal officiel.

---

## 2. Les Deux Modes d'Utilisation

### Mode A : Enregistrement In-App (Standard)
1. Ouvrez l'application **VoiceMorph**.
2. Parcourez la liste des avatars vocaux et sélectionnez votre préféré (ex: *Fille / Aiguë* ou *Grand-père*).
3. Cliquez sur le bouton central d'enregistrement (le cercle devient rouge).
4. Parlez dans le microphone de votre téléphone.
5. Cliquez à nouveau sur le bouton pour arrêter l'enregistrement.
6. L'application envoie l'audio au serveur, applique la transformation acoustique et renvoie le fichier optimisé en moins d'une seconde.
7. Cliquez sur **"Écouter"** pour prévisualiser le résultat.
8. Cliquez sur **"Envoyer sur WhatsApp"** : WhatsApp s'ouvre sur votre écran de sélection de contact, prêt à délivrer le vocal natif !

### Mode B : Bulle Flottante (Android Overlay)
1. Activez l'option *Bulle flottante* dans les réglages de VoiceMorph (autorisation `Afficher par-dessus d'autres applications`).
2. Ouvrez n'importe quelle discussion dans WhatsApp ou Telegram.
3. Une icône ronde discrète flotte sur le bord de votre écran.
4. Maintenez le doigt appuyé sur la bulle pour enregistrer votre message.
5. Relâchez : un menu rapide vous propose les 3 voix les plus fréquentes.
6. Cliquez sur la voix désirée : le fichier est converti et immédiatement proposé à l'envoi dans la conversation en cours.

---

## 3. Les Avatars Vocaux Disponibles (Presets Phase 1)

| Identifiant Preset | Nom Affiché | Caractéristiques Sonores | Cas d'Usage Idéal |
| :--- | :--- | :--- | :--- |
| `girl` | Fille / Aiguë | Pitch rehaussé (+4.5 demi-tons), formants clairs | Voix féminine jeune et naturelle |
| `grandfather` | Grand-père / Âgé | Voix légèrement ralentie, grave avec tremolo | Imitation d'une personne âgée |
| `deep_man` | Homme Grave | Fréquences fondamentales basses amplifiées | Voix radio, narrateur sérieux |
| `robot` | Robot | Modulation en anneau et écho métallique court | Effet science-fiction |
| `chipmunk` | Chipmunk / Écureuil | Pitch très aigu (+7 demi-tons), coupe-bas | Humour, gags et jeux |
