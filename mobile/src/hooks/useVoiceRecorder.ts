import { useState, useRef, useEffect, useCallback } from 'react';
import { audioService } from '@/services/audioService';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    setAudioUri(null);
    setRecordDuration(0);
    await audioService.startRecording();
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setRecordDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const uri = await audioService.stopRecording();
    setIsRecording(false);
    setAudioUri(uri);
    return uri;
  }, []);

  const formattedDuration = `${Math.floor(recordDuration / 60)
    .toString()
    .padStart(2, '0')}:${(recordDuration % 60).toString().padStart(2, '0')}`;

  return {
    isRecording,
    recordDuration,
    formattedDuration,
    audioUri,
    startRecording,
    stopRecording,
  };
}

