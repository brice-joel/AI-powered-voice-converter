import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { audioService } from '@/services/audioService';
import { shareService } from '@/services/shareService';

interface Props {
  audioUri: string;
  latencyMs: number | null;
  presetName: string;
}

export const ConvertedAudioCard: React.FC<Props> = ({
  audioUri,
  latencyMs,
  presetName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    if (isPlaying) {
      await audioService.stopPlayback();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await audioService.playAudio(audioUri, () => setIsPlaying(false));
    }
  };

  const handleShare = async () => {
    try {
      await shareService.shareVoiceNote(audioUri);
    } catch {
      Alert.alert('Erreur', 'Impossible de partager le vocal.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.badgeText}>PRÊT POUR WHATSAPP (PTT)</Text>
          <Text style={styles.presetLabel}>Voix : {presetName}</Text>
        </View>
        {latencyMs !== null && (
          <Text style={styles.latency}>{latencyMs} ms</Text>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <Text style={styles.btnText}>{isPlaying ? '❚❚ Pause' : '▶ Écouter'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.btnText}>Envoyer sur WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#22c55e',
    letterSpacing: 0.5,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 2,
  },
  latency: {
    fontSize: 12,
    color: '#64748b',
    fontVariant: ['tabular-nums'],
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  playButton: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButton: {
    flex: 2,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

