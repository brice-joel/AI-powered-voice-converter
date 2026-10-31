import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  isRecording: boolean;
  isConverting: boolean;
  formattedDuration: string;
  onStart: () => void;
  onStop: () => void;
}

export const RecordButton: React.FC<Props> = ({
  isRecording,
  isConverting,
  formattedDuration,
  onStart,
  onStop,
}) => {
  if (isConverting) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.convertingText}>Transformation vocale en cours...</Text>
          <Text style={styles.subText}>Encodage OGG Opus WhatsApp</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isRecording && (
        <Text style={styles.durationText}>{formattedDuration}</Text>
      )}

      <TouchableOpacity
        style={[styles.outerRing, isRecording && styles.outerRingActive]}
        onPress={isRecording ? onStop : onStart}
        activeOpacity={0.8}
      >
        <View style={[styles.innerButton, isRecording && styles.innerButtonActive]} />
      </TouchableOpacity>

      <Text style={styles.hint}>
        {isRecording
          ? 'Appuyez pour terminer le vocal'
          : 'Appuyez pour enregistrer'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  durationText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
    fontVariant: ['tabular-nums'],
  },
  outerRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1e293b',
    borderWidth: 4,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRingActive: {
    borderColor: '#ef4444',
    backgroundColor: '#450a0a',
  },
  innerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#38bdf8',
  },
  innerButtonActive: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
  },
  loadingBox: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertingText: {
    color: '#38bdf8',
    fontWeight: 'bold',
    marginTop: 8,
  },
  subText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
});

