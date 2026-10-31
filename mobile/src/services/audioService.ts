import {
  AudioModule,
  createAudioPlayer,
  AudioPlayer,
  AudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';

export const audioService = {
  recorderInstance: null as AudioRecorder | null,
  playerInstance: null as AudioPlayer | null,

  async requestPermissions(): Promise<boolean> {
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      return granted;
    } catch (error) {
      console.warn("Erreur lors de la demande de permissions d'enregistrement :", error);
      return false;
    }
  },

  async configureAudioMode(): Promise<void> {
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    } catch (error) {
      console.warn("Erreur lors de la configuration du mode audio :", error);
    }
  },

  async startRecording(): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error("Permission d'accès au micro refusée.");
    }

    await this.configureAudioMode();

    if (this.recorderInstance) {
      try {
        await this.recorderInstance.stop();
      } catch {
        // Ignorer l'erreur si déjà stoppé
      }
      this.recorderInstance = null;
    }

    const recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
    // Passer RecordingPresets.HIGH_QUALITY garantit le formatage des options spécifiques Android (AAC / MPEG4)
    await recorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
    recorder.record();
    this.recorderInstance = recorder;
  },

  async stopRecording(): Promise<string | null> {
    if (!this.recorderInstance) return null;

    try {
      await this.recorderInstance.stop();
      // Temporisation de 200ms pour garantir la finalisation et le flush du conteneur audio sur disque
      await new Promise((resolve) => setTimeout(resolve, 200));
      const uri = this.recorderInstance.uri;
      this.recorderInstance = null;
      return uri;
    } catch (e) {
      this.recorderInstance = null;
      throw e;
    }
  },

  async playAudio(uri: string, onFinish?: () => void): Promise<void> {
    if (this.playerInstance) {
      try {
        this.playerInstance.pause();
        this.playerInstance.remove();
      } catch {
        // Ignorer si déjà libéré
      }
      this.playerInstance = null;
    }

    const player = createAudioPlayer(uri);
    this.playerInstance = player;

    if (onFinish) {
      player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          onFinish();
        }
      });
    }

    player.play();
  },

  async stopPlayback(): Promise<void> {
    if (this.playerInstance) {
      try {
        this.playerInstance.pause();
        this.playerInstance.remove();
      } catch {
        // Ignorer si déjà libéré
      }
      this.playerInstance = null;
    }
  }
};
