import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { RecordingStatus } from '../types';

interface Props {
  status: RecordingStatus;
  onStartRecord: () => void;
  onStopRecord: () => void;
}

export const AudioRecorder: React.FC<Props> = ({
  status,
  onStartRecord,
  onStopRecord,
}) => {
  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <View style={styles.processingBox}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.statusText}>Transformation de la voix en cours...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={isRecording ? onStopRecord : onStartRecord}
          activeOpacity={0.8}
        >
          <View style={[styles.innerCircle, isRecording && styles.innerCircleActive]} />
        </TouchableOpacity>
      )}

      <Text style={styles.hintText}>
        {isRecording
          ? 'Enregistrement en cours... Cliquez pour terminer'
          : isProcessing
          ? 'Optimisation du format WhatsApp Opus...'
          : 'Appuyez pour enregistrer votre vocal'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  recordButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#475569',
  },
  recordButtonActive: {
    backgroundColor: '#ef4444',
    borderColor: '#fca5a5',
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#38bdf8',
  },
  innerCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  processingBox: {
    alignItems: 'center',
    height: 84,
    justifyContent: 'center',
  },
  statusText: {
    marginTop: 8,
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '500',
  },
  hintText: {
    marginTop: 16,
    fontSize: 14,
    color: '#94a3b8',
  },
});

