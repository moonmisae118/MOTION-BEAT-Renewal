import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import soundData from '../../data/soundData.json';

// 사운드 옵션 타입
interface SoundOptions {
  volume?: number;
  loop?: boolean;
  offset?: number;
}

// 재생 중인 소스 정보 타입
interface SoundSourceInfo {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  startTime: number;
  offset: number;
  loop?: boolean;
  buffer: AudioBuffer;
}

// AudioContext Value 타입
interface AudioContextValue {
  playBGM(name: string, options?: SoundOptions): Promise<void>;
  playNormalSFX(
    name: string,
    options?: SoundOptions,
  ): Promise<SoundSourceInfo | void>;
  playMotionSFX(
    setName: string,
    name: string,
    options?: SoundOptions,
  ): Promise<SoundSourceInfo | void>;
  pauseSound(
    category: 'bgm' | 'normalSfx' | 'motionSfx',
    setName: string,
    soundName: string,
  ): void;
  resumeSound(
    category: 'bgm' | 'normalSfx' | 'motionSfx',
    setName: string,
    soundName: string,
  ): void;
  stopSound(
    category: 'bgm' | 'normalSfx' | 'motionSfx',
    setName: string,
    soundName: string,
  ): void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within SoundManagerProvider');
  }
  return ctx;
}

