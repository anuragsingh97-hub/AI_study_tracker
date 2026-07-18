import { useEffect, useRef, useState } from "react";

const VOICE_THRESHOLD = 0.025;
const SILENCE_HOLD_MS = 500;

export default function useVoiceDetection(enabled) {
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState("requesting");
  const lastVoiceAt = useRef(0);

  useEffect(() => {
    let audioContext;
    let stream;
    let animationFrame;
    let cancelled = false;

    if (!enabled) {
      setVoiceDetected(false);
      setMicrophoneStatus("inactive");
      return undefined;
    }

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
        setMicrophoneStatus("unsupported");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        audioContext = new window.AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);

        const samples = new Uint8Array(analyser.fftSize);
        setMicrophoneStatus("ready");

        const measureVoice = () => {
          analyser.getByteTimeDomainData(samples);

          let squaredSum = 0;
          for (const sample of samples) {
            const normalized = (sample - 128) / 128;
            squaredSum += normalized * normalized;
          }

          const volume = Math.sqrt(squaredSum / samples.length);
          const now = Date.now();
          if (volume >= VOICE_THRESHOLD) lastVoiceAt.current = now;
          setVoiceDetected(now - lastVoiceAt.current < SILENCE_HOLD_MS);
          animationFrame = requestAnimationFrame(measureVoice);
        };

        measureVoice();
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to access microphone:", error);
          setMicrophoneStatus(error.name === "NotAllowedError" ? "blocked" : "unavailable");
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach((track) => track.stop());
      audioContext?.close();
    };
  }, [enabled]);

  return { voiceDetected, microphoneStatus };
}
