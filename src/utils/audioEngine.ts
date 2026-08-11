import { VideoClip, VideoProjectData, VideoTrack } from "../types/video";
import { getInterpolatedValue } from "./videoRenderer";

// Audio Buffer Cache
const audioBufferCache: Map<string, AudioBuffer> = new Map();
const waveformPeaksCache: Map<string, number[]> = new Map();
let globalAudioCtx: AudioContext | null = null;

function getGlobalAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioCtx();
  }
  if (globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

// Asynchronously fetch and decode audio buffer
export async function getAudioBuffer(url: string): Promise<AudioBuffer | null> {
  if (!url) return null;
  if (audioBufferCache.has(url)) {
    return audioBufferCache.get(url)!;
  }

  try {
    const ctx = getGlobalAudioContext();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    audioBufferCache.set(url, audioBuffer);
    return audioBuffer;
  } catch (err) {
    console.warn("Failed to decode audio data for:", url, err);
    return null;
  }
}

// Get waveform peaks from real audio buffer or generate fallback
export async function getWaveformPeaks(url: string, numSamples: number = 100): Promise<number[]> {
  const cacheKey = `${url}_${numSamples}`;
  if (waveformPeaksCache.has(cacheKey)) {
    return waveformPeaksCache.get(cacheKey)!;
  }

  // Try real audio decoding
  const buffer = await getAudioBuffer(url);
  if (buffer) {
    const rawData = buffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / numSamples);
    const peaks: number[] = [];

    for (let i = 0; i < numSamples; i++) {
      const start = i * blockSize;
      let max = 0;
      for (let j = 0; j < blockSize; j += 4) { // sample step for speed
        const val = Math.abs(rawData[start + j]);
        if (val > max) max = val;
      }
      peaks.push(Math.min(1, Math.max(0.05, max)));
    }

    waveformPeaksCache.set(cacheKey, peaks);
    return peaks;
  }

  // Fallback procedural peaks
  const fallbackPeaks: number[] = [];
  let seed = 0;
  for (let i = 0; i < url.length; i++) {
    seed += url.charCodeAt(i);
  }

  for (let i = 0; i < numSamples; i++) {
    const val = 0.3 + 0.4 * Math.sin(i * 0.2 + seed) + 0.2 * Math.cos(i * 0.5);
    fallbackPeaks.push(Math.min(1, Math.max(0.08, Math.abs(val))));
  }

  return fallbackPeaks;
}

// Calculate instantaneous clip gain considering volume, mute, fades, keyframes
export function getClipGainAtTime(clip: VideoClip, relTime: number): number {
  if (clip.isMuted) return 0;
  if (relTime < 0 || relTime > clip.duration) return 0;

  // Keyframe volume interpolation
  const baseVol = getInterpolatedValue(clip, "volume", relTime, clip.volume);

  // Fade In / Fade Out envelope
  let fadeMult = 1;
  if (clip.fadeIn > 0 && relTime < clip.fadeIn) {
    fadeMult *= relTime / clip.fadeIn;
  }
  if (clip.fadeOut > 0 && relTime > clip.duration - clip.fadeOut) {
    fadeMult *= (clip.duration - relTime) / clip.fadeOut;
  }

  return Math.max(0, Math.min(2, baseVol * fadeMult));
}

// Realtime Web Audio Playback Controller
export class AudioTimelinePlayer {
  private ctx: AudioContext | null = null;
  private activeSources: {
    clipId: string;
    source: AudioBufferSourceNode;
    gainNode: GainNode;
    pannerNode: StereoPannerNode;
  }[] = [];
  private isPlaying = false;

  public async syncAndPlay(
    project: VideoProjectData,
    currentTime: number,
    masterVolume: number = 1,
    isMasterMuted: boolean = false
  ) {
    this.stop();
    if (isMasterMuted || masterVolume <= 0) return;

    this.ctx = getGlobalAudioContext();

    // Check Solo tracks
    const soloTracks = project.tracks.filter((t) => t.isSolo);
    const hasSolo = soloTracks.length > 0;

    const audioOrVidClips = project.clips.filter((c) => c.type === "audio" || c.type === "video");

    for (const clip of audioOrVidClips) {
      const track = project.tracks.find((t) => t.id === clip.trackId);
      if (!track || track.isMuted) continue;
      if (hasSolo && !track.isSolo) continue;

      // Check clip overlap with playhead
      if (currentTime >= clip.startTime && currentTime < clip.startTime + clip.duration) {
        const buffer = await getAudioBuffer(clip.src);
        if (!buffer || !this.ctx) continue;

        const clipRelTime = currentTime - clip.startTime;
        const sourceOffset = (clip.mediaOffset || 0) + clipRelTime * (clip.speed || 1);

        if (sourceOffset >= buffer.duration) continue;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = clip.speed || 1;

        const gainNode = this.ctx.createGain();
        const pannerNode = this.ctx.createStereoPanner();

        // Calculate gain
        const initialGain = getClipGainAtTime(clip, clipRelTime);
        const trackVol = track.volume !== undefined ? track.volume : 1;
        const clipPan = clip.pan !== undefined ? clip.pan : 0;
        const trackPan = track.pan !== undefined ? track.pan : 0;

        gainNode.gain.value = Math.max(0, initialGain * trackVol * masterVolume);
        pannerNode.pan.value = Math.max(-1, Math.min(1, clipPan + trackPan));

        source.connect(gainNode);
        gainNode.connect(pannerNode);
        pannerNode.connect(this.ctx.destination);

        const remainingPlayTime = clip.duration - clipRelTime;
        source.start(0, sourceOffset, remainingPlayTime / (clip.speed || 1));

        this.activeSources.push({
          clipId: clip.id,
          source,
          gainNode,
          pannerNode,
        });
      }
    }
  }