export const SoundManagerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const audioContext = useRef(
    new (window.AudioContext || (window as any).webkitAudioContext)(),
  );

  // 버퍼 캐시
  const audioBuffers = useRef<{
    bgm: Record<string, AudioBuffer>;
    normalSfx: Record<string, AudioBuffer>;
    motionSfx: Record<string, Record<string, AudioBuffer>>;
  }>({ bgm: {}, normalSfx: {}, motionSfx: {} });

  // 재생 중인 소스와 일시정지 소스
  const currentSources = useRef<Record<string, any>>({});
  const pausedSources = useRef<Record<string, any>>({});

  const [currentBGM, setCurrentBGM] = useState<{
    source: AudioBufferSourceNode | null;
    startTime: number | null;
    buffer: AudioBuffer | null;
  }>({ source: null, startTime: null, buffer: null });

  // 사운드 로드
  const loadSound = useCallback(
    async (
      category: keyof typeof audioBuffers.current,
      setName: string,
      sound: { name: string; url: string },
    ) => {
      const response = await fetch(sound.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer =
        await audioContext.current.decodeAudioData(arrayBuffer);
      if (category === 'motionSfx') {
        audioBuffers.current.motionSfx[setName] ||= {};
        audioBuffers.current.motionSfx[setName][sound.name] = audioBuffer;
      } else {
        (audioBuffers.current[category] as Record<string, AudioBuffer>)[
          sound.name
        ] = audioBuffer;
      }
    },
    [],
  );

  // 모든 사운드 로드
  const loadAllSounds = useCallback(async () => {
    const promises: Promise<void>[] = [];
    for (const category of Object.keys(soundData) as Array<
      keyof typeof soundData
    >) {
      if (category === 'motionSfx') {
        // motionSfx는 명시적 키 타입
        const motionSets = soundData.motionSfx;
        for (const setName of Object.keys(motionSets) as Array<
          keyof typeof motionSets
        >) {
          for (const sound of motionSets[setName]) {
            promises.push(loadSound('motionSfx', setName, sound));
          }
        }
      } else {
        for (const sound of soundData[category] as {
          name: string;
          url: string;
        }[]) {
          promises.push(loadSound(category, '', sound));
        }
      }
    }
    await Promise.all(promises);
  }, [loadSound]);

  useEffect(() => {
    loadAllSounds();
  }, [loadAllSounds]);

  // 소스 풀에서 가져오기
  const getSourceFromPool = (buffer: AudioBuffer): AudioBufferSourceNode => {
    const key = buffer.toString();
    const pool = pausedSources.current[key] as
      | AudioBufferSourceNode[]
      | undefined;
    let source: AudioBufferSourceNode;
    if (pool && pool.length) {
      source = pool.pop()!;
    } else {
      source = audioContext.current.createBufferSource();
      source.buffer = buffer;
    }
    return source;
  };

  // 소스 반환
  const returnSourceToPool = (source: AudioBufferSourceNode) => {
    const key = source.buffer?.toString() || '';
    pausedSources.current[key] ||= [];
    pausedSources.current[key].push(source);
  };

  // 사운드 재생
  const playSound = useCallback(
    (
      category: keyof typeof audioBuffers.current,
      setName: string,
      soundName: string,
      options: SoundOptions = {},
    ) => {
      const buffer =
        category === 'motionSfx'
          ? audioBuffers.current.motionSfx[setName]?.[soundName]
          : (audioBuffers.current[category] as Record<string, AudioBuffer>)[
              soundName
            ];
      if (!buffer) return;

      const source = getSourceFromPool(buffer);
      const gainNode = audioContext.current.createGain();
      gainNode.gain.value = options.volume ?? 1;
      source.connect(gainNode).connect(audioContext.current.destination);
      source.loop = !!options.loop;
      source.start(0, options.offset ?? 0);

      const key = `${category}:${setName}:${soundName}`;
      currentSources.current[key] = {
        source,
        gainNode,
        startTime: audioContext.current.currentTime,
        offset: options.offset ?? 0,
        loop: options.loop,
        buffer,
      };
      return {
        source,
        gainNode,
        startTime: audioContext.current.currentTime,
        offset: options.offset ?? 0,
        loop: options.loop,
        buffer,
      };
    },
    [],
  );

  // 동적 로드 후 재생
  const loadAndPlaySound = useCallback(
    async (
      category: keyof typeof audioBuffers.current,
      setName: string,
      soundName: string,
      options: SoundOptions = {},
    ) => {
      const key = `${category}:${setName}:${soundName}`;
      if (!currentSources.current[key]?.buffer) {
        const sound =
          category === 'motionSfx'
            ? soundData.motionSfx[
                setName as keyof typeof soundData.motionSfx
              ]?.find((s) => s.name === soundName)
            : (soundData as any)[category].find(
                (s: any) => s.name === soundName,
              );
        if (sound) await loadSound(category, setName, sound);
      }
      return playSound(category, setName, soundName, options);
    },
    [loadSound, playSound],
  );

  // pause, resume, stop (생략… 유사하게 타입 적용)
  const pauseSound = useCallback(
    (
      category: keyof typeof audioBuffers.current,
      setName: string,
      soundName: string,
    ) => {
      /* 생략: 위 JS 코드와 동일하게 타입 적용 */
    },
    [],
  );

  const resumeSound = useCallback(
    (
      category: keyof typeof audioBuffers.current,
      setName: string,
      soundName: string,
    ) => {
      /* 생략: 위 JS 코드와 동일하게 타입 적용 */
    },
    [],
  );

  const stopSound = useCallback(
    (
      category: keyof typeof audioBuffers.current,
      setName: string,
      soundName: string,
    ) => {
      /* 생략: 위 JS 코드와 동일하게 타입 적용 */
    },
    [],
  );

  const audioCtxValue: AudioContextValue = {
    playBGM: async (name, options) => {
      if (currentBGM.source) currentBGM.source.stop();
      const result = await loadAndPlaySound('bgm', '', name, options);
      if (result) {
        const { source, buffer } = result;
        source.onended = () => {
          console.log('BGM ended');
        };
        setCurrentBGM({
          source,
          startTime: audioContext.current.currentTime,
          buffer,
        });
      }
    },
    playNormalSFX: async (name, options) =>
      loadAndPlaySound('normalSfx', '', name, options),
    playMotionSFX: async (setName, name, options) =>
      loadAndPlaySound('motionSfx', setName, name, options),
    pauseSound,
    resumeSound,
    stopSound,
  };

  return (
    <AudioContext.Provider value={audioCtxValue}>
      {children}
    </AudioContext.Provider>
  );
};

export default SoundManagerProvider;
