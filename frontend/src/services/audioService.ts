import { Audio } from 'expo-av';

export const audioService = {
  recordingInstance: null as Audio.Recording | null,
  soundInstance: null as Audio.Sound | null,

  async requestPermissions(): Promise<boolean> {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  },

  async configureAudioMode(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  },

  async startRecording(): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error("Permission d'accès au micro refusée.");
    }

    await this.configureAudioMode();

    if (this.recordingInstance) {
      try {
        await this.recordingInstance.stopAndUnloadAsync();
      } catch {
        // ignore
      }
      this.recordingInstance = null;
    }

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    this.recordingInstance = recording;
  },

  async stopRecording(): Promise<string | null> {
    if (!this.recordingInstance) return null;

    await this.recordingInstance.stopAndUnloadAsync();
    const uri = this.recordingInstance.getURI();
    this.recordingInstance = null;
    return uri;
  },

  async playAudio(uri: string, onFinish?: () => void): Promise<void> {
    if (this.soundInstance) {
      await this.soundInstance.unloadAsync();
      this.soundInstance = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    this.soundInstance = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        if (onFinish) onFinish();
      }
    });
  },

  async stopPlayback(): Promise<void> {
    if (this.soundInstance) {
      await this.soundInstance.stopAsync();
      await this.soundInstance.unloadAsync();
      this.soundInstance = null;
    }
  }
};

