import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const shareService = {
  /**
   * Partage le fichier audio converti vers WhatsApp, Telegram ou toute autre messagerie.
   */
  async shareVoiceNote(fileUri: string): Promise<void> {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Erreur', 'Le partage de fichiers n\'est pas supporté sur cet appareil.');
      return;
    }

    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'audio/ogg',
        dialogTitle: 'Envoyer votre vocal transformé',
        UTI: 'public.audio',
      });
    } catch (error) {
      console.error('Erreur lors du partage :', error);
      Alert.alert('Erreur de partage', 'Impossible d\'envoyer le fichier audio.');
    }
  }
};