  public stop() {
    for (const item of this.activeSources) {
      try {
        item.source.stop();
        item.source.disconnect();
      } catch (e) {
        // ignore already stopped
      }
    }
    this.activeSources = [];
  }
}

// Voice Recorder Engine helper using browser MediaRecorder
export class VoiceRecorderEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;

  public async startRecording(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.error("Microphone access failed:", err);
      return false;
    }
  }

  public stopRecording(): Promise<{ url: string; duration: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("MediaRecorder not initialized"));
        return;
      }

      const recDuration = (Date.now() - this.startTime) / 1000;

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        // Stop stream tracks
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
        resolve({ url, duration: Math.max(0.5, recDuration) });
      };

      this.mediaRecorder.stop();
    });
  }
}

export async function renderProjectAudioMix(
  project: VideoProjectData,
  durationSecs: number,
  sampleRate: number = 44100
): Promise<AudioBuffer | null> {
  const offlineCtx = new OfflineAudioContext(2, Math.ceil(durationSecs * sampleRate), sampleRate);

  const soloTracks = project.tracks.filter((t) => t.isSolo);
  const hasSolo = soloTracks.length > 0;

  const audioOrVidClips = project.clips.filter((c) => c.type === "audio" || c.type === "video");
  let totalSourcesAdded = 0;

  for (const clip of audioOrVidClips) {
    const track = project.tracks.find((t) => t.id === clip.trackId);
    if (!track || track.isMuted) continue;
    if (hasSolo && !track.isSolo) continue;

    const buffer = await getAudioBuffer(clip.src);
    if (!buffer) continue;

    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = clip.speed || 1;

    const gainNode = offlineCtx.createGain();
    const pannerNode = offlineCtx.createStereoPanner();

    const trackVol = track.volume !== undefined ? track.volume : 1;
    const clipVol = clip.volume !== undefined ? clip.volume : 1;
    const clipPan = clip.pan !== undefined ? clip.pan : 0;
    const trackPan = track.pan !== undefined ? track.pan : 0;

    // Base gain
    const baseGain = clip.isMuted ? 0 : clipVol * trackVol;
    gainNode.gain.setValueAtTime(baseGain, clip.startTime);

    // Apply fade in
    if (clip.fadeIn > 0) {
      gainNode.gain.setValueAtTime(0, clip.startTime);
      gainNode.gain.linearRampToValueAtTime(baseGain, clip.startTime + clip.fadeIn);
    }

    // Apply fade out
    if (clip.fadeOut > 0) {
      const fadeOutStart = clip.startTime + clip.duration - clip.fadeOut;
      gainNode.gain.setValueAtTime(baseGain, Math.max(clip.startTime, fadeOutStart));
      gainNode.gain.linearRampToValueAtTime(0, clip.startTime + clip.duration);
    }

    // Apply volume keyframe automation if present
    if (clip.keyframes) {
      const volKfs = clip.keyframes.filter((k) => k.property === "volume").sort((a, b) => a.time - b.time);
      volKfs.forEach((kf) => {
        const kfAbsTime = clip.startTime + kf.time;
        if (kfAbsTime >= clip.startTime && kfAbsTime <= clip.startTime + clip.duration) {
          gainNode.gain.linearRampToValueAtTime(kf.value * trackVol, kfAbsTime);
        }
      });
    }

    pannerNode.pan.value = Math.max(-1, Math.min(1, clipPan + trackPan));

    source.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(offlineCtx.destination);

    const sourceOffset = clip.mediaOffset || 0;
    const playDuration = clip.duration / (clip.speed || 1);

    source.start(clip.startTime, sourceOffset, playDuration);
    totalSourcesAdded++;
  }

  if (totalSourcesAdded === 0) return null;

  try {
    return await offlineCtx.startRendering();
  } catch (err) {
    console.error("Offline audio rendering failed:", err);
    return null;
  }
}
