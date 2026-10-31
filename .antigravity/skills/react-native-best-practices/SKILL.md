---
name: react-native-best-practices
description: Directives d'architecture, performance et gestion audio pour applications React Native avec Expo et TypeScript.
---

# Bonnes Pratiques React Native (Expo & Mobile Audio)

Ce skill définit les standards obligatoires pour le développement mobile du projet VoiceMorph.

## 1. Structure et Modularité
- Séparer strictement la vue (`components/`, `screens/`) de la logique métier (`services/`, `hooks/`).
- Aucun appel réseau (`fetch`/`axios`) direct dans les composants UI : toujours passer par `src/services/apiService.ts`.
- Gérer l'état local avec des hooks personnalisés (ex: `useAudioRecorder`, `usePresets`).

## 2. Gestion du Cycle de Vie Audio (Expo-AV)
- **Permissions** : Toujours vérifier `Audio.getPermissionsAsync()` puis `Audio.requestPermissionsAsync()` avant d'instancier un enregistrement.
- **Audio Mode** : Configurer systématiquement le mode audio au démarrage de l'app :
  ```typescript
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
  ```
- **Libération mémoire** : Toujours invoquer `recording.stopAndUnloadAsync()` ou `sound.unloadAsync()` dans la fonction de nettoyage d'un `useEffect` pour éviter les fuites mémoires et le verrouillage du micro.

## 3. Performance & UI
- Éviter les re-renders inutiles en mémoïsant les callbacks avec `useCallback`.
- Pour les animations d'ondes sonores (waveform), privilégier `react-native-reanimated` fonctionnant sur le thread UI natif.

