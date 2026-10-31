import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VoicePresetSelector } from '@/components/VoicePresetSelector';
import { RecordButton } from '@/components/RecordButton';
import { ConvertedAudioCard } from '@/components/ConvertedAudioCard';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useVoiceConverter } from '@/hooks/useVoiceConverter';
import { apiService } from '@/services/apiService';
import { VoicePreset, VoicePresetId } from '@/types';

export default function VoiceMorphScreen() {
  const [presets, setPresets] = useState<VoicePreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<VoicePresetId>('girl');

  const {
    isRecording,
    formattedDuration,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  const {
    isConverting,
    convertedUri,
    latencyMs,
    convertVoice,
    reset,
  } = useVoiceConverter();

  useEffect(() => {
    apiService.fetchPresets().then(setPresets).catch(console.error);
  }, []);

  const handleStartRecord = async () => {
    try {
      reset();
      await startRecording();
    } catch (err: any) {
      Alert.alert('Microphone', err.message);
    }
  };

  const handleStopRecord = async () => {
    try {
      const uri = await stopRecording();
      if (uri) {
        await convertVoice(uri, selectedPreset);
      }
    } catch (err: any) {
      Alert.alert('Conversion', err.message || 'Échec de la transformation vocale');
    }
  };

  const currentPresetName =
    presets.find((p) => p.id === selectedPreset)?.name || selectedPreset;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>VoiceMorph</Text>
          <Text style={styles.subtitle}>Transformeur de Voix WhatsApp PTT</Text>
        </View>

        <VoicePresetSelector
          presets={presets}
          selectedPreset={selectedPreset}
          onSelectPreset={setSelectedPreset}
        />

        <RecordButton
          isRecording={isRecording}
          isConverting={isConverting}
          formattedDuration={formattedDuration}
          onStart={handleStartRecord}
          onStop={handleStopRecord}
        />

        {convertedUri && (
          <ConvertedAudioCard
            audioUri={convertedUri}
            latencyMs={latencyMs}
            presetName={currentPresetName}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});
