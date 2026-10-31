import * as FileSystem from 'expo-file-system';
import { VoicePreset, VoicePresetId } from '../types';

// Récupération de l'URL depuis le fichier .env (préfixé par EXPO_PUBLIC_)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.127:8000/api/v1';

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
   * Envoie le fichier audio au backend pour conversion et écrit le résultat .ogg en local
   */
  async convertVoice(audioUri: string, preset: VoicePresetId): Promise<string> {
    const uploadUrl = `${API_BASE_URL}/convert`;
    
    // Téléversement multipart vers FastAPI avec demande du format base64
    const response = await FileSystem.uploadAsync(uploadUrl, audioUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'audio',
      parameters: { 
        preset,
        response_format: 'base64'
      },
    });

    if (response.status !== 200) {
      let errorDetail = response.body;
      try {
        const errorJson = JSON.parse(response.body);
        errorDetail = errorJson.detail || response.body;
      } catch {
        // keep text
      }
      throw new Error(`Erreur serveur (${response.status}) : ${errorDetail}`);
    }

    // Décodage du JSON renvoyé par le backend
    const jsonResult = JSON.parse(response.body);
    if (!jsonResult.audio_base64) {
      throw new Error("Réponse serveur invalide : audio_base64 manquant.");
    }

    // Sauvegarde atomique du fichier binaire .ogg dans le cache de l'application
    const targetPath = `${FileSystem.cacheDirectory}voice_${Date.now()}_${preset}.ogg`;
    await FileSystem.writeAsStringAsync(targetPath, jsonResult.audio_base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return targetPath;
  }
};

