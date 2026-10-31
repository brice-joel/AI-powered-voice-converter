import * as FileSystem from 'expo-file-system/legacy';
import { VoicePreset, VoicePresetId } from '../types';

// Adresse IP active de votre machine
const API_BASE_URL = 'http://192.168.1.127:8000/api/v1';

export const apiService = {
  /**
   * Récupère la liste des avatars vocaux disponibles sur le backend
   */
  async fetchPresets(): Promise<VoicePreset[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/presets/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.presets;
    } catch (error) {
      console.warn('Fallback presets locaux suite à une indisponibilité réseau :', error);
      return [
        { id: 'girl', name: 'Fille / Aiguë', description: 'Voix plus haute et claire avec équilibrage formantique' },
        { id: 'grandfather', name: 'Grand-père / Âgé', description: 'Voix plus grave avec léger chevrotement' },
        { id: 'deep_man', name: 'Homme Grave', description: 'Voix basse, profonde et chaleureuse' },
        { id: 'robot', name: 'Robot', description: 'Effet robotique métallique' },
        { id: 'chipmunk', name: 'Chipmunk', description: 'Voix comique très aiguë' },
      ];
    }
  },

  /**
   * Envoie le fichier audio au backend en JSON Base64 (100% compatible New Architecture React Native 0.88)
   * et écrit le résultat .ogg en local pour WhatsApp PTT
   */
  async convertVoice(audioUri: string, preset: VoicePresetId): Promise<string> {
    const uploadUrl = `${API_BASE_URL}/convert-base64`;
    
    // 1. Déduction du nom et extension du fichier
    const filename = audioUri.split('/').pop() || 'recording.m4a';

    // 2. Vérification de l'intégrité du fichier enregistré sur le smartphone
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    const fileSize = fileInfo.exists ? (fileInfo as any).size ?? -1 : 0;
    console.log(`[VoiceMorph] Fichier source: ${audioUri} (${fileSize} octets)`);

    if (!fileInfo.exists || fileSize === 0) {
      throw new Error("L'enregistrement microphone est vide (0 octet). Parlez bien dans le micro pendant au moins 2 secondes.");
    }

    // 3. Lecture du fichier audio enregistré en base64
    const encoding = FileSystem.EncodingType?.Base64 ?? ('base64' as any);
    const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
      encoding,
    });

    if (!audioBase64 || audioBase64.length === 0) {
      throw new Error("Impossible de lire les données audio du smartphone.");
    }

    console.log(`[VoiceMorph] Envoi vocal (${audioBase64.length} chars, fichier: ${filename}) vers ${uploadUrl}`);

    // 4. Envoi en JSON standard
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_base64: audioBase64,
        preset,
        filename,
        response_format: 'base64',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.detail || errorText;
      } catch {
        // texte brut
      }
      throw new Error(`Erreur serveur (${response.status}) : ${errorDetail}`);
    }

    // 5. Décodage du JSON renvoyé par le backend
    const jsonResult = await response.json();
    const data = typeof jsonResult === 'string' ? JSON.parse(jsonResult) : jsonResult;
    const base64Audio = data?.audio_base64 || data?.audioBase64 || data?.audio;

    if (!base64Audio) {
      const receivedKeys = data ? Object.keys(data).join(', ') : 'null';
      throw new Error(`Réponse serveur sans audio_base64. Clés reçues: [${receivedKeys}].`);
    }

    // 6. Sauvegarde atomique du fichier binaire .ogg dans le cache de l'application
    const baseDir = FileSystem.cacheDirectory || `${FileSystem.documentDirectory ?? ''}`;
    const targetPath = `${baseDir}voice_${Date.now()}_${preset}.ogg`;

    await FileSystem.writeAsStringAsync(targetPath, base64Audio, {
      encoding,
    });

    console.log(`[VoiceMorph] Fichier converti écrit dans : ${targetPath}`);
    return targetPath;
  }
};
