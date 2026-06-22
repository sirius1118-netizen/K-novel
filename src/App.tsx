/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Sparkles, 
  Cpu, 
  Radio, 
  Volume2, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  HelpCircle, 
  Globe, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle,
  Database,
  Activity,
  Disc,
  FileDown
} from 'lucide-react';

interface GeneratedTrack {
  title: string;
  tempoBpm: number;
  vocalVibrato: string;
  lyrics: {
    intro: string;
    verse1: string;
    chorus: string;
    verse2: string;
    climax: string;
    outro: string;
  };
  lyricsSentiments?: {
    intro?: string;
    verse1?: string;
    chorus?: string;
    verse2?: string;
    climax?: string;
    outro?: string;
  };
  soundDesign: string;
  percentageHitProbability: number;
  billboardAnalysis: string;
  isFallback?: boolean;
}

const getSentimentBadge = (sentiment: string) => {
  const norm = (sentiment || '').toLowerCase();
  if (norm.includes('sad') || norm.includes('슬픔')) {
    return {
      label: '한맺힌 슬픔',
      emoji: '💧',
      class: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
  }
  if (norm.includes('joyful') || norm.includes('기쁨') || norm.includes('흥겨움') || norm.includes('신나')) {
    return {
      label: '어깨춤 흥겨움',
      emoji: '💃',
      class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };
  }
  if (norm.includes('dramatic') || norm.includes('극적') || norm.includes('비장')) {
    return {
      label: '대서사 극적비장',
      emoji: '🔥',
      class: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
  }
  if (norm.includes('romantic') || norm.includes('로맨틱') || norm.includes('사랑')) {
    return {
      label: '달콤한 로맨스',
      emoji: '💖',
      class: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
    };
  }
  if (norm.includes('mournful') || norm.includes('애조') || norm.includes('상실')) {
    return {
      label: '애조 띤 탄식',
      emoji: '🥀',
      class: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };
  }
  if (norm.includes('hopeful') || norm.includes('희망') || norm.includes('치유') || norm.includes('꿈')) {
    return {
      label: '서광 어린 희망',
      emoji: '🌅',
      class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
  }
  return {
    label: '애절한 감성',
    emoji: '🎵',
    class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  };
};

interface Vocalist {
  id: string;
  name: string;
  vibe: string;
  gender: 'male' | 'female';
  initials: string;
  color: string;
}

export default function App() {
  // Clock state
  const [timeStr, setTimeStr] = useState('오후 12:45');
  
  // App active tab for Samsung One UI layout
  const [activeTab, setActiveTab] = useState<'home' | 'vocalist' | 'player' | 'device' | 'album'>('home');
  
  // App options & controls
  const [genderFilter, setGenderFilter] = useState<'male' | 'female'>('female');
  const [selectedVocalistId, setSelectedVocalistId] = useState('F01');
  const [vocalistVibration, setVocalistVibration] = useState<Record<string, number>>({
    F01: 75,
    F02: 60,
    F03: 80,
    M01: 90,
    M02: 50,
    M03: 70,
  });
  const [vocalistTrillSpeed, setVocalistTrillSpeed] = useState<Record<string, number>>({
    F01: 70,
    F02: 80,
    F03: 65,
    M01: 60,
    M02: 85,
    M03: 75,
  });
  const [autoUpdateVoice, setAutoUpdateVoice] = useState(true);
  
  // States for lyric editing and automatic AI-based re-writing
  const [editingLyricSection, setEditingLyricSection] = useState<string | null>(null);
  const [lyricInstruction, setLyricInstruction] = useState('');
  const [isRewritingLyrics, setIsRewritingLyrics] = useState(false);
  
  const [selectedChord, setSelectedChord] = useState('I - V - vi - IV');
  const [melodyDensity, setMelodyDensity] = useState(88);
  const [targetLength, setTargetLength] = useState(214);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTopicPreset, setSelectedTopicPreset] = useState('서울의 어느 비 내리는 밤');

  const [instrumentMixName, setInstrumentMixName] = useState<string>('자동 공명 앙상블 매칭');
  const [instruments, setInstruments] = useState([
    { id: 'accordion', name: '전설의 아코디언', icon: '🪗', genre: '정통 트로트', desc: '구수하고 서글픈 정통 뽕짝 악풍의 핵심 뼈대를 선사합니다.', volume: 85, active: true },
    { id: 'gayageum', name: '궁중 가야금/거문고', icon: '🎻', genre: '국악/민요 크로스오버', desc: '깊게 울리고 튕기는 한국 고유의 오기 깊이와 탄현 한 서사.', volume: 75, active: true },
    { id: 'saxophone', name: '재즈 색소폰', icon: '🎷', genre: '소울/블루스 트로트', desc: '따뜻한 관악 브레스와 가슴을 아련하게 만드는 슬픈 비장미.', volume: 60, active: true },
    { id: 'guitar', name: '록 드라이브 기타', icon: '🎸', genre: '록/고속도로 댄스', desc: '고속도로 특유의 속이 뻥 뚫리고 시원한 드라이브 밴딩 솔로.', volume: 50, active: false },
    { id: 'piano', name: '클래식 그랜드 콘서트 피아노', icon: '🎹', genre: '발라드 트로트', desc: '투명하고 정갈한 밤하늘 해머 어쿠스틱과 해상력 높은 반주.', volume: 80, active: true },
    { id: 'synth', name: '테크노 레이저 리드', icon: '⚡', genre: '일렉트로 트로트', desc: '청하하고 청량하여 온몸이 찌릿하게 떨리는 댄생 하이웨이 리드.', volume: 45, active: false },
    { id: 'violin', name: '로열 스트링 앙상블', icon: '🎻', genre: '대서사 오케스트라', desc: '풍성한 극적인 배경 서사 선율을 선사해 장중하고 아련한 분위기 조율.', volume: 70, active: true },
    
    // 6 supplementary high-quality instruments requested by the user
    { id: 'haegeum', name: '애달픈 전통 해금', icon: '🎻', genre: '전통 국악 활현', desc: '목이 메는 심금을 울리며 극정인 구슬픔과 한의 꺾기를 대방출합니다.', volume: 80, active: true },
    { id: 'synth_brass', name: '레트로 신디 브라스', icon: '🎺', genre: '80년대 디스코 트로트', desc: '8090년대 정통 댄스 뽕짝의 신나고 가슴이 확 트이는 팡파레 리듬 배합.', volume: 75, active: false },
    { id: 'taepyeongso', name: '명성 태평소/피리', icon: '📯', genre: '국악 퓨전 세레모니', desc: '하늘을 찢어 발기듯 가슴이 시원하고 카랑카랑하게 흥을 돋우는 사운드.', volume: 65, active: false },
    { id: 'synth_bass', name: '일렉트릭 쿵짝 베이스', icon: '🎸', genre: '댄스/하이브리드 비트', desc: '트랙의 전반적인 무게감을 잡고 리드미컬한 뽕짝 쿵짝 다운 비트 지탱.', volume: 85, active: true },
    { id: 'drum_kit', name: '아날로그 트롯 드럼 킷', icon: '🥁', genre: '오케스트라 올라운더', desc: '쿵짝쿵짝 세대의 기본 아날로그 통드럼 패키지로 입체적 타격감 선사.', volume: 80, active: true },
    { id: 'flute', name: '새벽 이슬 플루트', icon: '🪈', genre: '발라드 메인 선율', desc: '투명한 숲속의 새싹처럼 밤하늘을 수놓는 고운 플루트 화성 선율.', volume: 70, active: false },
  ]);

  // CPU levels and logs
  const [cpuLoad, setCpuLoad] = useState(68);
  const [logs, setLogs] = useState<string[]>([
    '> 정통 트로트 바이브레이션 추출 완료',
    '> 밀리언셀러 히트곡 구조 스캔 완료',
    '> BTS 등 글로벌 최신 코드 진행 매칭 완료',
    '> [실시간 글로벌 차트 탐색 중...]'
  ]);

  // Composition and Player State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  
  // Persistent Album Records (자동 영구 저장 걸작선)
  const [albumTracks, setAlbumTracks] = useState<GeneratedTrack[]>(() => {
    try {
      const saved = localStorage.getItem('k_trot_album_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Track auto save handler
  const saveToAlbum = (track: GeneratedTrack) => {
    setAlbumTracks(prev => {
      const filtered = prev.filter(t => t.title !== track.title);
      const updated = [track, ...filtered];
      try {
        localStorage.setItem('k_trot_album_tracks', JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage sync error:", e);
      }
      return updated;
    });
  };

  // Real Instrument Instrument sound preloader metadata
  const [isDownloadingSamples, setIsDownloadingSamples] = useState(false);
  const [downloadedSamplesCount, setDownloadedSamplesCount] = useState(0);

  const instrumentSoundfontAliases: Record<string, string> = {
    accordion: 'accordion',
    gayageum: 'koto',
    saxophone: 'alto_sax',
    guitar: 'acoustic_guitar_nylon',
    piano: 'acoustic_grand_piano',
    synth: 'lead_1_square',
    violin: 'violin',
    haegeum: 'violin',
    synth_brass: 'synth_brass_1',
    taepyeongso: 'soprano_sax',
    synth_bass: 'synth_bass_1',
    drum_kit: 'melodic_tom',
    flute: 'flute'
  };

  const cachedBuffersRef = useRef<Record<string, Record<string, AudioBuffer>>>({});

  // Real Audio Audio preloader
  const loadInstrumentSamples = async (ctx: AudioContext) => {
    if (isDownloadingSamples) return;
    setIsDownloadingSamples(true);
    setDownloadedSamplesCount(0);
    setLogs(prev => ['> [실시간 오디오 수집] 전세계 오케스트라 클라우드 음원 저장소 탐색을 개시합니다...', ...prev]);

    let downloadedCount = 0;
    const activeInstruments = instruments.filter(inst => inst.active);
    const targetNotes = ['C3', 'G3', 'C4']; // 3 main register anchors

    try {
      for (const inst of activeInstruments) {
        const alias = instrumentSoundfontAliases[inst.id];
        if (!alias) continue;

        if (!cachedBuffersRef.current[inst.id]) {
          cachedBuffersRef.current[inst.id] = {};
        }

        setLogs(prev => [`> [실시간 매칭 완료] '${inst.name}'의 고음질 실제 악기 타현 오디오 음향 수신 중...`, ...prev]);

        for (const note of targetNotes) {
          if (cachedBuffersRef.current[inst.id][note]) {
            downloadedCount++;
            setDownloadedSamplesCount(downloadedCount);
            continue;
          }

          const url = `https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/${alias}-mp3/${note}.mp3`;
          try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error("CORS or network blockage");
            const arrayBuf = await resp.arrayBuffer();
            const decoded = await ctx.decodeAudioData(arrayBuf);
            cachedBuffersRef.current[inst.id][note] = decoded;
            downloadedCount++;
            setDownloadedSamplesCount(downloadedCount);
          } catch (sampleErr) {
            console.warn(`Dynamic loading failed for ${inst.name} (${note}):`, sampleErr);
          }
        }
      }

      setLogs(prev => [
        `> [최첨단 음향 동기화 완료] 실시간 파싱 완료된 하이브리드 고음질 실재 악기 사운드 ${downloadedCount}팩이 믹서에 완전히 도킹되었습니다! 🎻`,
        ...prev
      ]);
    } catch (err) {
      console.error("Sampler preloading main error:", err);
    } finally {
      setIsDownloadingSamples(false);
    }
  };

  const frequencyToMidiMap: Record<number, string> = {
    55: 'G2', 110: 'A2', 116: 'A2', 123: 'B2',
    130: 'C3', 131: 'C3', 146: 'D3', 147: 'D3', 156: 'G3', 164: 'G3', 165: 'G3', 174: 'G3', 175: 'G3', 196: 'G3', 220: 'C4', 246: 'C4',
    260: 'C4', 262: 'C4', 292: 'C4', 294: 'C4', 312: 'C4', 328: 'C4', 330: 'C4', 348: 'C4', 350: 'C4', 392: 'C4', 440: 'C4', 492: 'C4'
  };

  const getClosestLoadedNote = (freq: number): string => {
    const val = Math.round(freq);
    if (val < 135) return 'C3';
    if (val < 210) return 'G3';
    return 'C4';
  };
  
  // Real Audio playback states
  const [synthPlaying, setSynthPlaying] = useState(false);
  const [activeLyricsKey, setActiveLyricsKey] = useState<string | null>(null);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [showKeyAlert, setShowKeyAlert] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // References
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  const vocalists: Vocalist[] = [
    { id: 'F01', name: '울림의 여왕 (Soulful Queen)', vibe: '빌보드를 겨냥한 강력한 흉성 발성과 깊은 울림', gender: 'female', initials: 'F01', color: 'from-pink-500 to-indigo-500' },
    { id: 'F02', name: '트롯팝 퓨전 (Trot-Pop Fusion)', vibe: '맑고 선명한 크리스탈 고음 & 트렌디한 현대식 융합', gender: 'female', initials: 'F02', color: 'from-indigo-400 to-purple-600' },
    { id: 'F03', name: '딥 벨벳 (Deep Velvet)', vibe: '애절함을 더해 한층 깊어진 다크 발라드 감성 창법', gender: 'female', initials: 'F03', color: 'from-teal-400 to-indigo-600' },
    { id: 'M01', name: '전통의 울림 (Tradition Sensation)', vibe: '가슴을 후벼파는 정통 우는 소리 및 꺾기 바이브레이션', gender: 'male', initials: 'M01', color: 'from-blue-500 to-cyan-500' },
    { id: 'M02', name: '골든 크루너 (Golden Crooner)', vibe: '실크 같은 감수성을 소유한 고품격 중저음 바리톤', gender: 'male', initials: 'M02', color: 'from-emerald-500 to-indigo-600' },
    { id: 'M03', name: '네오트롯 댄서 (Neo-Trot Dancer)', vibe: '댄스 비트 트렌드를 개척하는 휘모리 마스터 훅', gender: 'male', initials: 'M03', color: 'from-amber-500 to-rose-600' }
  ];

  const chordOptions = [
    { code: 'I - V - vi - IV', desc: '팝 골든 크로스오버 (밝고 친숙하며 대중적인 진행)' },
    { code: 'i - bVI - bIII - bVII', desc: '애절한 마이너 단조 진행 (감정을 자극하는 시디엠 진행)' },
    { code: 'I - vi - IV - V', desc: '60년대 복고 트롯 기조 (짙은 향수의 전통적인 꺾기 마디)' },
    { code: 'ii - V - I - IV', desc: '재즈-트롯 세련된 화성 (도시적 감각의 어쿠스틱 계단화)' }
  ];

  const topicPresets = [
    '서울의 어느 비 내리는 밤',
    '부산항 간이역에서의 하염없는 눈물',
    '강남 밤거리를 수놓는 네온사인 불빛',
    '가을바람에 보낸 부치지 못한 편지',
    '화려한 슈퍼스타 그 이면의 가슴 쓰린 외로움'
  ];

  // Live status updater for clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // conversion 0 to 12
      setTimeStr(`${ampm} ${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuating CPU and simulated background server logs
  useEffect(() => {
    const logInterval = setInterval(() => {
      // Add random log steps to keep console active
      const candidates = [
        `> 코드 진행 밀도 진단 중: ${selectedChord}`,
        `> 보컬 성벽 주파수 매개변수 생성 중: ${selectedVocalistId}`,
        `> 빌보드 히트곡 데이터 확률 지표 최적화 중...`,
        `> 국내 라디오 및 방송 플레이리스트 스캔 중...`,
        `> ${melodyDensity}% 밀도의 트로트 리듬 패턴 연산 중...`,
        `> 성인 가요 트렌드 데이터베이스 동기화 중...`,
        `> 합성 보컬 트랙 조화 주파수 연산 중...`
      ];
      const randomMsg = candidates[Math.floor(Math.random() * candidates.length)];
      setLogs(prev => [randomMsg, ...prev.slice(0, 8)]);
      setCpuLoad(Math.floor(60 + Math.random() * 25));
    }, 8500);

    return () => clearInterval(logInterval);
  }, [selectedChord, selectedVocalistId, melodyDensity]);

  // Current selected vocalist
  const currentVocalist = vocalists.find(v => v.id === selectedVocalistId) || vocalists[0];

  // Dynamic calculated probability score based on factors
  const computedProbability = (() => {
    let base = 92.5;
    // chord complexity additions
    base += selectedChord.length * 0.2;
    // density additions
    base += (melodyDensity % 7) * 0.4;
    // length optimization
    const lenDiff = Math.abs(240 - targetLength);
    base -= lenDiff * 0.05;
    return parseFloat(Math.min(99.9, Math.max(85, base)).toFixed(1));
  })();

  // Automatically optimizes & matches the orchestra instrument mix depending on the theme/topic
  const autoMatchInstrumentsForTopic = (topic: string) => {
    const term = topic.toLowerCase();
    let matchedName = '기본 에센셜 브릿지';
    
    const updated = instruments.map((inst) => {
      let active = false;
      let volume = inst.volume;
      
      if (term.includes('비') || term.includes('눈물') || term.includes('이별') || term.includes('슬픔') || term.includes('사랑') || term.includes('노을') || term.includes('한강')) {
        // Soft sad ballad vibe -> Violin, Piano, Accordion, Haegeum, Flute
        matchedName = '아련한 애조-발라드 매칭';
        if (['accordion', 'piano', 'violin', 'haegeum', 'flute', 'drum_kit'].includes(inst.id)) {
          active = true;
          volume = inst.id === 'accordion' ? 85 : inst.id === 'piano' ? 85 : inst.id === 'violin' ? 75 : inst.id === 'haegeum' ? 70 : inst.id === 'flute' ? 70 : 65;
        } else if (['saxophone', 'gayageum', 'synth_bass'].includes(inst.id)) {
          active = true;
          volume = 45;
        }
      } else if (term.includes('고속도로') || term.includes('테크노') || term.includes('댄스') || term.includes('신나는') || term.includes('축제') || term.includes('청춘') || term.includes('고속') || term.includes('스타')) {
        // Upbeat techno/disco/highway -> Synth, Guitar, Accordion, Synth Brass, Synth Bass, Drum Kit
        matchedName = '청량 댄스-하이웨이 매칭';
        if (['synth', 'guitar', 'accordion', 'synth_brass', 'synth_bass', 'drum_kit'].includes(inst.id)) {
          active = true;
          volume = inst.id === 'synth' ? 95 : inst.id === 'guitar' ? 85 : inst.id === 'synth_brass' ? 90 : inst.id === 'synth_bass' ? 90 : inst.id === 'drum_kit' ? 85 : 60;
        } else if (['piano'].includes(inst.id)) {
          active = true;
          volume = 55;
        }
      } else if (term.includes('바다') || term.includes('고향') || term.includes('부모') || term.includes('국악') || term.includes('전통') || term.includes('한') || term.includes('아리랑') || term.includes('세월')) {
        // Traditional korean gukak crossover -> Gayageum, Accordion, Saxophone, Haegeum, Taepyeongso, Drum Kit
        matchedName = '국악 풍류-익스프레스 매칭';
        if (['gayageum', 'accordion', 'saxophone', 'haegeum', 'taepyeongso', 'drum_kit', 'synth_bass'].includes(inst.id)) {
          active = true;
          volume = inst.id === 'gayageum' ? 95 : inst.id === 'accordion' ? 75 : inst.id === 'haegeum' ? 85 : inst.id === 'taepyeongso' ? 80 : inst.id === 'drum_kit' ? 70 : 65;
        } else if (['violin'].includes(inst.id)) {
          active = true;
          volume = 50;
        }
      } else {
        // default all-rounding elegant classic balance
        matchedName = '스마트 골든-밸런스 매칭';
        if (['accordion', 'piano', 'violin', 'saxophone', 'drum_kit', 'flute', 'synth_bass'].includes(inst.id)) {
          active = true;
          volume = inst.id === 'accordion' ? 80 : inst.id === 'piano' ? 75 : inst.id === 'violin' ? 65 : inst.id === 'drum_kit' ? 80 : inst.id === 'flute' ? 65 : inst.id === 'synth_bass' ? 70 : 55;
        }
      }
      return { ...inst, active, volume };
    });
    
    setInstruments(updated);
    setInstrumentMixName(matchedName);
  };

  // AI-powered automatic lyrics re-writer/editor
  const handleRewriteLyrics = async () => {
    if (!generatedTrack) return;
    if (!lyricInstruction.trim()) {
      alert("AI 가사 자동 개사를 위한 수정 지시사항을 입력해 주세요!");
      return;
    }

    setIsRewritingLyrics(true);
    setLogs(prev => [`> [AI 가사 재편곡] 지시사항 '${lyricInstruction}'을 기반으로 가사 감성 개사를 가동합니다...`, ...prev]);
    
    try {
      const res = await fetch('/api/edit-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lyrics: generatedTrack.lyrics,
          instruction: lyricInstruction,
          voice: `${currentVocalist.id} - ${currentVocalist.name}`
        })
      });

      if (!res.ok) {
        throw new Error('가사 개사 연산 요청 실패');
      }

      const data = await res.json();
      if (data.lyrics) {
        setGeneratedTrack(prev => {
          if (!prev) return null;
          return {
            ...prev,
            lyrics: data.lyrics,
            isFallback: data.isFallback || prev.isFallback
          };
        });
        setLogs(prev => [
          `> [AI 가사 재편곡] '${lyricInstruction}' 지시사항에 부합하는 새로운 K-Trot 가사 개사가 컴파일 완료되었습니다!`,
          ...prev
        ]);
        setLyricInstruction('');
      }
    } catch (err: any) {
      console.error("Lyrics rewrite error:", err);
      setLogs(prev => [`> [에러] 가사 개사 실패: ${err.message || '네트워크 및 서버 환경을 탐지해 주세요'}`, ...prev]);
    } finally {
      setIsRewritingLyrics(false);
    }
  };

  // Score sheet text automatic downloader
  const downloadScoreAsText = (trackToDownload?: GeneratedTrack) => {
    const targetTrack = trackToDownload || generatedTrack;
    if (!targetTrack) return;
    
    const activeInstrumentsList = instruments
      .map(inst => `- ${inst.icon} ${inst.name} [${inst.genre}] : ${inst.active ? `ON (${inst.volume}%)` : 'OFF'}`)
      .join('\n');
    
    const lyricsSection = (Object.entries(targetTrack.lyrics) as [string, string][])
      .map(([key, text]) => {
        let displayName = key;
        if (key === 'intro') displayName = '정주 인트로 (Intro)';
        else if (key === 'verse1') displayName = '절 (Verse 1)';
        else if (key === 'verse2') displayName = '절 (Verse 2)';
        else if (key === 'chorus') displayName = '후창 사비 (Chorus)';
        else if (key === 'climax') displayName = '한풀이 감정 절정 (Climax)';
        else if (key === 'outro') displayName = '감정의 여운 아웃트로 (Outro)';
        
        const sentimentVal = targetTrack.lyricsSentiments?.[key as any] || (
          key === 'intro' ? 'Sad' :
          key === 'verse1' ? 'Mournful' :
          key === 'chorus' ? 'Dramatic' :
          key === 'verse2' ? 'Romantic' :
          key === 'climax' ? 'Dramatic' : 'Mournful'
        );
        const sBadge = getSentimentBadge(sentimentVal);
        
        return `[${displayName}]\n감정 분위기: ${sBadge.emoji} ${sBadge.label} (${sentimentVal})\n--------------------------------------------------\n${text}\n\n`;
      })
      .join('\n');

    const scoreContent = `==================================================
🎼 [${targetTrack.title}] - 인공지능 K-Trot 크로스오버 악보 (Sheet Music & Score)
==================================================

■ 아티스트 가이드 보컬 : ${currentVocalist.name} (${currentVocalist.vibe})
■ 음악적 화성 코드 진행 (Chords) : ${selectedChord}
■ 꺾기 바이브레이션 성벽 : ${targetTrack.vocalVibrato}
■ 선율 템포 : ${targetTrack.tempoBpm} BPM
■ 빌보드 타겟 히트 적합성 예측 확률 : ${computedProbability}%
■ 편곡 생성 엔진 : ${targetTrack.isFallback ? '로컬 고정밀 오프라인 앙상블 편곡 엔진' : 'Gemini AI 뉴럴 네트워크 분산 처리'}

==================================================
🎹 오케스트라 앙상블 악기 파트 멀티채널 믹서 세팅
==================================================
${activeInstrumentsList}

==================================================
📝 단락별 감정 선율 가사 및 화성 진행 가이드 (Lyrics & Sentiment)
==================================================
${lyricsSection}
==================================================
🎧 편곡 보컬 합성 사운드 디자인 도안
--------------------------------------------------
${targetTrack.soundDesign}

📈 빌보드 타겟 심층 차트 정밀 분석 레포트
--------------------------------------------------
"${targetTrack.billboardAnalysis}"

==================================================
본 악보와 사운드 레코드는 Web Audio API 및 Gemini AI를 사용하여
실시간으로 합성된 유기적 오케스트레이션 결과물입니다.
Created on: ${new Date().toLocaleString('ko-KR')}
==================================================`;

    const blob = new Blob([scoreContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = targetTrack.title.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '').trim();
    link.download = `${safeTitle || 'k_trot'}_score_악보.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setLogs(prev => [`> [악코드] '${safeTitle || 'k_trot'}_score_악보.txt' 정밀 악보 텍스트 내보내기 완료!`, ...prev]);
  };

  // Core composition request
  const handleCompose = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGeneratedTrack(null);
    stopSynth();
    stopTts();
    
    const topic = customTopic.trim() || selectedTopicPreset;
    autoMatchInstrumentsForTopic(topic);
    setLogs(prev => [`> 유기적 오케스트라 레이어 분석 가동...`, ...prev]);
    
    const steps = [
      '국내 주요 스트리밍 흐름 데이터 수집 중...',
      '곡 진행의 골격 코드 분석 및 배치 중...',
      '트로트 특유의 애절망 단어 체크 중...',
      'Gemini 신경망 가창 가사 자동 합성 중...',
      '크로스오버 편곡 및 마스터링 구조 설계 중...'
    ];

    // Simulate logs in the right panel
    let currentStepIndex = 0;
    setGenerationStep(steps[0]);
    
    const progressInterval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setGenerationStep(steps[currentStepIndex]);
        setLogs(prev => [`> AI 엔진: ${steps[currentStepIndex]}`, ...prev]);
      }
    }, 1200);

    try {
      const topic = customTopic.trim() || selectedTopicPreset;
      const res = await fetch('/api/generate-trot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voice: `${currentVocalist.id} - ${currentVocalist.name}`,
          chordProgression: selectedChord,
          melodyDensity: `${melodyDensity}% Catchiness`,
          lyricsTopic: topic,
          length: targetLength
        })
      });

      if (!res.ok) {
        throw new Error('Arrangement failure on server.');
      }

      const data = await res.json();
      clearInterval(progressInterval);
      setGeneratedTrack(data);
      saveToAlbum(data);
      setActiveTab('player');
      downloadScoreAsText(data);
      setLogs(prev => [
        `> 완료: "${data.title}" 곡 합성이 완벽히 성공했습니다.`,
        `> 종합 히트 예상 진찰 스코어: ${data.percentageHitProbability}%`,
        ...prev
      ]);
    } catch (err: any) {
      clearInterval(progressInterval);
      // Fallback
      console.warn("API request failed, loading offline high-fidelity mode.", err);
      const fallbackTopic = customTopic.trim() || selectedTopicPreset;
      const offlineKeys = ["F01", "F02", "F03", "M01", "M02", "M03"];
      setLogs(prev => [`> 편곡 멜로디 엔진 연결 초과. 로컬 오프라인 고효율 백업 합성 가동...`, ...prev]);
      
      // Simulate fallback
      setTimeout(() => {
        const fallbacks = [
          {
            title: "서울의 눈물비 (Tears of Seoul Sky)",
            tempoBpm: 122,
            vocalVibrato: "짙은 애절함 (정통 트로트 6.8Hz 바이브레이션)",
            lyrics: {
              intro: "[아코디언 & 부드러운 브라스 반주] (향수 어린 레트로 그루브가 고조되고 보컬의 야속한 탄식이 낮게 깔립니다...)",
              intro_desc: "전주 브릿지 구간",
              verse1: "밤 깊은 서울 거리에 비가 내리면 (When midnight rain pours on the streets of Seoul...)\n그대의 나즈막한 미소가 번지네 (Your quiet smile echoes through my cold regrets.)\nEvery terminal lamp burns in deep purple tone...",
              chorus: "아~ 가슴을 에이는 가혹한 이별아! (Ah~ Bitter parting slicing through my heart!)\n차디찬 가슴 속에 빗물만 치솟네 (Tears flow like cold downpours in my empty soul!)\n날 울려 두고 떠나가면 그대뿐이네! (You are the only one leaving me behind in tears!)",
              verse2: "마지막 열차는 경적을 남기고 (The final train departs with a mournful whistle...)\n잡으려 애써봐도 연기처럼 흩어지네 (Though I reach out, you vanish like smoke.)",
              climax: "보낼 수 없어서! 무너지는 무덤처럼 한을 토해내네! (Because I can't let go! Spewing my Han like a crumbling star!)",
              outro: "(향수 어린 아쿠스틱 기타 선율이 애절한 아코디언 소리와 함께 페이드아웃 됩니다...)"
            },
            lyricsSentiments: {
              intro: "Sad",
              verse1: "Mournful",
              chorus: "Dramatic",
              verse2: "Romantic",
              climax: "Dramatic",
              outro: "Mournful"
            },
            soundDesign: "크로스오버 정통 트로트: 정통 아코디언 선율에 아날로그 신디사이저, 어쿠스틱 기타 스트러밍 및 부드러운 관악기 섹션이 혼합된 세련된 구성.",
            percentageHitProbability: 97.2,
            billboardAnalysis: "한과 대중적인 중독성을 모두 잡았으며 소셜 미디어 플랫폼 숏폼 배경음악으로 어필하기 탁월한 훅 구조를 설계했습니다."
          }
        ];
        setGeneratedTrack(fallbacks[0]);
        saveToAlbum(fallbacks[0]);
        setActiveTab('player');
        downloadScoreAsText(fallbacks[0]);
      }, 800);
    } finally {
      setIsGenerating(false);
    }
  };

  // Web Audio client-side synthesizer for sing-along loops
  const startSynth = () => {
    if (synthPlaying) {
      stopSynth();
      return;
    }
    
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        alert("Web Audio is unsupported in this browser.");
        return;
      }
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      setSynthPlaying(true);
      setLogs(prev => ['> Live synth: Initiated Trot Chord loop (90 BPM)...', ...prev]);

      // Automatically execute live internet web search for high fidelity original instrument samples
      loadInstrumentSamples(ctx);

      const bpm = generatedTrack?.tempoBpm || 116;
      const stepDuration = 60 / bpm / 2; // 1/8 notes
      let step = 0;
      
      // Trot basic chord progression in minor / major
      // i - iv - V - i (represented as oscillator frequencies)
      const minorChords = [
        [110, 131, 165],     // Am
        [116, 147, 175],     // Dm
        [123, 156, 196],     // E7
        [110, 131, 165]      // Am
      ];
      
      const majorChords = [
        [130, 164, 196],     // C
        [146, 174, 220],     // F
        [146, 196, 246],     // G
        [130, 164, 196]      // C
      ];

      const chords = selectedChord.includes('i') ? minorChords : majorChords;

      const runSequencer = () => {
        const time = ctx.currentTime;
        const chordIndex = Math.floor(step / 8) % chords.length;
        const currentChord = chords[chordIndex];
        const stepInChord = step % 8;

        // Basic traditional Trot rhythm: "쿵-짝-짜-쿵-짝" (Du-ple rhythm)
        // Accent beat definition
        let isAccent = stepInChord === 0 || stepInChord === 4;
        let isOffbeat = stepInChord === 2 || stepInChord === 3 || stepInChord === 6;

        if (!isMuted) {
          // Play Bassline Note
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'sawtooth';
          
          let bassNote = currentChord[0] / 2; // Bass oct
          if (stepInChord === 4) bassNote = currentChord[2] / 2;
          if (stepInChord === 6) bassNote = currentChord[1] / 2;
          
          bassOsc.frequency.setValueAtTime(bassNote, time);
          
          bassGain.gain.setValueAtTime(isAccent ? 0.25 : 0.15, time);
          bassGain.gain.exponentialRampToValueAtTime(0.01, time + stepDuration * 0.9);
          
          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);
          
          bassOsc.start(time);
          bassOsc.stop(time + stepDuration);

          // Play Specialty/Vocal Arp & Hybrid Orchestrations to make it rich Trot-like
          if (isOffbeat || stepInChord === 0) {
            const rootFreq = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
            
            // Scaled dynamic vibration factor from custom slider
            const currentVib = vocalistVibration[selectedVocalistId] !== undefined ? vocalistVibration[selectedVocalistId] : 70;
            const vibFactor = currentVib / 70; // normalized around standard 70%
            
            const currentTrillSpeed = vocalistTrillSpeed[selectedVocalistId] !== undefined ? vocalistTrillSpeed[selectedVocalistId] : 70;
            const trillSpeedFactor = currentTrillSpeed / 70; // normalized around standard 70%
            const trillTimeFactor = Math.max(0.15, 1 / trillSpeedFactor);

            // Iterate over all active instruments in the dynamic mixer to generate realistic layering
            instruments.forEach((inst) => {
              if (!inst.active) return;
              
              const instVolume = inst.volume / 100;
              const baseGainVal = 0.08 * instVolume;

              // Check if we have preloaded/fetched real high-quality instrument audio sample files from the web
              const noteToFetch = getClosestLoadedNote(rootFreq);
              const cachedBuffer = cachedBuffersRef.current[inst.id]?.[noteToFetch] 
                || cachedBuffersRef.current[inst.id]?.[noteToFetch === 'C3' ? 'G3' : 'C4'] 
                || cachedBuffersRef.current[inst.id]?.[noteToFetch === 'C4' ? 'G3' : 'C3'];

              if (cachedBuffer) {
                try {
                  const bufferSource = ctx.createBufferSource();
                  bufferSource.buffer = cachedBuffer;

                  const gainNode = ctx.createGain();
                  gainNode.gain.setValueAtTime(baseGainVal * 1.8, time);
                  gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2);

                  // Intelligently pitch bend the preloaded audio note to the exact requested chord frequency!
                  const baseFreq = noteToFetch === 'C3' ? 130.81 : (noteToFetch === 'G3' ? 196.00 : 261.63);
                  const playbackRateValue = rootFreq / baseFreq;
                  bufferSource.playbackRate.setValueAtTime(Math.min(2.0, Math.max(0.5, playbackRateValue)), time);

                  bufferSource.connect(gainNode);
                  gainNode.connect(ctx.destination);

                  bufferSource.start(time);
                  bufferSource.stop(time + stepDuration * 2.8);
                  return; // Successfully played high-fidelity real sample - return early!
                } catch (playErr) {
                  console.warn("Sampler playback error, falling back to procedural synthesis:", playErr);
                }
              }
              
              const osc = ctx.createOscillator();
              const gainNode = ctx.createGain();
              
              if (inst.id === 'accordion') {
                // Accordion uses detuned triangle and sawtooth oscillators for rich bellows swell
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(rootFreq * (1 - 0.04 * vibFactor), time);
                osc.frequency.linearRampToValueAtTime(rootFreq, time + 0.05 * trillTimeFactor);
                
                const oscDetuned = ctx.createOscillator();
                const gainDetuned = ctx.createGain();
                oscDetuned.type = 'sawtooth';
                oscDetuned.frequency.setValueAtTime(rootFreq * 1.003 * (1 - 0.04 * vibFactor), time);
                oscDetuned.frequency.linearRampToValueAtTime(rootFreq * 1.003, time + 0.05 * trillTimeFactor);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(baseGainVal * 0.7, time + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2);
                
                gainDetuned.gain.setValueAtTime(0, time);
                gainDetuned.gain.linearRampToValueAtTime(baseGainVal * 0.3, time + 0.05);
                gainDetuned.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.8);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscDetuned.connect(gainDetuned);
                gainDetuned.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 2);
                oscDetuned.start(time);
                oscDetuned.stop(time + stepDuration * 2);
              } 
              else if (inst.id === 'gayageum') {
                // Plucked, extremely rapid attack, swift decay, slight pitch bend upwards
                osc.type = 'sine';
                osc.frequency.setValueAtTime(rootFreq * 0.97, time);
                osc.frequency.exponentialRampToValueAtTime(rootFreq, time + 0.04 * trillTimeFactor);
                
                gainNode.gain.setValueAtTime(baseGainVal * 1.2, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 0.65);
                
                const delay = ctx.createDelay();
                delay.delayTime.setValueAtTime(0.015, time);
                const delayGain = ctx.createGain();
                delayGain.gain.setValueAtTime(0.3, time);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                gainNode.connect(delay);
                delay.connect(delayGain);
                delayGain.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 0.85);
              } 
              else if (inst.id === 'saxophone') {
                // Saxophone: warm sawtooth with gentle lowpass filter sweep
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(rootFreq * (1 - 0.03 * vibFactor), time);
                osc.frequency.linearRampToValueAtTime(rootFreq, time + 0.08 * trillTimeFactor);
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(450, time);
                filter.frequency.exponentialRampToValueAtTime(1450, time + 0.12);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(baseGainVal * 0.85, time + 0.08);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2.2);
                
                osc.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 2.5);
              } 
              else if (inst.id === 'guitar') {
                // Bright high-harmonic sharp acoustic or drive guitar string pluck
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(rootFreq, time);
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.Q.setValueAtTime(1.5, time);
                filter.frequency.setValueAtTime(1150, time);
                
                gainNode.gain.setValueAtTime(baseGainVal * 1.15, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.1);
                
                osc.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 1.4);
              } 
              else if (inst.id === 'piano') {
                // Classical piano hammer attack (triangle) + pure tone body (sine)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(rootFreq, time);
                
                const hammerOsc = ctx.createOscillator();
                const hammerGain = ctx.createGain();
                hammerOsc.type = 'triangle';
                hammerOsc.frequency.setValueAtTime(rootFreq * 2, time);
                
                gainNode.gain.setValueAtTime(baseGainVal * 0.95, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2.5);
                
                hammerGain.gain.setValueAtTime(baseGainVal * 0.65, time);
                hammerGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                hammerOsc.connect(hammerGain);
                hammerGain.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 2.7);
                hammerOsc.start(time);
                hammerOsc.stop(time + 0.1);
              } 
              else if (inst.id === 'synth') {
                // Retro EDM highway trance lead (Detuned saw, bright, open filter)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(rootFreq * (1 - 0.05 * vibFactor), time);
                osc.frequency.linearRampToValueAtTime(rootFreq, time + 0.04 * trillTimeFactor);
                
                osc.frequency.linearRampToValueAtTime(rootFreq * (1 + 0.025 * vibFactor), time + 0.15 * trillTimeFactor);
                osc.frequency.linearRampToValueAtTime(rootFreq * (1 - 0.025 * vibFactor), time + 0.22 * trillTimeFactor);
                
                gainNode.gain.setValueAtTime(baseGainVal * 0.75, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.5);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 1.8);
              } 
              else if (inst.id === 'violin') {
                // Orchestral string section (smooth slow-attack, rich sweet vibrato)
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(rootFreq, time);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(baseGainVal * 1.05, time + 0.14);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2.8);
                
                osc.frequency.setValueAtTime(rootFreq, time);
                osc.frequency.linearRampToValueAtTime(rootFreq * (1 + 0.016 * vibFactor), time + 0.1 * trillTimeFactor);
                osc.frequency.linearRampToValueAtTime(rootFreq * (1 - 0.016 * vibFactor), time + 0.2 * trillTimeFactor);
                osc.frequency.linearRampToValueAtTime(rootFreq, time + 0.3 * trillTimeFactor);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 3.1);
              }
              else if (inst.id === 'haegeum') {
                // Haegeum strings: triangle with higher pitched nasal color
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(rootFreq * 2.0 * (1 - 0.045 * vibFactor), time);
                osc.frequency.linearRampToValueAtTime(rootFreq * 2.0, time + 0.05 * trillTimeFactor);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(baseGainVal * 0.85, time + 0.06);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2.4);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 2.4);
              }
              else if (inst.id === 'synth_brass') {
                // Synth Brass: warm detuned sawtooth wave with retro brass swell
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(rootFreq, time);
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1400, time);
                filter.frequency.exponentialRampToValueAtTime(450, time + 0.25);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(baseGainVal * 1.1, time + 0.06);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.6);
                
                osc.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 1.6);
              }
              else if (inst.id === 'taepyeongso') {
                // Taepyeongso: piercing square wave with raw bandpass filter
                osc.type = 'square';
                osc.frequency.setValueAtTime(rootFreq * 2, time);
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(1800, time);
                filter.Q.setValueAtTime(1.2, time);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(baseGainVal * 0.55, time + 0.04);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.2);
                
                osc.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 1.2);
              }
              else if (inst.id === 'synth_bass') {
                // Synth Bass: deep low-pass sawtooth reinforcing 쿵짝 rhythm
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(rootFreq / 2, time);
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(160, time);
                
                gainNode.gain.setValueAtTime(baseGainVal * 1.4, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 0.95);
                
                osc.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + stepDuration * 1.0);
              }
              else if (inst.id === 'drum_kit') {
                // Retro Trot Kick-Snare Drum approximation
                osc.type = 'sine';
                osc.frequency.setValueAtTime(130, time);
                osc.frequency.exponentialRampToValueAtTime(42, time + 0.1);
                
                gainNode.gain.setValueAtTime(baseGainVal * 1.9, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.start(time);
                osc.stop(time + 0.15);
              }
              else if (inst.id === 'flute') {
                // Warm breathy wood flutes with gentle 6Hz vibrato
                osc.type = 'sine';
                
                const lfo = ctx.createOscillator();
                const lfoGain = ctx.createGain();
                lfo.frequency.setValueAtTime(5.8, time);
                lfoGain.gain.setValueAtTime(rootFreq * 0.012, time);
                
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                
                osc.frequency.setValueAtTime(rootFreq, time);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(baseGainVal * 1.0, time + 0.09);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.9);
                
                lfo.start(time);
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                osc.start(time);
                osc.stop(time + stepDuration * 2);
                lfo.stop(time + stepDuration * 2);
              }
            });
          }
          
          // Trot Hihat / Percussion (Chack sound)
          if (stepInChord === 2 || stepInChord === 6) {
            const noise = ctx.createBufferSource();
            const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseBuffer.length; i++) {
              output[i] = Math.random() * 2 - 1;
            }
            noise.buffer = noiseBuffer;
            
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.015, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
            
            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start(time);
          }
        }

        // Cycle active lyrics highlights
        if (generatedTrack && step % 16 === 0) {
          const keys = ['intro', 'verse1', 'chorus', 'verse2', 'climax', 'outro'];
          const keyIdx = Math.floor(step / 16) % keys.length;
          setActiveLyricsKey(keys[keyIdx]);
        }

        step++;
      };

      // Run immediately
      runSequencer();
      
      // Set interval
      const intervalId = window.setInterval(runSequencer, stepDuration * 1000);
      synthIntervalRef.current = intervalId;

    } catch (e) {
      console.error(e);
    }
  };

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setSynthPlaying(false);
    setActiveLyricsKey(null);
  };

  // TTS Voice composition preview using server-side Gemini
  const handleVocalSynthesis = async (sectionKey: string, text: string) => {
    if (ttsLoading) return;
    stopTts();
    stopSynth();

    setTtsLoading(true);
    setActiveLyricsKey(sectionKey);
    setLogs(prev => [`> 가창 미리듣기: 서버에서 미디 소스 및 "${sectionKey}" 성분 가창 합성 중...`, ...prev]);

    try {
      const res = await fetch('/api/synthesize-vocal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          voiceName: selectedVocalistId
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Server error speaking.');
      }

      const data = await res.json();
      if (!data.audio) {
        throw new Error('No audio found in the synthesis response.');
      }

      // Play base64 audio
      const audioUrl = `data:audio/mp3;base64,${data.audio}`;
      setTtsAudioUrl(audioUrl);
      setTtsPlaying(true);

      const audio = new Audio(audioUrl);
      ttsAudioRef.current = audio;
      audio.play();

      audio.onended = () => {
        setTtsPlaying(false);
        setActiveLyricsKey(null);
        setTtsAudioUrl(null);
      };

    } catch (error: any) {
      console.warn("Speech Synthesis failed:", error);
      setLogs(prev => [`> 가창 안내사항: ${error.message || '가창 오디오 가이드 서버 연결 해제'}`, ...prev]);
      setShowKeyAlert(true);
      setActiveLyricsKey(null);
      
      // Perform fallback cute local beep-vocal so user still gets an audio cue!
      playEmergencyVocalBeeps(text);
    } finally {
      setTtsLoading(false);
    }
  };

  const stopTts = () => {
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    setTtsPlaying(false);
    setTtsAudioUrl(null);
  };

  const playEmergencyVocalBeeps = (lyricsText: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let stepTime = ctx.currentTime;

      // Extract a few words for fun melodious beeps
      const words = lyricsText.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '').split(/\s+/).slice(0, 10);
      
      words.forEach((word, index) => {
         const osc = ctx.createOscillator();
         const gn = ctx.createGain();

         // Calculate frequency based on letters
         const len = word.length || 3;
         const freqs = [293.66, 329.63, 349.23, 392.00, 440.00, 523.25]; // Minor scale D-E-F-G-A-C
         const noteFreq = freqs[len % freqs.length];

         osc.type = 'triangle';
         osc.frequency.setValueAtTime(noteFreq, stepTime);
         // Add emotional glide
         osc.frequency.setValueAtTime(noteFreq * 0.95, stepTime);
         osc.frequency.linearRampToValueAtTime(noteFreq, stepTime + 0.08);

         gn.gain.setValueAtTime(0.18, stepTime);
         gn.gain.exponentialRampToValueAtTime(0.01, stepTime + 0.28);

         osc.connect(gn);
         gn.connect(ctx.destination);

         osc.start(stepTime);
         osc.stop(stepTime + 0.3);

         stepTime += 0.24;
      });

      // Show temporary text highlight
      let highlightTimer = setTimeout(() => {
         setActiveLyricsKey(null);
      }, words.length * 240);

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#06070a] md:bg-gradient-to-tr md:from-[#0a0c14] md:via-[#040508] md:to-[#141829] flex items-center justify-center text-white font-sans overflow-hidden select-none">
      
      {/* Decorative Brand Background Element (Only visible on desktop) */}
      <div className="hidden md:flex absolute left-8 top-8 flex-col gap-1 z-0 pointer-events-none font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <h1 className="text-sm font-black tracking-widest text-slate-400 font-mono uppercase">Samsung One UI Core Engine</h1>
        </div>
        <p className="text-[11px] text-slate-600 font-medium">K-Trot Master AI Workstation v2.4 (Samsung Galaxy Optimized)</p>
      </div>

      <div className="hidden md:flex absolute right-8 bottom-8 flex-col text-right gap-1 z-0 pointer-events-none font-sans">
        <p className="text-[10px] text-slate-600 font-mono">MODEL ID: SM-S928B (Galaxy S24 Ultra mockup)</p>
        <p className="text-[9px] text-slate-700 italic font-medium">Pre-production Preview build: sirius1118@gmail.com</p>
      </div>

      {/* Samsung Galaxy S24 Ultra Mockup Container */}
      <div className="relative w-full h-full md:w-[395px] md:h-[812px] md:rounded-[44px] md:border-[10px] md:border-[#2b2d35] md:shadow-[0_25px_65px_rgba(0,0,0,0.85)] md:bg-[#07080a] flex flex-col overflow-hidden">
        
        {/* Physical Button Mockups (Power, Vol) */}
        <div className="hidden md:block absolute -right-[12px] top-32 w-[3px] h-12 bg-[#212328] rounded-l-xs z-50"></div>
        <div className="hidden md:block absolute -right-[12px] top-48 w-[3px] h-20 bg-[#212328] rounded-l-xs z-50"></div>

        {/* Front Punch hole Camera notch */}
        <div className="hidden md:block absolute top-3.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-black border border-zinc-800/20 z-40 pointer-events-none"></div>

        {/* Android Status Bar */}
        <div id="android-status-bar" className="h-10 w-full flex items-center justify-between px-6 bg-black/40 text-[11px] font-semibold border-b border-white/[0.03] z-20 pt-1.5 flex-shrink-0">
          <span className="font-sans text-zinc-300">{timeStr}</span>
          <div className="flex items-center gap-2 text-zinc-300">
            <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
            <div className="flex gap-0.5 items-end h-2.5">
              <div className="w-[2.5px] h-1 bg-white/40 rounded-xs"></div>
              <div className="w-[2.5px] h-1.5 bg-white rounded-xs"></div>
              <div className="w-[2.5px] h-2 bg-white rounded-xs"></div>
              <div className="w-[2.5px] h-2.5 bg-white rounded-xs"></div>
            </div>
            <span className="font-black text-[9px] tracking-tighter">5G</span>
            <div className="w-5.5 h-3 border border-white/40 rounded-[3px] relative p-[0.7px]/ flex items-center">
              <div className="h-full w-[88%] bg-blue-500 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Main Studio Frame (Now wrapped inside S24 mockup frame) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Vocal Library (Hidden on Samsung Mobile layout - Transferred to internal One UI Vocal Tab) */}
        <aside id="vocal-library-sidebar" className="hidden w-72 bg-[#0e0e11] border-r border-white/5 flex-col flex-shrink-0">
          <div className="p-5 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 rounded-md bg-indigo-600/20 border border-indigo-500/30">
                <Music className="w-3.5 h-3.5 text-indigo-400" />
              </span>
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-black">보컬 라이브러리</h2>
            </div>
            
            {/* Gender Filters */}
            <div className="flex p-0.5 rounded-lg bg-zinc-900 border border-white/[0.04]">
              <button 
                onClick={() => setGenderFilter('male')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                  genderFilter === 'male' 
                    ? 'bg-zinc-800 border border-zinc-700/50 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                남성 ({vocalists.filter(v => v.gender === 'male').length})
              </button>
              <button 
                onClick={() => setGenderFilter('female')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                  genderFilter === 'female' 
                    ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                여성 ({vocalists.filter(v => v.gender === 'female').length})
              </button>
            </div>
          </div>

          {/* Vocalist List with scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar bg-black/5">
            {vocalists
              .filter(v => v.gender === genderFilter)
              .map(v => {
                const isSelected = selectedVocalistId === v.id;
                return (
                  <div 
                    key={v.id}
                    onClick={() => {
                      setSelectedVocalistId(v.id);
                      setLogs(prev => [`> 보컬리스트 타겟 지정: ${v.name} (${v.id})`, ...prev]);
                      // Single local beep sample audio feedback
                      playEmergencyVocalBeeps(v.initials);
                    }}
                    className={`flex flex-col gap-2.5 p-3 rounded-2xl cursor-pointer border transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-zinc-900 to-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/5' 
                        : 'bg-[#121214]/50 border-white/[0.02] hover:bg-zinc-900/50 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${v.color} flex items-center justify-center text-[11px] font-black tracking-tight shadow-sm text-white flex-shrink-0`}>
                        {v.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {v.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 italic truncate mt-0.5">
                          {v.vibe}
                        </p>
                      </div>
                    </div>

                    {/* Fine-tuned Vibration & Trill sliders */}
                    <div 
                      className="mt-1 pt-1.5 border-t border-white/[0.03] flex flex-col gap-2.5 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* Vibration Slider */}
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center text-[10px] text-zinc-400">
                          <span className="font-medium">바이브레이션 강도</span>
                          <span className="font-mono text-indigo-400 font-bold">{vocalistVibration[v.id] || 70}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={vocalistVibration[v.id] || 70}
                          onChange={(e) => {
                            e.stopPropagation();
                            const val = parseInt(e.target.value);
                            setVocalistVibration(prev => ({ ...prev, [v.id]: val }));
                          }}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>

                      {/* Trill Speed Slider */}
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center text-[10px] text-zinc-400">
                          <span className="font-medium">꺾기 (Trill) 속도</span>
                          <span className="font-mono text-pink-400 font-bold">{vocalistTrillSpeed[v.id] || 70}%</span>
                        </div>
                        <input 
                          type="range"
                          min="30"
                          max="130"
                          value={vocalistTrillSpeed[v.id] || 70}
                          onChange={(e) => {
                            e.stopPropagation();
                            const val = parseInt(e.target.value);
                            setVocalistTrillSpeed(prev => ({ ...prev, [v.id]: val }));
                          }}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>

          {/* Sidebar bottom sync info */}
          <div className="p-4 bg-indigo-950/10 border-t border-indigo-500/10">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] uppercase text-indigo-400 font-bold tracking-wider">보컬 자동 매칭율</span>
              <button 
                onClick={() => setAutoUpdateVoice(!autoUpdateVoice)}
                className={`w-7 h-4 rounded-full p-[2px] transition-colors relative flex items-center ${autoUpdateVoice ? 'bg-indigo-500' : 'bg-zinc-800'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${autoUpdateVoice ? 'translate-x-3' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <p className="text-[9px] text-zinc-500 leading-normal">
              전 세계의 실시간 가창 트렌드 및 최신 K-POP 공명 성역 비율 데이터와 어쿠스틱 트로트 음파 특징을 대조 대역 분석합니다.
            </p>
          </div>
        </aside>

        {/* Main Workstation Interface (Now optimized as Samsung One UI Mobile Content scrollboard) */}
        <main id="samsung-oneui-viewport" className="flex-1 overflow-y-auto bg-[#07080a] p-4.5 relative custom-scrollbar flex flex-col gap-4 font-sans text-xs">
          
          {/* Samsung One UI Header Panel (Dynamic Top space) */}
          <div className="px-1.5 pb-2 border-b border-white/[0.02] flex justify-between items-end flex-shrink-0">
            <div>
              {activeTab === 'home' && (
                <>
                  <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold font-sans">SMART COMPOSER</span>
                  <h2 className="text-xl font-black text-white mt-0.5 tracking-tight font-sans">K-트로트 오토메이트</h2>
                </>
              )}
              {activeTab === 'vocalist' && (
                <>
                  <span className="text-[10px] uppercase tracking-widest text-[#B24BF3] font-bold font-sans">ONE UI AUDIOLOGY</span>
                  <h2 className="text-xl font-black text-white mt-0.5 tracking-tight font-sans">명품 트로트 보컬리스트</h2>
                </>
              )}
              {activeTab === 'player' && (
                <>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold font-sans">SAMSUNG PLAYBACK MIXER</span>
                  <h2 className="text-xl font-black text-white mt-0.5 tracking-tight font-sans">실시간 가창 재생기</h2>
                </>
              )}
              {activeTab === 'device' && (
                <>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold font-sans">INTELLIGENT DEVICE CARE</span>
                  <h2 className="text-xl font-black text-white mt-0.5 tracking-tight font-sans">지능형 디바이스 케어</h2>
                </>
              )}
              {activeTab === 'album' && (
                <>
                  <span className="text-[10px] uppercase tracking-widest text-[#E62E6B] font-bold font-sans">MY MASTERPIECE ALBUMS</span>
                  <h2 className="text-xl font-black text-white mt-0.5 tracking-tight font-sans">나의 오케스트라 명반</h2>
                </>
              )}
            </div>
            
            <div className="text-right text-[10px] font-mono font-bold text-zinc-500 flex flex-col justify-end">
              <span>{targetLength}초 컴파일</span>
              <span className="text-[8px] text-zinc-600 mt-0.5">SM-S928B Preview</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">

            {/* Simulated Live Waveform with active canvas animations (Renders on player, device or album tab for audio monitoring) */}
            {(activeTab === 'player' || activeTab === 'device' || activeTab === 'album') && (
              <div className="h-44 bg-[#0a0a0d]/90 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between p-5 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_75%)]">
                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full border border-white/5">
                    <span className={`w-1.5 h-1.5 rounded-full ${synthPlaying || ttsPlaying ? 'bg-green-500 animate-ping' : 'bg-indigo-400'}`}></span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#8a8da8]">
                      {synthPlaying ? '시퀀서 활성화됨 (90 BPM)' : ttsPlaying ? 'AI 보컬 가창 가이드 송출 중' : '오디오 파형 주파수 실시간 분석기'}
                    </span>
                  </div>
                  {generatedTrack && (
                    <div className="text-[10px] font-mono text-zinc-400">
                      템포 속도: <span className="text-indigo-400 font-bold">{generatedTrack.tempoBpm} BPM</span>
                    </div>
                  )}
                </div>

                {/* Dynamic waveform bars */}
                <div className="flex items-end justify-center gap-1 h-20 px-8 z-10 select-none">
                  {[12, 28, 48, 64, 84, 52, 92, 110, 84, 44, 28, 36, 68, 88, 44, 20, 32, 56, 72, 88, 36, 16, 24].map((height, idx) => {
                    let amplitudeClass = "";
                    if (synthPlaying || ttsPlaying) {
                      const speed = (idx % 3 === 0) ? 'animate-pulse' : (idx % 2 === 0) ? 'animate-bounce' : '';
                      amplitudeClass = `${speed}`;
                    }
                    
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          height: synthPlaying || ttsPlaying 
                            ? `${Math.min(100, height * (1 + Math.sin(idx + Date.now() * 0.05) * 0.5))}%` 
                            : `${height}%` 
                        }}
                        className={`w-[5px] min-h-[4px] rounded-full transition-all duration-300 ${
                          idx === 6 || idx === 12 || idx === 16
                            ? 'bg-gradient-to-t from-indigo-600 to-purple-500 shadow-[0_0_12px_rgba(79,70,229,0.6)]'
                            : idx % 3 === 0 
                              ? 'bg-zinc-800' 
                              : 'bg-indigo-500/50'
                        } ${amplitudeClass}`}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-between items-center z-10 border-t border-white/[0.02] pt-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                    스펙트럼 밴드 대역: K-트로트 보컬 크로스오버 기준 분석선
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    참조: 24-비트 PCM / 48kHz
                  </span>
                </div>
              </div>
            )}

            {/* Input Selection Panel of "Money Codes" & Theme */}
            {activeTab === 'home' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Configuration Panel */}
              <div className="lg:col-span-2 bg-[#121214]/70 rounded-3xl p-5 lg:p-6 border border-white/5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#989bab]">
                      작곡 및 편곡 하이퍼 파라미터
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-mono font-bold uppercase border border-green-500/20">
                    ● 합성 엔지니어 온라인
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Chord Progression selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      음악적 화성 코드 진행 (곡 고유 정체성 결정)
                    </label>
                    <div className="space-y-1.5">
                      {chordOptions.map(opt => (
                        <button
                          key={opt.code}
                          onClick={() => {
                            setSelectedChord(opt.code);
                            setLogs(prev => [`> 화성 구조 코드 타격 배정: ${opt.code}`, ...prev]);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all border ${
                            selectedChord === opt.code
                              ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300 font-bold'
                              : 'bg-black/30 border-white/[0.02] text-zinc-400 hover:bg-black/50 hover:text-white'
                          }`}
                        >
                          <span>{opt.code}</span>
                          <span className="text-[9px] text-zinc-500 font-mono font-normal truncate max-w-[150px]">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vibe lyric theme topics */}
                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        가사 테마 및 정서적 주제 영역 지정
                      </label>
                      <select
                        value={selectedTopicPreset}
                        onChange={(e) => {
                          setSelectedTopicPreset(e.target.value);
                          setCustomTopic('');
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {topicPresets.map(t => (
                          <option key={t} value={t} className="bg-[#121214] text-white">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        사용자 정의 작사 프롬프트 입력 (선택사항)
                      </label>
                      <input 
                        type="text"
                        placeholder="예: 비가 추적추적 내리는 한강 다리 밑에서의 작별 약속..."
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 hover:border-white/10 focus:border-indigo-500 transition-colors rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Manual Vocalist and Gender Selection Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pt-4 border-t border-white/[0.03]">
                  {/* Gender Select button row */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      보컬 성별 수동 지정
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setGenderFilter('all');
                          setLogs(prev => ['> 보컬 성별 수동 필터: 전체 보컬 목록 표시', ...prev]);
                        }}
                        className={`py-2 text-[11px] font-semibold rounded-xl border text-center transition-all ${
                          genderFilter === 'all'
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                            : 'bg-black/30 border-white/[0.02] text-zinc-400 hover:bg-black/50 hover:text-white'
                        }`}
                      >
                        전체보컬
                      </button>
                      <button
                        onClick={() => {
                          setGenderFilter('male');
                          setLogs(prev => ['> 보컬 성별 수동 필터: 남성 보컬 목록 표시', ...prev]);
                          const firstMale = vocalists.find(v => v.gender === 'male');
                          if (firstMale) setSelectedVocalistId(firstMale.id);
                        }}
                        className={`py-2 text-[11px] font-semibold rounded-xl border text-center transition-all ${
                          genderFilter === 'male'
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                            : 'bg-black/30 border-white/[0.02] text-zinc-400 hover:bg-black/50 hover:text-white'
                        }`}
                      >
                        ♂ 남성보컬
                      </button>
                      <button
                        onClick={() => {
                          setGenderFilter('female');
                          setLogs(prev => ['> 보컬 성별 수동 필터: 여성 보컬 목록 표시', ...prev]);
                          const firstFemale = vocalists.find(v => v.gender === 'female');
                          if (firstFemale) setSelectedVocalistId(firstFemale.id);
                        }}
                        className={`py-2 text-[11px] font-semibold rounded-xl border text-center transition-all ${
                          genderFilter === 'female'
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                            : 'bg-black/30 border-white/[0.02] text-zinc-400 hover:bg-black/50 hover:text-white'
                        }`}
                      >
                        ♀ 여성보컬
                      </button>
                    </div>
                  </div>

                  {/* Vocalist Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      지정 보컬리스트 (실시간 매핑)
                    </label>
                    <select
                      value={selectedVocalistId}
                      onChange={(e) => {
                        const vId = e.target.value;
                        setSelectedVocalistId(vId);
                        const chosen = vocalists.find(v => v.id === vId);
                        if (chosen) {
                          setLogs(prev => [`> 보컬 수동 지정: ${chosen.name} (${chosen.id})`, ...prev]);
                          playEmergencyVocalBeeps(chosen.initials);
                        }
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {vocalists
                        .filter(v => genderFilter === 'all' || v.gender === genderFilter)
                        .map(v => (
                          <option key={v.id} value={v.id} className="bg-[#121214] text-white">
                            {v.name} ({v.gender === 'male' ? '남성' : '여성'} / {v.vibe})
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                {/* Siders elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/[0.03]">
                  {/* Melody Density slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">
                        선율 중독성 강도 및 밀도 조율
                      </span>
                      <span className="text-xs font-mono text-indigo-400 font-bold">
                        중독성 {melodyDensity}% 설정
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="65" 
                      max="99" 
                      value={melodyDensity} 
                      onChange={(e) => setMelodyDensity(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-zinc-800 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                  </div>

                  {/* Target length slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">
                        곡 총 재생 길이 지정 (초 단위)
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {targetLength}초 컴파일 타겟
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="120" 
                      max="300" 
                      value={targetLength} 
                      onChange={(e) => setTargetLength(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-zinc-800 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                  </div>
                </div>

              </div>

              {/* Billboard Probability Metric */}
              <div className="bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-purple-600 z-0"></div>
                <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.3)_0%,transparent_60%)] z-0"></div>
                
                {/* Visual badge top */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10 z-10 backdrop-blur-xs">
                  <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse fill-yellow-300" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white">빌보드 진출 유망도 측정</span>
                </div>

                <div className="my-5 z-10">
                  <p className="text-[9px] uppercase font-black text-white/70 tracking-[0.2em] mb-1">
                    히트 적합성 예측 확률
                  </p>
                  <p className="text-5xl lg:text-6xl font-black tracking-tighter text-white drop-shadow">
                    {computedProbability}<span className="text-xl lg:text-2xl font-light opacity-80">%</span>
                  </p>
                  <p className="text-[9px] text-indigo-200 mt-2 tracking-wide font-medium italic">
                    크로스오버 현대 가요 음향 구조 분석 완벽 적합
                  </p>
                </div>

                {/* Compose Now Activation Button */}
                <button 
                  onClick={handleCompose}
                  disabled={isGenerating}
                  className="w-full py-3.5 bg-white text-indigo-700 hover:bg-zinc-100 disabled:bg-zinc-200 disabled:text-zinc-400 font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-950/20 active:scale-[0.98] transition-all duration-150 z-10 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
                      <span>히트곡 긴급 조율 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-indigo-700" />
                      <span>인공지능 편곡 시작</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Dynamic Orchestration Instrument Mixer Panel */}
            <div className="bg-gradient-to-br from-[#121214]/85 to-[#18181b]/50 rounded-3xl p-5 lg:p-6 border border-white/5 shadow-2xl flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Music className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                      유기적 하이브리드 악기 오케스트레이션 믹서
                    </h3>
                    <p className="text-[10px] text-zinc-500">모든 음악 장르의 고유 음원을 가상 동적으로 합성하는 멀티채널 매칭 앙상블</p>
                  </div>
                </div>
                
                {/* Active Match Badge */}
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-indigo-500/20 self-start sm:self-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span className="text-[9px] uppercase font-black tracking-wider text-zinc-400">오케스트라 매칭: </span>
                  <span className="text-[10px] font-bold text-indigo-400">{instrumentMixName}</span>
                </div>
              </div>

              {/* Real instrument internet search preloader widget */}
              <div className="p-4 rounded-3xl bg-indigo-950/[0.12] border border-indigo-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-lg text-indigo-400">
                    🌐
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-zinc-100 flex items-center gap-2">
                      실시간 웹 악기 음원 데이터베이스 검색 및 장착 엔진
                      {isDownloadingSamples ? (
                        <span className="text-[9px] font-bold text-indigo-400 animate-pulse bg-indigo-400/10 px-2 py-0.5 rounded-full">지능형 수집 중...</span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">실시간 탐색 활성화</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-normal mt-1">
                      각 가상 악기의 주파수에 반응하는 {Object.keys(instrumentSoundfontAliases).length}대 최고급 고품격 타현 실재 녹음본(.mp3)을 인터넷에서 다운로드하여 합성 루프에 실시간 혼합했습니다.
                    </p>
                    {downloadedSamplesCount > 0 && (
                      <span className="text-[9px] font-mono text-indigo-400 font-extrabold mt-1 block">
                        ✓ 수신 완료된 타현 오디오 음향 고유 인덱스 수량: {downloadedSamplesCount} 리소스 수신됨
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  disabled={isDownloadingSamples}
                  onClick={() => {
                    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                    if (!audioContextRef.current) {
                      audioContextRef.current = new AudioCtx();
                    }
                    loadInstrumentSamples(audioContextRef.current);
                  }}
                  className={`px-3 py-2 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                    isDownloadingSamples 
                      ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/15'
                  }`}
                >
                  {isDownloadingSamples ? (
                    <>
                      <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>동기화 중...</span>
                    </>
                  ) : (
                    <>
                      <span>📥 실시간 음향 수집 및 보정</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {instruments.map((inst) => {
                  return (
                    <div 
                      key={inst.id}
                      className={`flex flex-col gap-3 p-4 rounded-3xl border transition-all duration-300 ${
                        inst.active 
                          ? 'bg-gradient-to-b from-[#16161a] to-[#121214] border-indigo-500/20 shadow-md shadow-indigo-500/2'
                          : 'bg-[#121214]/30 border-white/[0.01] opacity-60 hover:opacity-85'
                      }`}
                    >
                      {/* Header row */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl transition-all duration-300 ${synthPlaying && inst.active ? 'scale-110 rotate-3 inline-block animate-bounce' : ''}`}>
                            {inst.icon}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                              {inst.name}
                              {inst.active && synthPlaying && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                              )}
                            </h4>
                            <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{inst.genre}</p>
                          </div>
                        </div>

                        {/* Toggle switch */}
                        <button
                          onClick={() => {
                            const updated = instruments.map(i => i.id === inst.id ? { ...i, active: !i.active } : i);
                            setInstruments(updated);
                            setLogs(prev => [`> 악기 제어: '${inst.name}' 편곡 레이어 ${!inst.active ? '활성화' : '비활성화'}`, ...prev]);
                          }}
                          className={`w-8 h-4.5 rounded-full p-[2px] transition-colors relative flex items-center ${inst.active ? 'bg-indigo-500' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${inst.active ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed line-clamp-2 min-h-[30px]">
                        {inst.desc}
                      </p>

                      {/* Mixer fader */}
                      <div className="flex flex-col gap-1 mt-1 pt-2 border-t border-white/[0.03]">
                        <div className="flex justify-between items-center text-[9px]">
                          <span className="text-zinc-500 font-medium">채널 볼륨 페이더 (Gain)</span>
                          <span className={`font-mono font-bold ${inst.active ? 'text-indigo-400' : 'text-zinc-600'}`}>{inst.volume}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          disabled={!inst.active}
                          value={inst.volume}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const updated = instruments.map(i => i.id === inst.id ? { ...i, volume: val } : i);
                            setInstruments(updated);
                          }}
                          className={`w-full h-1 rounded-lg appearance-none cursor-pointer transition-all ${
                            inst.active 
                              ? 'bg-zinc-850 accent-indigo-500' 
                              : 'bg-zinc-900/50 accent-zinc-750 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Live Sound guide message */}
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-[10px] text-zinc-400">
                <span className="text-indigo-400">ℹ️</span>
                <p>
                  각 악기의 음원은 Web Audio API의 고정밀 로우 레벨 파생 오실레이터 합성 기능을 사용하여 실시간 컴파일 단계 없이 즉각적으로 다성음(Polyphony)으로 동시 화창 연주됩니다.
                </p>
              </div>
            </div>

            {/* Secret API Key Banner alert (nice touch) */}
            {showKeyAlert && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-xs">
                <div>
                  <p className="font-bold">💡 실시간 노래가창 음성연동 정보</p>
                  <p className="opacity-85 mt-0.5">
                    작사 및 편곡 합성이 서정적으로 마무리되었습니다. 실제 노래음 가창 음질 기능은 플랫폼 Secrets 탭에 <span className="font-mono">GEMINI_API_KEY</span>가 완벽히 등록되어야 활성화됩니다. 현재 기기를 위해 아름다운 <strong>오프라인 고성능 복고형 신디사이저 보컬 가이드 가이드</strong>로 자동 대행 연동되었습니다!
                  </p>
                </div>
                <button 
                  onClick={() => setShowKeyAlert(false)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-[10px] font-bold uppercase text-amber-300 transition-colors"
                >
                  닫기
                </button>
              </div>
            )}
          </>
        )}

            {/* TAB 2: VOCALIST SELECT tab */}
            {activeTab === 'vocalist' && (
              <div className="flex flex-col gap-3 font-sans">
                <div className="p-4 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-zinc-300 tracking-wider">명품 피치 필터</span>
                    {/* Gender Filters */}
                    <div className="flex p-0.5 rounded-lg bg-black border border-white/[0.04] w-36">
                      <button 
                        onClick={() => setGenderFilter('male')}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          genderFilter === 'male' 
                            ? 'bg-zinc-800 text-white' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        남성 ({vocalists.filter(v => v.gender === 'male').length})
                      </button>
                      <button 
                        onClick={() => setGenderFilter('female')}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          genderFilter === 'female' 
                            ? 'bg-blue-600/25 text-blue-400 border border-blue-500/10' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        여성 ({vocalists.filter(v => v.gender === 'female').length})
                      </button>
                    </div>
                  </div>
                  
                  {/* Vocal lists grids */}
                  <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {vocalists
                      .filter(v => v.gender === genderFilter)
                      .map(v => {
                        const isSelected = selectedVocalistId === v.id;
                        return (
                          <div 
                            key={v.id}
                            onClick={() => {
                              setSelectedVocalistId(v.id);
                              setLogs(prev => [`> 보컬 보이스 지정: ${v.name} (${v.id})`, ...prev]);
                              playEmergencyVocalBeeps(v.initials);
                            }}
                            className={`flex flex-col gap-2 p-3 rounded-2xl cursor-pointer border transition-all duration-300 ${
                              isSelected 
                                ? 'bg-gradient-to-br from-zinc-900 to-blue-950/40 border-blue-500 shadow-md shadow-blue-500/5 text-white' 
                                : 'bg-[#121214]/60 border-white/[0.02] hover:bg-zinc-950/60 text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-7.5 h-7.5 rounded-full bg-gradient-to-tr ${v.color} flex items-center justify-center text-[9px] font-black tracking-tight text-white shadow-xs`}>
                                {v.initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold truncate">
                                  {v.name}
                                </p>
                              </div>
                            </div>
                            <p className="text-[9px] text-zinc-500 leading-relaxed font-sans line-clamp-2 h-6.5 italic">
                              "{v.vibe}"
                            </p>

                             {/* Fine-tuned Vibration & Trill sliders */}
                             <div 
                               className="mt-1 pt-1.5 border-t border-white/[0.04] flex flex-col gap-2 w-full"
                               onClick={(e) => {
                                 e.stopPropagation();
                               }}
                             >
                               {/* Vibration Slider */}
                               <div className="flex flex-col gap-0.5 w-full">
                                 <div className="flex justify-between items-center text-[9px] text-zinc-400">
                                   <span>바이브레이션 강도</span>
                                   <span className="font-mono text-blue-400 font-bold">{vocalistVibration[v.id] || 70}%</span>
                                 </div>
                                 <input 
                                   type="range"
                                   min="0"
                                   max="100"
                                   value={vocalistVibration[v.id] || 70}
                                   onChange={(e) => {
                                     e.stopPropagation();
                                     const val = parseInt(e.target.value);
                                     setVocalistVibration(prev => ({ ...prev, [v.id]: val }));
                                   }}
                                   className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                 />
                               </div>

                               {/* Trill Speed Slider */}
                               <div className="flex flex-col gap-0.5 w-full">
                                 <div className="flex justify-between items-center text-[9px] text-zinc-500">
                                   <span>꺾기 (Trill) 속도</span>
                                   <span className="font-mono text-pink-400 font-bold">{vocalistTrillSpeed[v.id] || 70}%</span>
                                 </div>
                                 <input 
                                   type="range"
                                   min="30"
                                   max="130"
                                   value={vocalistTrillSpeed[v.id] || 70}
                                   onChange={(e) => {
                                     e.stopPropagation();
                                     const val = parseInt(e.target.value);
                                     setVocalistTrillSpeed(prev => ({ ...prev, [v.id]: val }));
                                   }}
                                   className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                 />
                               </div>
                             </div>
                          </div>
                        );
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-950/10 border border-blue-500/10 text-[10px] text-blue-400/90 leading-relaxed font-sans">
                  지정한 보컬 음파에 따라 심금을 울리는 서사 마디의 꺾기 강도, 굵직한 테너 베이스 성역 및 소울풍 가창 깊이가 컴파일러에 실시간 연동 지정됩니다.
                </div>
              </div>
            )}

            {/* Loading Cover state */}
            {isGenerating && (
              <div className="min-h-56 bg-[#121214]/60 border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-center items-center text-center gap-4 relative overflow-hidden backdrop-blur-xs">
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-zinc-800">
                  <div className="h-full bg-indigo-500 animate-[pulse_1.5s_infinite]" style={{ width: '65%' }}></div>
                </div>
                
                <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin flex items-center justify-center">
                  <Music className="w-6 h-6 text-indigo-400 rotate-12" />
                </div>
                
                <div>
                  <h4 className="text-base font-bold italic tracking-tight">{generationStep}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">
                    AI 마스터 코어가 초당 5.4 TFops 진동수로 합성 처리하고 있습니다
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3 Empty State: Player tab but no track yet */}
            {activeTab === 'player' && !generatedTrack && !isGenerating && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-zinc-900/40 rounded-3xl border border-white/5 my-auto gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 shadow-inner">
                  <Disc className="w-8 h-8 text-zinc-600 animate-[spin_8s_linear_infinite]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-300">편곡 컴파일 완료 대기 중</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 px-4">
                    현재 재생 대기에 등록된 활성 트랙이 없습니다. <br />
                    <strong>오토메이트</strong> 탭에서 나만의 명품 편곡 합성 작업을 먼저 시작해 보세요!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2 bg-blue-600/25 hover:bg-blue-600/35 text-blue-400 text-[10px] font-bold uppercase rounded-lg border border-blue-500/10 transition-all cursor-pointer mt-2"
                >
                  작곡 오토메이트 탭으로 이동
                </button>
              </div>
            )}

            {/* AI Generated Track Results */}
            {activeTab === 'player' && generatedTrack && !isGenerating && (
              <div className="bg-[#121214] rounded-3xl p-6 border border-indigo-500/20 shadow-xl relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-indigo-600/15 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5 mb-5">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 font-mono">
                      인공지능 맞춤형 트로트 크로스오버 편곡 완성곡
                    </span>
                    <h3 className="text-xl font-extrabold italic text-white flex items-center gap-1.5 mt-0.5">
                      <Music className="w-5 h-5 text-indigo-400" />
                      {generatedTrack.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    {/* Retro Sing-along Loop trigger */}
                    <button
                      onClick={startSynth}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        synthPlaying 
                          ? 'bg-rose-600 text-white animate-pulse' 
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {synthPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{synthPlaying ? '신디 루프 정지' : '미디 신디 루프 재생'}</span>
                    </button>

                    {/* Score Download Trigger */}
                    <button
                      onClick={() => downloadScoreAsText()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold uppercase transition-all rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/10"
                      title="악보 다운로드 (.txt)"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>악보 다운로드</span>
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 border border-white/5 bg-[#121214] hover:bg-zinc-800 rounded-xl text-zinc-400 cursor-pointer"
                    >
                      <Volume2 className={`w-4 h-4 ${isMuted ? 'opacity-30' : 'text-indigo-400'}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Stats & Sound Design */}
                  <div className="lg:col-span-1 space-y-4">
                    
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        컴파일 완성 음향 분석 사양
                      </h4>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">템포 강도 (Beats):</span>
                        <span className="font-mono text-white font-bold">{generatedTrack.tempoBpm} BPM</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">꺾기 바이브레이션:</span>
                        <span className="text-indigo-400 font-bold">{generatedTrack.vocalVibrato}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">대상 지정 보컬:</span>
                        <span className="text-white font-bold">{currentVocalist.name} ({genderFilter === 'male' ? '남성' : '여성'})</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">화성 뉴럴 엔진 상태:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${generatedTrack.isFallback ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
                          {generatedTrack.isFallback ? '오프라인 백업 모드' : 'Gemini 차트 분석 가동'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#191921]/40 p-4 rounded-2xl border border-white/5">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                        편곡 보컬 합성 설계 도안
                      </h4>
                      <p className="text-xs text-zinc-400 leading-normal">
                        {generatedTrack.soundDesign}
                      </p>
                    </div>

                    <div className="bg-[#1a1320]/30 p-4 rounded-2xl border border-indigo-500/10">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1.5">
                        빌보드 타겟 심층 차트 분석
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed italic">
                        "{generatedTrack.billboardAnalysis}"
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Lyric segment controller */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          작사 분석 스테이지 및 멜로디 파트 미리듣기
                        </h4>
                        <p className="text-[9px] text-zinc-500 italic mt-0.5">
                          각 소절의 한과 기쁨의 깊이를 AI가 정밀 분석하여 감정 태그가 자동 배열되었습니다.
                        </p>
                      </div>
                      <span className="text-[9px] text-zinc-500 italic self-start sm:self-center">
                        소절 버튼을 클릭하시면 보컬 가이드가 송출됩니다.
                      </span>
                    </div>

                    {/* AI Lyric Auto-Rewrite Prompt Input Card */}
                    <div className="bg-gradient-to-r from-[#111222] to-[#1a142c] rounded-2xl p-4.5 border border-indigo-500/15 flex flex-col sm:flex-row items-center gap-3.5 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.06)_0%,transparent_60%)] pointer-events-none"></div>
                      <div className="flex-1 w-full z-10">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">
                            AI 초지능 실시간 자동 개사 / 편곡 스테이션
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="예: '후렴구 사비에서 가을 한강의 울적함 대신 눈 내린 설원을 배경으로 신나는 트로트 리듬이 되게 개사하고 영어를 아예 빼줘'..."
                          value={lyricInstruction}
                          onChange={(e) => setLyricInstruction(e.target.value)}
                          className="w-full bg-black/45 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>
                      
                      <button
                        onClick={handleRewriteLyrics}
                        disabled={isRewritingLyrics || !lyricInstruction.trim()}
                        className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-805 disabled:text-zinc-500 font-bold text-xs uppercase tracking-widest text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 self-end z-10 cursor-pointer min-h-[40px]"
                      >
                        {isRewritingLyrics ? (
                          <>
                            <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>자동 개사 중...</span>
                          </>
                        ) : (
                          <>
                            <span>✨ AI 가사 재제작</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Sentiment Analysis Color Scheme Legend */}
                    <div className="bg-[#121214]/60 p-3 rounded-2xl border border-white/[0.04] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[9px] text-zinc-400">
                      <span className="col-span-2 sm:col-span-3 lg:col-span-6 font-extrabold text-zinc-500 uppercase tracking-widest text-center border-b border-white/[0.02] pb-1.5 mb-1">
                        🎨 실시간 AI 감정 분석 스펙트럼 레코드
                      </span>
                      <span className="flex items-center gap-1.5 bg-blue-500/5 text-blue-400 border border-blue-500/10 px-2 py-1 rounded-lg justify-center font-bold">💧 한맺힌 슬픔</span>
                      <span className="flex items-center gap-1.5 bg-yellow-500/5 text-yellow-500 border border-yellow-500/10 px-2 py-1 rounded-lg justify-center font-bold">💃 어깨춤 흥겨움</span>
                      <span className="flex items-center gap-1.5 bg-red-500/5 text-red-500 border border-red-500/10 px-2 py-1 rounded-lg justify-center font-bold">🔥 대서사 극적비장</span>
                      <span className="flex items-center gap-1.5 bg-pink-500/5 text-pink-400 border border-pink-500/10 px-2 py-1 rounded-lg justify-center font-bold">💖 달콤한 로맨스</span>
                      <span className="flex items-center gap-1.5 bg-purple-500/5 text-purple-400 border border-purple-500/10 px-2 py-1 rounded-lg justify-center font-bold">🥀 애조 띤 탄식</span>
                      <span className="flex items-center gap-1.5 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-1 rounded-lg justify-center font-bold">🌅 서광 어린 희망</span>
                    </div>

                    {/* Lyric Segments render */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                      
                      {(Object.entries(generatedTrack.lyrics) as [string, string][]).map(([sectionKey, text]) => {
                        const isSpeakingThis = activeLyricsKey === sectionKey;
                        let displayName = sectionKey;
                        if (sectionKey === 'intro') displayName = '정주 인트로';
                        else if (sectionKey === 'verse1') displayName = '절(Verse 1)';
                        else if (sectionKey === 'verse2') displayName = '절(Verse 2)';
                        else if (sectionKey === 'chorus') displayName = '후창 사비(Chorus)';
                        else if (sectionKey === 'climax') displayName = '한풀이 감정 절정(Climax)';
                        else if (sectionKey === 'outro') displayName = '감정의 여운 아웃트로';
                        
                        // Dynamically resolve sentiment based on AI logic or fallback
                        const sentimentVal = generatedTrack.lyricsSentiments?.[sectionKey as any] || (
                          sectionKey === 'intro' ? 'Sad' :
                          sectionKey === 'verse1' ? 'Mournful' :
                          sectionKey === 'chorus' ? 'Dramatic' :
                          sectionKey === 'verse2' ? 'Romantic' :
                          sectionKey === 'climax' ? 'Dramatic' : 'Mournful'
                        );
                        const sBadge = getSentimentBadge(sentimentVal);

                        // Color-code the parent block depending on sentiment
                        let containerColorClasses = 'bg-black/40 border-white/[0.02] hover:border-white/10';
                        if (!isSpeakingThis) {
                          if (sentimentVal.toLowerCase().includes('sad')) {
                            containerColorClasses = 'bg-blue-500/[0.015] border-blue-500/10 hover:border-blue-500/20';
                          } else if (sentimentVal.toLowerCase().includes('joyful')) {
                            containerColorClasses = 'bg-yellow-500/[0.015] border-yellow-500/10 hover:border-yellow-500/20';
                          } else if (sentimentVal.toLowerCase().includes('dramatic')) {
                            containerColorClasses = 'bg-red-500/[0.015] border-red-500/10 hover:border-red-500/20';
                          } else if (sentimentVal.toLowerCase().includes('romantic')) {
                            containerColorClasses = 'bg-pink-500/[0.015] border-pink-500/10 hover:border-pink-500/20';
                          } else if (sentimentVal.toLowerCase().includes('mournful')) {
                            containerColorClasses = 'bg-purple-500/[0.015] border-purple-500/10 hover:border-purple-500/20';
                          } else if (sentimentVal.toLowerCase().includes('hopeful')) {
                            containerColorClasses = 'bg-emerald-500/[0.015] border-emerald-500/10 hover:border-emerald-500/20';
                          }
                        } else {
                          containerColorClasses = 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10';
                        }
                        
                        return (
                          <div 
                            key={sectionKey}
                            className={`p-4 rounded-2xl border transition-all duration-300 relative ${containerColorClasses}`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 border-b border-white/[0.04] pb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-black tracking-widest ${
                                  sectionKey === 'chorus' 
                                    ? 'bg-rose-600/20 text-rose-400 border border-rose-500/20' 
                                    : sectionKey === 'climax' 
                                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                                      : 'bg-zinc-800 text-zinc-400 border border-white/5'
                                }`}>
                                  {displayName}
                                </span>

                                {/* Sentiment Color-Coded Pill Tag */}
                                <span className={`text-[9px] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-bold ${sBadge.class} shadow-sm`}>
                                  <span>{sBadge.emoji}</span>
                                  <span>{sBadge.label}</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
                                <button
                                  onClick={() => {
                                    if (editingLyricSection === sectionKey) {
                                      setEditingLyricSection(null);
                                      setLogs(prev => [`> 수동 가사 편집 완료: [${displayName}] 실시간 최적화 저장 완료`, ...prev]);
                                    } else {
                                      setEditingLyricSection(sectionKey);
                                    }
                                  }}
                                  className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold cursor-pointer ${
                                    editingLyricSection === sectionKey
                                      ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 hover:border-emerald-400'
                                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:bg-[#151518]'
                                  }`}
                                >
                                  <span>{editingLyricSection === sectionKey ? '💾 편집완료' : '✍️ 개별수정'}</span>
                                </button>

                                <button
                                  onClick={() => handleVocalSynthesis(sectionKey, text)}
                                  disabled={ttsLoading}
                                  className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold cursor-pointer ${
                                    isSpeakingThis 
                                      ? 'bg-indigo-600 text-white border-indigo-500' 
                                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/10'
                                  }`}
                                >
                                  {ttsLoading && isSpeakingThis ? (
                                    <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Volume2 className="w-3.5 h-3.5" />
                                  )}
                                  <span>가창 듣기</span>
                                </button>
                              </div>
                            </div>

                            {editingLyricSection === sectionKey ? (
                              <textarea
                                value={text}
                                onChange={(e) => {
                                  const newVal = e.target.value;
                                  setGeneratedTrack(prev => {
                                    if (!prev) return null;
                                    return {
                                      ...prev,
                                      lyrics: {
                                        ...prev.lyrics,
                                        [sectionKey]: newVal
                                      }
                                    };
                                  });
                                }}
                                className="w-full min-h-[90px] bg-black/60 border border-indigo-500/40 hover:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 mt-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed"
                              />
                            ) : (
                              <p className={`text-xs leading-relaxed whitespace-pre-wrap transition-all mt-2.5 ${
                                isSpeakingThis ? 'text-white font-medium scale-[1.005]' : 'text-zinc-300'
                              }`}>
                                {text}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: INTELLIGENT DEVICE CARE AND SCANNER */}
            {activeTab === 'device' && (
              <div className="flex flex-col gap-3 font-sans">
                
                {/* One UI Device Care Circle Section */}
                <div className="p-4 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-between text-center gap-3">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-500/10 border-t-blue-500 flex items-center justify-center relative animate-[spin_5s_linear_infinite]">
                    {/* Inner static percentage display */}
                    <div className="absolute inset-1.5 bg-gradient-to-tr from-[#0d0d12] to-[#121216] rounded-full flex flex-col items-center justify-center select-none rotate-[-360deg] duration-0">
                      <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider font-sans">구동 컨디션</span>
                      <span className="text-lg font-bold text-white tracking-tighter">98 <span className="text-[9px] text-blue-400 font-bold">%</span></span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300">매우 좋음 - 최적화 완료</h4>
                    <p className="text-[9px] text-zinc-500 leading-relaxed mt-0.5 px-2">
                      삼성 갤럭시 고성능 트로트 아코디언 음향 합성 시뮬레이터 가역 버스팅 및 캐시 정리가 완료되었습니다.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setLogs(prev => ['> 디바이스 최적화: One UI 엔진 메모리 가용량 확보 완료.', ...prev]);
                      playEmergencyVocalBeeps("S24");
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    지금 최적화
                  </button>
                </div>

                {/* Relocated Rolling Live Terminal scanner */}
                <div className="p-4 rounded-3xl bg-black/40 border border-white/5 flex flex-col gap-2.5 h-[220px] overflow-hidden">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>AI 스튜디오 오디오 신경망 스캐너 피드</span>
                  </div>
                  <div className="flex-1 overflow-y-auto font-mono text-[9px] leading-relaxed text-zinc-500 space-y-2.5 custom-scrollbar bg-black/30 p-2.5 rounded-2xl border border-white/[0.02]">
                    <div className="text-blue-400 animate-pulse font-bold">[글로벌 트렌드 음파 트랙 데이터 프레임 로딩...]</div>
                    {logs.map((log, index) => (
                      <p 
                        key={index} 
                        className={`border-b border-white/[0.01] pb-1 ${
                          index === 0 
                            ? 'text-zinc-200 font-semibold' 
                            : 'text-zinc-500'
                        }`}
                      >
                        {log}
                      </p>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: MY MASTERPIECE ALBUMS (앨범 레코드 명반 저장 목록) */}
            {activeTab === 'album' && (
              <div className="flex flex-col gap-4 font-sans">
                {albumTracks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 bg-zinc-900/40 rounded-3xl border border-white/5 my-auto gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 shadow-inner">
                      <Disc className="w-8 h-8 text-zinc-600 animate-[spin_10s_linear_infinite]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-300">나의 명반 앨범이 비어 있습니다</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 px-4">
                        아직 자동으로 저장된 트로트 걸작이 없습니다. <br />
                        <strong>오토메이트</strong> 탭에서 편곡을 완료하면 이곳에 자동으로 영구 보관됩니다!
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('home')}
                      className="px-4 py-2 bg-indigo-600/25 hover:bg-indigo-600/35 text-indigo-400 text-[10px] font-bold uppercase rounded-lg border border-indigo-500/10 transition-all cursor-pointer mt-2"
                    >
                      첫 번째 명곡 작곡하러 가기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Album Header summary card */}
                    <div className="p-4 bg-gradient-to-r from-blue-900/10 to-indigo-900/10 border border-indigo-500/10 rounded-3xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-xl text-indigo-400 border border-indigo-500/20 shadow-md">
                          💽
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-200">나의 인공지능 명반 컬렉션</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">총 {albumTracks.length}개의 정통 K-Trot 걸작이 영구 저장되었습니다.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("모든 앨범 트랙을 삭제하시겠습니까?")) {
                            setAlbumTracks([]);
                            localStorage.removeItem('k_trot_album_tracks');
                            setLogs(prev => ['> 앨범: 모든 저장된 트랙 레코드가 초기화되었습니다.', ...prev]);
                          }
                        }}
                        className="px-2.5 py-1 text-[9px] hover:bg-rose-500/10 text-rose-400 font-bold border border-rose-500/10 hover:border-rose-500/20 rounded-md transition-all cursor-pointer"
                      >
                        전체 초기화
                      </button>
                    </div>

                    {/* Tracks List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {albumTracks.map((track, idx) => {
                        const isLoaded = generatedTrack?.title === track.title;
                        return (
                          <div 
                            key={idx} 
                            className={`p-4 bg-zinc-900/40 border rounded-3xl hover:border-indigo-500/30 transition-all flex flex-col justify-between gap-4 ${
                              isLoaded ? 'border-indigo-500 ring-1 ring-indigo-500/30' : 'border-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-3">
                                {/* Vinyl artwork design */}
                                <div className="relative w-14 h-14 bg-zinc-950 rounded-full border border-white/10 flex items-center justify-center shadow-lg flex-shrink-0 animate-[spin_15s_linear_infinite]">
                                  {/* Vinyl Groove Lines */}
                                  <div className="absolute inset-2 border border-white/[0.04] rounded-full"></div>
                                  <div className="absolute inset-4 border border-white/[0.04] rounded-full"></div>
                                  {/* Center label */}
                                  <div className="w-5 h-5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border border-black shadow">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-zinc-100 line-clamp-1">{track.title}</h5>
                                  <p className="text-[10px] text-indigo-400 font-medium mt-0.5 font-mono">{track.tempoBpm} BPM / {track.vocalVibrato.split(' ')[0]}</p>
                                  <p className="text-[9px] text-zinc-500 italic mt-1 line-clamp-1">"{track.lyrics.verse1.split('\n')[0]}"</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded-full text-zinc-400 border border-white/[0.02]">
                                #{albumTracks.length - idx}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 border-t border-white/[0.03] pt-3">
                              <button
                                onClick={() => {
                                  setGeneratedTrack(track);
                                  setActiveTab('player');
                                  setLogs(prev => [`> 앨범 로더: '${track.title}' 음원을 연주 준비 상태로 마운트했습니다.`, ...prev]);
                                }}
                                className={`px-3 py-2 text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  isLoaded 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
                                }`}
                              >
                                <span>{isLoaded ? '▶ 마운트 완료' : '🎧 즉시 재생'}</span>
                              </button>

                              <button
                                onClick={() => downloadScoreAsText(track)}
                                className="px-3 py-2 text-[10px] border border-white/5 hover:border-white/10 bg-black/30 hover:bg-black/50 text-zinc-300 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>악보 다운로드</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Tutorial Help Panel */}
            {!generatedTrack && !isGenerating && (
              <div className="bg-[#121214] rounded-3xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                    <HelpCircle className="w-4 h-4 text-zinc-400" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                    마스터 사용 설명서
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <div className="text-xs font-bold text-white mb-1.5">1. 명품 보컬 프로필 지정</div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      좌측 보컬 라이브러리에서 남성 및 여성을 자유롭게 필터링하신 후, 원하시는 미성이나 아코디언 정서의 굵직한 음색 명품 보컬을 지정합니다.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <div className="text-xs font-bold text-white mb-1.5">2. 화성 진행 및 히트 설계</div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      성인 가요 최적화 '머니 코드' 화성을 고르고, 타켓 재생 지속 시간과 멜로디의 촘촘한 중독성 밀도, 그리고 심금을 울릴 테마 주제를 선택합니다.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <div className="text-xs font-bold text-white mb-1.5">3. 음원 합성 버튼 터치</div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      우측 상단의 합창 가동 버튼을 누르면 Gemini 초지능 신경망이 완벽한 꺾기 마디, 작사 구성, 사운드 디자인을 일괄 컴파일합니다!
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Right Panel: Global Lyrics Analytics Console (Hidden on Samsung Mobile layout - Transferred to One UI System/Care Tab) */}
        <aside id="lyrics-analytics-sidebar" className="hidden w-64 bg-[#0a0a0c] border-l border-white/5 p-5 flex-col flex-shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">글로벌 하이웨이 음악 스캐너</h2>
          </div>
          
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            
            {/* Live rolling ticker console log */}
            <div className="bg-[#0e0e11] rounded-2xl p-4 border border-white/5 flex-grow overflow-y-auto font-mono text-[10px] leading-relaxed text-zinc-500 space-y-2.5 custom-scrollbar bg-black/40">
              <div className="text-indigo-400 animate-pulse font-bold">[글로벌 트렌드 트랙 데이터 정밀 스캔 중...]</div>
              {logs.map((log, index) => (
                <p 
                  key={index} 
                  className={`border-b border-white/[0.01] pb-1.5 ${
                    index === 0 
                      ? 'text-zinc-200 font-semibold' 
                      : index === 1 
                        ? 'text-zinc-400' 
                        : 'text-zinc-500'
                  }`}
                >
                  {log}
                </p>
              ))}
            </div>

            {/* Cultural background info card */}
            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">전통가요 기획의 의도</span>
              </div>
              <p className="text-[10px] font-sans leading-relaxed text-zinc-400 italic">
                "심장을 파고드는 트로트의 애절한 가락과 힙한 전자 드럼의 혁명적 조화. 세대를 넘나드는 크로스오버 걸작이 탄생합니다."
              </p>
              <p className="text-[8px] text-indigo-400 mt-2 text-right uppercase tracking-wider font-mono">
                - K-마스터 지능형 큐레이션팀
              </p>
            </div>

          </div>

          {/* Right Panel CPU meter */}
          <div className="h-32 w-full mt-5 bg-[#121214]/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-black tracking-wider mb-1">
                <span>프로세서 연산량 및 음향 가열도</span>
                <span className="font-mono text-indigo-400">{cpuLoad}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                  style={{ width: `${cpuLoad}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl border border-white/[0.02]">
              <div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                오디오 코드 분석 실시간 보정 중...
              </span>
            </div>
          </div>
        </aside>

      </div>

      {/* Dynamic One UI 6 Bottom Navigation Tabs Bar */}
      <div id="samsung-oneui-tabbar" className="h-16 w-full bg-[#0a0c10]/95 border-t border-white/[0.03] flex items-center justify-around px-2 flex-shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.4)]">
        <button 
          onClick={() => {
            setActiveTab('home');
            playEmergencyVocalBeeps("HM");
          }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 cursor-pointer transition-all ${
            activeTab === 'home' ? 'text-blue-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px]">오토메이트</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('vocalist');
            playEmergencyVocalBeeps("VC");
          }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 cursor-pointer transition-all ${
            activeTab === 'vocalist' ? 'text-blue-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">명품보컬</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('player');
            playEmergencyVocalBeeps("PL");
          }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 cursor-pointer transition-all ${
            activeTab === 'player' ? 'text-blue-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Music className="w-4 h-4" />
          <span className="text-[10px]">재생믹서</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('album');
            playEmergencyVocalBeeps("AL");
          }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 cursor-pointer transition-all ${
            activeTab === 'album' ? 'text-indigo-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span className="text-[10px]">명반앨범</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('device');
            playEmergencyVocalBeeps("DV");
          }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 cursor-pointer transition-all ${
            activeTab === 'device' ? 'text-blue-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px]">디바이스케어</span>
        </button>
      </div>

      {/* Android System Classic Soft-keys + Gesture bar (Extremely Realistic!) */}
      <div id="android-navbar-bottom" className="h-[46px] w-full bg-black/90 flex flex-col items-center justify-between pb-1 pt-1.5 flex-shrink-0 z-20 border-t border-white/[0.01]">
        
        {/* Soft keys */}
        <div className="w-full flex items-center justify-around px-12 h-6">
          {/* Recents key */}
          <button 
            onClick={() => {
              setLogs(prev => ['> 갤럭시 핵심 멀티태스킹 탭: 백그라운드 태스크 이상 없음.', ...prev]);
              playEmergencyVocalBeeps("S24");
            }}
            title="최근 앱"
            className="w-3.5 h-3.5 border border-white/40 hover:border-white/80 rounded-2xs transition-colors cursor-pointer flex items-center justify-center"
          >
            <div className="w-1 bg-white/20 h-full rounded-2xs"></div>
          </button>
          
          {/* Home key */}
          <button 
            onClick={() => {
              setActiveTab('home');
              playEmergencyVocalBeeps("S24");
            }}
            title="홈 화면"
            className="w-4 h-4 border border-white/60 hover:border-white rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer p-0.5"
          >
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>
          </button>

          {/* Back key */}
          <button 
            onClick={() => {
              if (activeTab !== 'home') {
                setActiveTab('home');
                playEmergencyVocalBeeps("S24");
              } else if (generatedTrack) {
                stopSynth();
                stopTts();
                setGeneratedTrack(null);
                setLogs(prev => ['> 로드되어 있던 음원 데이터 세션이 안전하게 해제되었습니다.', ...prev]);
              } else {
                setLogs(prev => ['> 알림: 현재 인공지능 트로트 최신형 홈 화면입니다.', ...prev]);
              }
            }}
            title="되돌아가기"
            className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[8px] border-r-white/40 hover:border-r-white/70 rotate-180 transition-colors cursor-pointer"
          />
        </div>

        {/* Home gesture indicator line */}
        <div className="w-28 h-[3.5px] bg-white/35 rounded-full mt-1.5"></div>
      </div>

      {/* S24 Outer container close brace */}
      </div>

    </div>
  );
}
