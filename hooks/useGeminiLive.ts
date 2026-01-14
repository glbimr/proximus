import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { IPConfig } from '../types';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';

interface UseGeminiLiveProps {
  config: IPConfig | null;
}

export const useGeminiLive = ({ config }: UseGeminiLiveProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const disconnect = async () => {
    if (sessionRef.current) {
      try {
        // Attempt to close the session cleanly
        if (typeof sessionRef.current.close === 'function') {
           sessionRef.current.close();
        }
      } catch (e) {
        console.warn("Error closing session:", e);
      }
      sessionRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (inputContextRef.current) {
      if (inputContextRef.current.state !== 'closed') {
        await inputContextRef.current.close();
      }
      inputContextRef.current = null;
    }

    if (outputContextRef.current) {
      if (outputContextRef.current.state !== 'closed') {
         await outputContextRef.current.close();
      }
      outputContextRef.current = null;
    }

    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    
    setIsActive(false);
    setIsTalking(false);
    setVolume(0);
  };

  const connect = async () => {
    if (!config) {
      setError("No ISP Configuration Selected");
      return;
    }
    if (!process.env.API_KEY) {
      setError("API Key missing");
      return;
    }

    try {
      setIsActive(true);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      // Resume contexts immediately (required by some browsers after user gesture)
      await inputContextRef.current.resume();
      await outputContextRef.current.resume();

      nextStartTimeRef.current = 0;

      const outputNode = outputContextRef.current.createGain();
      outputNode.connect(outputContextRef.current.destination);

      // Get Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const providerName = config.provider;
      const location = config.location;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Session Opened");
            
            if (inputContextRef.current && streamRef.current) {
              const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
              const scriptProcessor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
              
              // Create a mute node to prevent feedback loop (mic -> speakers)
              const muteNode = inputContextRef.current.createGain();
              muteNode.gain.value = 0;

              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Calculate volume for visualization
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                  sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(prev => Math.max(rms * 100, prev * 0.9)); 

                const pcmBlob = createPcmBlob(inputData);
                sessionPromise.then(session => {
                   session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(scriptProcessor);
              // Connect to muteNode then destination to keep the graph alive without feedback
              scriptProcessor.connect(muteNode);
              muteNode.connect(inputContextRef.current.destination);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const serverContent = message.serverContent;
            
            if (serverContent?.modelTurn?.parts?.[0]?.inlineData) {
              const base64Audio = serverContent.modelTurn.parts[0].inlineData.data;
              
              if (outputContextRef.current) {
                 const ctx = outputContextRef.current;
                 const audioBuffer = await decodeAudioData(
                   base64ToUint8Array(base64Audio),
                   ctx
                 );
                 
                 const source = ctx.createBufferSource();
                 source.buffer = audioBuffer;
                 source.connect(outputNode);
                 
                 source.addEventListener('ended', () => {
                   sourcesRef.current.delete(source);
                   if (sourcesRef.current.size === 0) setIsTalking(false);
                 });

                 // Scheduling to ensure gapless playback
                 const currentTime = ctx.currentTime;
                 if (nextStartTimeRef.current < currentTime) {
                    nextStartTimeRef.current = currentTime;
                 }
                 
                 source.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += audioBuffer.duration;
                 sourcesRef.current.add(source);
                 setIsTalking(true);
              }
            }

            if (serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e){}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsTalking(false);
            }
          },
          onclose: () => {
            console.log("Session closed from server");
            disconnect();
          },
          onerror: (err) => {
            console.error("Session error", err);
            setError("Connection Error");
            disconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are a helpful Technical Support Representative for ${providerName}. The user is testing their connection from ${location} with IP ${config.ip}. 
          If they ask about the connection, confirm their IP and location. 
          Simulate a professional ISP support agent. 
          Keep responses concise and helpful for a network test.`,
        },
      });

      sessionPromise.then(session => {
        sessionRef.current = session;
      }).catch(e => {
        console.error("Failed to resolve session", e);
        setError("Failed to connect to AI Support");
        disconnect();
      });

    } catch (e) {
      console.error(e);
      setError("Microphone Access Failed");
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isActive,
    isTalking,
    volume,
    error,
    connect,
    disconnect
  };
};