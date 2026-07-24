export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>두근두근 자리바꾸기 - 레고 시네마틱</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- React 18 & ReactDOM -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <!-- Babel for JSX -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <!-- html2canvas -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <style>
    /* Custom Lego CSS Studs & Bevels */
    .bg-lego-studs {
      background-color: #1e242d;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 20%, rgba(0, 0, 0, 0.35) 45%, transparent 60%),
        radial-gradient(circle at 50% 50%, #2a323d 35%, #181d24 65%);
      background-size: 24px 24px;
    }
    .bg-lego-yellow-studs {
      background-color: #f7c325;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 18%, rgba(180, 130, 0, 0.5) 45%, transparent 60%),
        radial-gradient(circle at 50% 50%, #fbd54e 35%, #d9a010 65%);
      background-size: 24px 24px;
    }
    .lego-brick-shadow {
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -2px 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .lego-card-bevel {
      box-shadow: inset 0 1.5px 0.5px rgba(255, 255, 255, 0.45), inset 0 -2px 1px rgba(0, 0, 0, 0.4), 0 6px 16px -2px rgba(0, 0, 0, 0.5);
    }
    .lego-title-glow {
      text-shadow: 0 0 10px rgba(255, 213, 0, 0.6), 3px 3px 0px #d11215, -2px -2px 0px #000;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased select-none font-sans">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useRef, useMemo, useEffect } = React;

    const DEFAULT_STUDENT_NAMES = [
      '강하준', '김민준', '김서윤', '김도윤', '김지우',
      '박서준', '박하은', '박도현', '성지민', '손유찬',
      '신아인', '윤서진', '이서연', '이준서', '이지호',
      '이하율', '임지안', '장예준', '전수아', '정하윤',
      '정우주', '조은우', '최민서', '최시아', '한주원',
      '한은서', '황건우', '황지유', '송태양', '백다은'
    ];

    class SoundFX {
      constructor() {
        this.ctx = null;
        this.enabled = true;
      }
      init() {
        if (!this.ctx && typeof window !== 'undefined') {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      playLegoClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.05);
        } catch(e) {}
      }
      playTick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1200 + Math.random() * 200, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.02);
          gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.025);
        } catch(e) {}
      }
      playFanfare() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.28);
          });
        } catch(e) {}
      }
    }
    const soundFx = new SoundFX();

    function LegoMinifigure({ color = '#FFD500', size = 32, expression = 'happy' }) {
      return (
        <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            <rect x="38" y="10" width="24" height="12" rx="3" fill="#D9A010" />
            <rect x="22" y="20" width="56" height="50" rx="14" fill={color} />
            <path d="M26 28 C32 24, 42 22, 50 22 C42 25, 30 28, 26 34 Z" fill="#FFFFFF" opacity="0.4" />
            <rect x="36" y="68" width="28" height="8" fill="#D9A010" />
            <path d="M18 76 L82 76 L88 100 L12 100 Z" fill="#D01012" />
            <circle cx="38" cy="42" r="5" fill="#111111" />
            <circle cx="62" cy="42" r="5" fill="#111111" />
            <circle cx="40" cy="40" r="1.8" fill="#FFFFFF" />
            <circle cx="64" cy="40" r="1.8" fill="#FFFFFF" />
            <path d="M36 52 Q50 62 64 52" stroke="#111111" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
    }

    function App() {
      const colors = ['#E3000B', '#006CB7', '#FFD500', '#00852B', '#FF7E00', '#9B00E8', '#00A3DA', '#68C322'];
      const [students, setStudents] = useState(() => 
        Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          name: DEFAULT_STUDENT_NAMES[i] || \`학생\${i + 1}\`,
          avatarColor: colors[i % colors.length]
        }))
      );
      const [layout, setLayout] = useState('5x6');
      const [shuffleMode, setShuffleMode] = useState('dramatic');
      const [isShuffling, setIsShuffling] = useState(false);
      const [manualSwapMode, setManualSwapMode] = useState(false);
      const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);
      const [highlightedSeatIndex, setHighlightedSeatIndex] = useState(null);
      const [soundEnabled, setSoundEnabled] = useState(true);
      const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
      const [rosterText, setRosterText] = useState(() => DEFAULT_STUDENT_NAMES.join('\\n'));
      const [studentCountInput, setStudentCountInput] = useState(30);

      const [seats, setSeats] = useState(() =>
        Array.from({ length: 30 }, (_, i) => ({
          seatIndex: i,
          studentId: i + 1,
          isLocked: false,
        }))
      );

      const gridRef = useRef(null);
      const studentsMap = useMemo(() => {
        const m = new Map();
        students.forEach(s => m.set(s.id, s));
        return m;
      }, [students]);

      useEffect(() => { soundFx.enabled = soundEnabled; }, [soundEnabled]);

      const handleShuffle = async () => {
        if (isShuffling) return;
        setIsShuffling(true);
        setSelectedSeatIndex(null);

        const unlockedSeats = seats.filter(s => !s.isLocked && s.seatIndex < students.length);
        const unlockedIds = unlockedSeats.map(s => s.studentId).filter(id => id !== null);

        if (unlockedIds.length <= 1) {
          setIsShuffling(false);
          return;
        }

        if (shuffleMode === 'instant') {
          const shuffled = [...unlockedIds];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          let idx = 0;
          setSeats(prev => prev.map(s => (!s.isLocked && s.seatIndex < students.length ? { ...s, studentId: shuffled[idx++] } : s)));
          setIsShuffling(false);
          soundFx.playFanfare();
          if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } else {
          for (let step = 0; step < 20; step++) {
            const randSeat = unlockedSeats[Math.floor(Math.random() * unlockedSeats.length)].seatIndex;
            setHighlightedSeatIndex(randSeat);
            soundFx.playTick();

            const tempShuffled = [...unlockedIds];
            for (let i = tempShuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [tempShuffled[i], tempShuffled[j]] = [tempShuffled[j], tempShuffled[i]];
            }
            let idx = 0;
            setSeats(prev => prev.map(s => (!s.isLocked && s.seatIndex < students.length ? { ...s, studentId: tempShuffled[idx++] } : s)));
            await new Promise(r => setTimeout(r, 90));
          }

          const finalShuffled = [...unlockedIds];
          for (let i = finalShuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalShuffled[i], finalShuffled[j]] = [finalShuffled[j], finalShuffled[i]];
          }
          let idx = 0;
          setSeats(prev => prev.map(s => (!s.isLocked && s.seatIndex < students.length ? { ...s, studentId: finalShuffled[idx++] } : s)));
          setHighlightedSeatIndex(null);
          setIsShuffling(false);
          soundFx.playFanfare();
          if (window.confetti) confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
        }
      };

      const handleSeatClick = (index) => {
        if (!manualSwapMode) return;
        if (selectedSeatIndex === null) {
          setSelectedSeatIndex(index);
          soundFx.playLegoClick();
        } else if (selectedSeatIndex === index) {
          setSelectedSeatIndex(null);
          soundFx.playLegoClick();
        } else {
          setSeats(prev => {
            const copy = [...prev];
            const temp = copy[selectedSeatIndex].studentId;
            copy[selectedSeatIndex] = { ...copy[selectedSeatIndex], studentId: copy[index].studentId };
            copy[index] = { ...copy[index], studentId: temp };
            return copy;
          });
          setSelectedSeatIndex(null);
          soundFx.playLegoClick();
        }
      };

      const toggleLock = (index) => {
        setSeats(prev => prev.map(s => s.seatIndex === index ? { ...s, isLocked: !s.isLocked } : s));
        soundFx.playLegoClick();
      };

      const downloadImage = async () => {
        if (!gridRef.current || !window.html2canvas) return;
        const canvas = await html2canvas(gridRef.current, { scale: 2, backgroundColor: '#0f172a' });
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = \`두근두근_자리표_\${new Date().toISOString().slice(0, 10)}.png\`;
        a.click();
        soundFx.playLegoClick();
      };

      const applyRoster = () => {
        const lines = rosterText.split('\\n').map(l => l.trim()).filter(Boolean);
        const count = Math.min(Math.max(1, studentCountInput), 30);
        const newStudents = Array.from({ length: count }, (_, i) => ({
          id: i + 1,
          name: lines[i] || \`학생\${i + 1}\`,
          avatarColor: colors[i % colors.length]
        }));
        setStudents(newStudents);
        setSeats(prev => prev.map(s => ({
          ...s,
          studentId: s.seatIndex < count ? s.seatIndex + 1 : null
        })));
        setIsRosterModalOpen(false);
        soundFx.playLegoClick();
      };

      const renderSeat = (seat) => {
        const student = seat.studentId ? studentsMap.get(seat.studentId) : null;
        const isSelected = selectedSeatIndex === seat.seatIndex;
        const isHighlighted = highlightedSeatIndex === seat.seatIndex;
        const numLabel = seat.studentId ? \`#\${seat.studentId}\` : \`#\${seat.seatIndex + 1}\`;

        return (
          <div
            key={seat.seatIndex}
            onClick={() => handleSeatClick(seat.seatIndex)}
            className={\`relative flex flex-col justify-between p-2 rounded-xl border cursor-pointer select-none lego-card-bevel transition-all duration-200 \${
              isSelected
                ? 'ring-4 ring-yellow-400 bg-yellow-900/50 scale-105 z-10'
                : isHighlighted
                ? 'ring-4 ring-red-500 bg-red-900/60 scale-110 z-10 animate-bounce'
                : 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700'
            }\`}
            style={{ minHeight: '76px' }}
          >
            <div className="flex items-center justify-between w-full">
              <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-slate-950 font-black text-xs">
                {numLabel}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleLock(seat.seatIndex); }}
                className="text-xs px-1.5 py-0.5 rounded text-slate-400 hover:text-white"
              >
                {seat.isLocked ? '🔒' : '🔓'}
              </button>
            </div>
            <div className="flex items-center space-x-2 my-1">
              <LegoMinifigure size={28} color={student?.avatarColor || '#FFD500'} />
              <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                {student ? student.name : '미배정'}
              </p>
            </div>
          </div>
        );
      };

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          {/* Header */}
          <header className="bg-slate-900 border-b-4 border-yellow-500 p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-xl lego-brick-shadow">
                <LegoMinifigure size={36} color="#FFD500" />
              </div>
              <div>
                <span className="text-[10px] font-black bg-yellow-400 text-slate-950 px-2 py-0.5 rounded uppercase">LEGO CINEMATIC</span>
                <h1 className="text-2xl sm:text-3xl font-black text-white lego-title-glow">두근두근 자리바꾸기</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsRosterModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                👥 학생 수: {students.length}명
              </button>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="bg-slate-800 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                {soundEnabled ? '🔊 사운드 ON' : '🔇 사운드 OFF'}
              </button>
            </div>
          </header>

          {/* Controls */}
          <div className="p-3 max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-2 bg-slate-900 border-2 border-slate-800 rounded-2xl my-2">
            <div className="flex bg-slate-950 p-1 rounded-xl text-xs font-bold">
              <button onClick={() => setLayout('5x6')} className={\`px-3 py-1.5 rounded-lg \${layout === '5x6' ? 'bg-yellow-500 text-slate-950 font-black' : 'text-slate-400'}\`}>5열 6석 (1줄)</button>
              <button onClick={() => setLayout('3groups')} className={\`px-3 py-1.5 rounded-lg \${layout === '3groups' ? 'bg-yellow-500 text-slate-950 font-black' : 'text-slate-400'}\`}>3분단 (2줄씩)</button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                disabled={isShuffling}
                className="bg-red-600 hover:bg-red-500 text-white font-black px-5 py-2.5 rounded-xl text-sm lego-brick-shadow shadow-lg flex items-center gap-1.5"
              >
                <span>🎲 두근두근 자리 섞기</span>
              </button>
              <button
                onClick={() => setManualSwapMode(!manualSwapMode)}
                className={\`px-3 py-2 rounded-xl text-xs font-bold border \${manualSwapMode ? 'bg-yellow-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-200 border-slate-700'}\`}
              >
                🔄 수동 교환 {manualSwapMode ? '(ON)' : ''}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={downloadImage} className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs lego-brick-shadow">
                📷 이미지 저장
              </button>
            </div>
          </div>

          {/* Classroom Board & Seating Grid */}
          <main className="flex-1 p-2 sm:p-4 max-w-7xl w-full mx-auto">
            <div ref={gridRef} className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 sm:p-6 relative shadow-2xl">
              <div className="mb-4 max-w-md mx-auto text-center bg-emerald-950 border-2 border-emerald-700 py-1.5 rounded-lg text-emerald-300 font-black text-sm">
                [ 칠 판 ] (교탁 방향)
              </div>

              {layout === '5x6' ? (
                <div className="grid grid-cols-6 gap-2.5">
                  {seats.slice(0, 30).map(s => renderSeat(s))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-center py-1 bg-slate-800 rounded text-xs font-black text-yellow-400">1 분단</div>
                    <div className="grid grid-cols-2 gap-2">{seats.slice(0, 10).map(s => renderSeat(s))}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-center py-1 bg-slate-800 rounded text-xs font-black text-yellow-400">2 분단</div>
                    <div className="grid grid-cols-2 gap-2">{seats.slice(10, 20).map(s => renderSeat(s))}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-center py-1 bg-slate-800 rounded text-xs font-black text-yellow-400">3 분단</div>
                    <div className="grid grid-cols-2 gap-2">{seats.slice(20, 30).map(s => renderSeat(s))}</div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Roster Modal */}
          {isRosterModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border-4 border-yellow-500 rounded-2xl max-w-md w-full p-5 space-y-4">
                <h2 className="text-lg font-black text-yellow-400">학생 명단 및 인원 설정</h2>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">인원 수 ({studentCountInput}명)</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={studentCountInput}
                    onChange={(e) => setStudentCountInput(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">학생 이름 (줄바꿈 구분)</label>
                  <textarea
                    rows={8}
                    value={rosterText}
                    onChange={(e) => setRosterText(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsRosterModalOpen(false)} className="px-3 py-1.5 text-xs font-bold text-slate-400">취소</button>
                  <button onClick={applyRoster} className="px-4 py-1.5 bg-yellow-500 text-slate-950 font-black rounded-lg text-xs">적용</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;
}
