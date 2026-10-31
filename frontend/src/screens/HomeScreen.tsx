import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AudioRecorder } from '../components/AudioRecorder';
import { VoicePresetSelector } from '../components/VoicePresetSelector';
import { audioService } from '../services/audioService';
import { apiService } from '../services/apiService';
import { shareService } from '../services/shareService';
import { VoicePreset, VoicePresetId, RecordingStatus } from '../types';

export const HomeScreen: React.FC = () => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [presets, setPresets] = useState<VoicePreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<VoicePresetId>('girl');
  const [convertedAudioUri, setConvertedAudioUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    // Chargement des presets au démarrage
    apiService.fetchPresets().then(setPresets).catch(console.error);

    return () => {
      audioService.stopPlayback();
    };
  }, []);

  const handleStartRecord = async () => {
    try {
      setConvertedAudioUri(null);
      await audioService.startRecording();
      setStatus('recording');
    } catch (err: any) {
      Alert.alert('Erreur micro', err.message);
    }
  };

  const handleStopRecord = async () => {
    try {
      const uri = await audioService.stopRecording();
      if (!uri) {
        setStatus('idle');
        return;
      }

      setStatus('processing');
      // Conversion vers le backend
      const resultUri = await apiService.convertVoice(uri, selectedPreset);
      setConvertedAudioUri(resultUri);
      setStatus('ready');
    } catch (err: any) {
      Alert.alert('Erreur conversion', err.message || 'Échec du traitement audio');
      setStatus('idle');
    }
  };

  const handlePreview = async () => {
    if (!convertedAudioUri) return;
    if (isPlaying) {
      await audioService.stopPlayback();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await audioService.playAudio(convertedAudioUri, () => setIsPlaying(false));
    }
  };

  const handleShare = async () => {
    if (!convertedAudioUri) return;
    await shareService.shareVoiceNote(convertedAudioUri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VoiceMorph</Text>
        <Text style={styles.subtitle}>Transformeur de Voix pour WhatsApp & Telegram</Text>
      </View>

      <VoicePresetSelector
        presets={presets}
        selectedPreset={selectedPreset}
        onSelectPreset={setSelectedPreset}
      />

      <AudioRecorder
        status={status}
        onStartRecord={handleStartRecord}
        onStopRecord={handleStopRecord}
      />

      {convertedAudioUri && (
        <View style={styles.actionsCard}>
          <Text style={styles.successLabel}>Vocal transformé avec succès !</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.previewBtn} onPress={handlePreview}>
              <Text style={styles.btnText}>{isPlaying ? 'Pause' : 'Écouter'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.btnText}>Envoyer sur WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  actionsCard: {
    margin: 20,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  successLabel: {
    color: '#4ade80',
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  previewBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#334155',
    borderRadius: 10,
  },
  shareBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#22c55e',
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

