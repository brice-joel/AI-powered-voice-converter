import * as FileSystem from 'expo-file-system';
import { VoicePreset, VoicePresetId } from '../types';

// Modifiez avec l'IP locale de votre machine de dev (ex: http://192.168.1.50:8000/api/v1)
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1'; // 10.0.2.2 pour l'émulateur Android

export const apiService = {
  /**
   * Récupère la liste des avatars vocaux disponibles
   */
  async fetchPresets(): Promise<VoicePreset[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/presets/`);
      if (!response.ok) throw new Error('Impossible de charger les presets');
      const data = await response.json();
      return data.presets;
    } catch (error) {
      console.warn('Fallback presets locaux suite à une erreur réseau:', error);
      return [
        { id: 'girl', name: 'Fille / Aiguë', description: 'Voix plus haute et claire' },
        { id: 'grandfather', name: 'Grand-père / Âgé', description: 'Voix mature avec tremolo' },
        { id: 'deep_man', name: 'Homme Grave', description: 'Voix basse et puissante' },
        { id: 'robot', name: 'Robot', description: 'Effet robotique métallique' },
        { id: 'chipmunk', name: 'Chipmunk', description: 'Voix drôle très aiguë' },
      ];
    }
  },

  /**
   * Envoie le fichier audio au backend pour conversion et télécharge le résultat .ogg
   */
  async convertVoice(audioUri: string, preset: VoicePresetId): Promise<string> {
    const uploadUrl = `${API_BASE_URL}/convert`;
    
    // Téléversement multipart via Expo FileSystem
    const response = await FileSystem.uploadAsync(uploadUrl, audioUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'audio',
      parameters: { preset },
    });

    if (response.status !== 200) {
      throw new Error(`Erreur serveur (${response.status}) : ${response.body}`);
    }

    // Le corps contient le fichier binaire OGG Opus, on le sauvegarde en local
    const targetPath = `${FileSystem.cacheDirectory}converted_${Date.now()}_${preset}.ogg`;
    
    // On télécharge directement le flux retourné dans un fichier OGG local
    const downloadRes = await FileSystem.downloadAsync(
      `${API_BASE_URL}/convert`,
      targetPath,
      {
        headers: {
          // Si besoin de headers additionnels
        }
      }
    ).catch(async () => {
      // Fallback si downloadAsync n'est pas utilisé : écriture en base64
      await FileSystem.writeAsStringAsync(targetPath, response.body, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return { uri: targetPath };
    });

    return downloadRes.uri;
  }
};

