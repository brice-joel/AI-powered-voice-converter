export type VoicePresetId = 'girl' | 'grandfather' | 'deep_man' | 'robot' | 'chipmunk';

export interface VoicePreset {
  id: VoicePresetId;
  name: string;
  description: string;
}

export type RecordingStatus = 'idle' | 'recording' | 'processing' | 'ready' | 'error';

export interface ConvertedAudioResult {
  localUri: string;
  preset: VoicePresetId;
  durationMs?: number;
}

