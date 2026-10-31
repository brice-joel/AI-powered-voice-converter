import { useState, useCallback } from 'react';
import { apiService } from '@/services/apiService';
import { VoicePresetId } from '@/types';

export function useVoiceConverter() {
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUri, setConvertedUri] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertVoice = useCallback(async (localAudioUri: string, preset: VoicePresetId) => {
    setIsConverting(true);
    setError(null);
    const startTime = Date.now();

    try {
      const outputUri = await apiService.convertVoice(localAudioUri, preset);
      setConvertedUri(outputUri);
      setLatencyMs(Date.now() - startTime);
      return outputUri;
    } catch (err: any) {
      const msg = err.message || 'Échec de la transformation audio';
      setError(msg);
      throw err;
    } finally {
      setIsConverting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setConvertedUri(null);
    setLatencyMs(null);
    setError(null);
  }, []);

  return {
    isConverting,
    convertedUri,
    latencyMs,
    error,
    convertVoice,
    reset,
  };
}

