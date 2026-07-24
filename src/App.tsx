import { useState, useRef, useMemo, useEffect } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Seat, Student, LayoutType, ShuffleMode } from './types';
import { createInitialStudents } from './data/students';
import { soundFx } from './utils/sound';
import { generateStandaloneHtml } from './utils/exportHtml';
import { LegoHeader } from './components/LegoHeader';
import { ClassroomGrid } from './components/ClassroomGrid';
import { ControlsBar } from './components/ControlsBar';
import { StudentListModal } from './components/StudentListModal';

export default function App() {
  // App States
  const [students, setStudents] = useState<Student[]>(() => createInitialStudents(30));
  const [layout, setLayout] = useState<LayoutType>('5x6');
  const [shuffleMode, setShuffleMode] = useState<ShuffleMode>('dramatic');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [highlightedSeatIndex, setHighlightedSeatIndex] = useState<number | null>(null);

  const [manualSwapMode, setManualSwapMode] = useState<boolean>(false);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState<number | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState<boolean>(false);

  // Initialize 30 seats with pre-assigned student IDs 1~30
  const [seats, setSeats] = useState<Seat[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      seatIndex: i,
      studentId: i + 1,
      isLocked: false,
    }))
  );

  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Map student ID -> Student object for quick O(1) lookup
  const studentsMap = useMemo(() => {
    const map = new Map<number, Student>();
    students.forEach((s) => map.set(s.id, s));
    return map;
  }, [students]);

  // Keep soundFx in sync with state
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // When student roster count changes (e.g., from 30 to 24), synchronize seats
  const handleUpdateStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);

    // Reassign seats up to new student count
    const updatedCount = updatedStudents.length;
    setSeats((prevSeats) => {
      return prevSeats.map((seat) => {
        if (seat.seatIndex < updatedCount) {
          return {
            ...seat,
            studentId: seat.seatIndex + 1,
          };
        }
        return {
          ...seat,
          studentId: null,
        };
      });
    });
  };

  // Reset seats to default numerical order (#1, #2, #3...)
  const handleResetSeats = () => {
    setSeats((prev) =>
      prev.map((seat) => ({
        ...seat,
        studentId: seat.seatIndex < students.length ? seat.seatIndex + 1 : null,
      }))
    );
    setSelectedSeatIndex(null);
    soundFx.playLegoClick();
  };

  // Toggle lock state of individual seat
  const handleToggleLockSeat = (index: number) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.seatIndex === index ? { ...seat, isLocked: !seat.isLocked } : seat
      )
    );
  };

  // Manual Swap logic
  const handleSelectSeatForSwap = (index: number) => {
    if (selectedSeatIndex === null) {
      setSelectedSeatIndex(index);
      soundFx.playLegoClick();
    } else if (selectedSeatIndex === index) {
      setSelectedSeatIndex(null);
      soundFx.playLegoClick();
    } else {
      // Perform swap between selectedSeatIndex & index
      handleSwapSeats(selectedSeatIndex, index);
      setSelectedSeatIndex(null);
      soundFx.playLegoClick();
    }
  };

  const handleSwapSeats = (indexA: number, indexB: number) => {
    setSeats((prev) => {
      const copy = [...prev];
      const tempId = copy[indexA].studentId;
      copy[indexA] = { ...copy[indexA], studentId: copy[indexB].studentId };
      copy[indexB] = { ...copy[indexB], studentId: tempId };
      return copy;
    });
  };

  // Random Shuffle Logic
  const handleShuffle = async () => {
    if (isShuffling) return;

    setIsShuffling(true);
    setSelectedSeatIndex(null);

    // Filter unlocked seats and student IDs that can be shuffled
    const currentSeats = [...seats];
    const unlockedSeats = currentSeats.filter((s) => !s.isLocked && s.seatIndex < students.length);
    const unlockedStudentIds = unlockedSeats
      .map((s) => s.studentId)
      .filter((id): id is number => id !== null);

    if (unlockedStudentIds.length <= 1) {
      setIsShuffling(false);
      return;
    }

    if (shuffleMode === 'instant') {
      // Instant Fisher-Yates shuffle
      const shuffledIds = [...unlockedStudentIds];
      for (let i = shuffledIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
      }

      let shuffleIdx = 0;
      const nextSeats = currentSeats.map((seat) => {
        if (!seat.isLocked && seat.seatIndex < students.length) {
          const newId = shuffledIds[shuffleIdx++];
          return { ...seat, studentId: newId };
        }
        return seat;
      });

      setSeats(nextSeats);
      setIsShuffling(false);
      soundFx.playFanfare();

      // Trigger victory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E3000B', '#FFD500', '#006CB7', '#00852B'],
      });
    } else {
      // Dramatic stop-motion / Slot reveal shuffle animation!
      const totalSteps = 22;
      const stepDuration = 90; // ms

      for (let step = 0; step < totalSteps; step++) {
        // Pick a random unlocked seat to highlight & ticker shuffle
        const randomSeatIndex =
          unlockedSeats[Math.floor(Math.random() * unlockedSeats.length)].seatIndex;
        setHighlightedSeatIndex(randomSeatIndex);
        soundFx.playTick();

        // Intermediate temporary swap for visual slot machine effect
        const randomStudentIds = [...unlockedStudentIds];
        for (let i = randomStudentIds.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomStudentIds[i], randomStudentIds[j]] = [
            randomStudentIds[j],
            randomStudentIds[i],
          ];
        }

        let sIdx = 0;
        setSeats((prev) =>
          prev.map((seat) => {
            if (!seat.isLocked && seat.seatIndex < students.length) {
              return { ...seat, studentId: randomStudentIds[sIdx++] };
            }
            return seat;
          })
        );

        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }

      // Final shuffle assignment
      const finalShuffledIds = [...unlockedStudentIds];
      for (let i = finalShuffledIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalShuffledIds[i], finalShuffledIds[j]] = [
          finalShuffledIds[j],
          finalShuffledIds[i],
        ];
      }

      let fIdx = 0;
      setSeats((prev) =>
        prev.map((seat) => {
          if (!seat.isLocked && seat.seatIndex < students.length) {
            return { ...seat, studentId: finalShuffledIds[fIdx++] };
          }
          return seat;
        })
      );

      setHighlightedSeatIndex(null);
      setIsShuffling(false);
      soundFx.playFanfare();

      // Dramatic Confetti Burst!
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#E3000B', '#FFD500', '#006CB7', '#00852B'],
      });
    }
  };

  // Download Seating Chart as PNG Image
  const handleDownloadImage = async () => {
    if (!gridContainerRef.current) return;

    try {
      const canvas = await html2canvas(gridContainerRef.current, {
        scale: 2, // High resolution PNG
        useCORS: true,
        backgroundColor: '#0f172a',
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `두근두근_자리표_${new Date().toISOString().slice(0, 10)}.png`;
      link.click();

      soundFx.playLegoClick();
    } catch (err) {
      console.error('Failed to download seating chart image:', err);
    }
  };

  // Download Single Standalone index.html File
  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    link.click();
    URL.revokeObjectURL(url);
    soundFx.playLegoClick();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Lego Cinematic Header */}
      <LegoHeader
        studentCount={students.length}
        layout={layout}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenRosterModal={() => setIsRosterModalOpen(true)}
      />

      {/* Main Single-Screen Content Area */}
      <main className="flex-1 p-2 sm:p-4 max-w-7xl w-full mx-auto flex flex-col space-y-3 justify-between">
        {/* Controls Toolbar */}
        <ControlsBar
          layout={layout}
          onChangeLayout={setLayout}
          shuffleMode={shuffleMode}
          onChangeShuffleMode={setShuffleMode}
          onShuffle={handleShuffle}
          isShuffling={isShuffling}
          manualSwapMode={manualSwapMode}
          onToggleManualSwap={() => setManualSwapMode((prev) => !prev)}
          onOpenRosterModal={() => setIsRosterModalOpen(true)}
          onDownloadImage={handleDownloadImage}
          onDownloadHtml={handleDownloadHtml}
          onResetSeats={handleResetSeats}
        />

        {/* Classroom Seating Grid Chart */}
        <div className="flex-1 flex items-center justify-center py-1">
          <ClassroomGrid
            seats={seats}
            studentsMap={studentsMap}
            layout={layout}
            manualSwapMode={manualSwapMode}
            selectedSeatIndex={selectedSeatIndex}
            onSelectSeatForSwap={handleSelectSeatForSwap}
            onSwapSeats={handleSwapSeats}
            onToggleLockSeat={handleToggleLockSeat}
            highlightedSeatIndex={highlightedSeatIndex}
            containerRef={gridContainerRef}
          />
        </div>
      </main>

      {/* Student List & Roster Management Modal */}
      <StudentListModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        students={students}
        onUpdateStudents={handleUpdateStudents}
        maxCapacity={30}
      />
    </div>
  );
}
