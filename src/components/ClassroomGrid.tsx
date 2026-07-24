import React, { useState } from 'react';
import { Seat, Student, LayoutType } from '../types';
import { LegoMinifigure } from './LegoMinifigure';
import { Lock, Unlock, ArrowLeftRight, Eye, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface ClassroomGridProps {
  seats: Seat[];
  studentsMap: Map<number, Student>;
  layout: LayoutType;
  manualSwapMode: boolean;
  selectedSeatIndex: number | null;
  onSelectSeatForSwap: (index: number) => void;
  onSwapSeats: (indexA: number, indexB: number) => void;
  onToggleLockSeat: (index: number) => void;
  highlightedSeatIndex: number | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ClassroomGrid: React.FC<ClassroomGridProps> = ({
  seats,
  studentsMap,
  layout,
  manualSwapMode,
  selectedSeatIndex,
  onSelectSeatForSwap,
  onSwapSeats,
  onToggleLockSeat,
  highlightedSeatIndex,
  containerRef,
}) => {
  const [draggedSeatIndex, setDraggedSeatIndex] = useState<number | null>(null);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSeatIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSeatIndex !== null && draggedSeatIndex !== targetIndex) {
      onSwapSeats(draggedSeatIndex, targetIndex);
      soundFx.playLegoClick();
    }
    setDraggedSeatIndex(null);
  };

  // Helper to render an individual seat card
  const renderSeatCard = (seat: Seat) => {
    const student = seat.studentId ? studentsMap.get(seat.studentId) : null;
    const isSelected = selectedSeatIndex === seat.seatIndex;
    const isHighlighted = highlightedSeatIndex === seat.seatIndex;

    // Requirement #8: #번호 형식으로 이름과 함께 보이게 해주세요
    const displayNumber = seat.studentId ? `#${seat.studentId}` : `#${seat.seatIndex + 1}`;
    const displayName = student ? student.name : '미배정';

    return (
      <div
        key={seat.seatIndex}
        draggable
        onDragStart={(e) => handleDragStart(e, seat.seatIndex)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, seat.seatIndex)}
        onClick={() => {
          if (manualSwapMode) {
            onSelectSeatForSwap(seat.seatIndex);
          }
        }}
        className={`relative group flex flex-col justify-between p-2 rounded-xl transition-all duration-300 cursor-pointer select-none lego-card-bevel ${
          isSelected
            ? 'ring-4 ring-yellow-400 bg-yellow-900/40 scale-105 z-20 shadow-yellow-500/50 shadow-2xl'
            : isHighlighted
            ? 'ring-4 ring-red-500 bg-red-900/60 scale-110 z-20 shadow-red-500/50 shadow-2xl animate-bounce'
            : 'bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-500'
        }`}
        style={{
          minHeight: '76px',
        }}
      >
        {/* Top 3D Lego Brick Stud Decorators */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex space-x-2 pointer-events-none">
          <div className="w-3.5 h-1.5 bg-yellow-500/80 rounded-t border-t border-yellow-300/80 shadow-sm" />
          <div className="w-3.5 h-1.5 bg-yellow-500/80 rounded-t border-t border-yellow-300/80 shadow-sm" />
          <div className="w-3.5 h-1.5 bg-yellow-500/80 rounded-t border-t border-yellow-300/80 shadow-sm" />
        </div>

        {/* Seat Card Top Row: Number Badge & Lock Button */}
        <div className="flex items-center justify-between w-full pt-1">
          {/* Requirement #8: #번호 */}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-yellow-400 text-slate-950 font-black text-[11px] sm:text-xs shadow-sm">
            {displayNumber}
          </span>

          <div className="flex items-center space-x-1">
            {seat.isLocked && (
              <span className="inline-flex items-center px-1 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/40">
                <Lock className="w-3 h-3 mr-0.5" /> 고정
              </span>
            )}

            {/* Lock / Unlock Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLockSeat(seat.seatIndex);
                soundFx.playLegoClick();
              }}
              className="p-1 text-slate-400 hover:text-yellow-300 transition rounded"
              title={seat.isLocked ? '자리 고정 해제' : '자리 고정 (무작위 섞기 제외)'}
            >
              {seat.isLocked ? (
                <Lock className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Unlock className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100" />
              )}
            </button>
          </div>
        </div>

        {/* Seat Card Middle: Minifigure Avatar & Student Name */}
        <div className="flex items-center space-x-2 my-1">
          <LegoMinifigure
            size={28}
            color={student?.avatarColor || '#FFD500'}
            expression={seat.isLocked ? 'wink' : 'happy'}
          />

          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-extrabold text-white truncate tracking-tight">
              {displayName}
            </p>
          </div>
        </div>

        {/* Manual Swap Selection Prompt Indicator */}
        {manualSwapMode && isSelected && (
          <div className="absolute inset-0 bg-yellow-500/20 rounded-xl border-2 border-yellow-400 flex items-center justify-center pointer-events-none">
            <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black shadow-md flex items-center gap-1">
              <ArrowLeftRight className="w-3 h-3" /> 교환 대상 선택
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden text-slate-100"
    >
      {/* Background Stud Pattern for Seating Chart */}
      <div className="absolute inset-0 bg-lego-studs opacity-20 pointer-events-none" />

      {/* Blackboard / Podium Header (칠판 / 교탁) */}
      <div className="relative z-10 mb-4 sm:mb-5 max-w-2xl mx-auto">
        <div className="relative bg-slate-800 border-4 border-amber-900 rounded-xl p-2.5 shadow-xl text-center flex items-center justify-center space-x-3 lego-brick-shadow">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center text-amber-400/80 text-[10px] font-bold">
            <Eye className="w-3.5 h-3.5 mr-1" /> 교탁 (선생님 시선)
          </div>

          <div className="bg-emerald-950/90 border-2 border-emerald-700/60 px-6 py-1 rounded-lg">
            <span className="text-emerald-300 font-black tracking-widest text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> [ 칠 판 ]
            </span>
          </div>
        </div>
      </div>

      {/* Classroom Layout Grid */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {layout === '5x6' ? (
          /* Layout 1: 5줄 6석 (5 Rows x 6 Seats) */
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {seats.slice(0, 30).map((seat) => renderSeatCard(seat))}
          </div>
        ) : (
          /* Layout 2: 2줄씩 3분단 (3 Groups, each group having 2 columns x 5 rows) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Group 1 (1분단: Seats 0~9, 2 columns x 5 rows) */}
            <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-center py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-black text-yellow-400 shadow-sm">
                1 분단
              </div>
              <div className="grid grid-cols-2 gap-2">
                {seats.slice(0, 10).map((seat) => renderSeatCard(seat))}
              </div>
            </div>

            {/* Group 2 (2분단: Seats 10~19, 2 columns x 5 rows) */}
            <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-center py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-black text-yellow-400 shadow-sm">
                2 분단
              </div>
              <div className="grid grid-cols-2 gap-2">
                {seats.slice(10, 20).map((seat) => renderSeatCard(seat))}
              </div>
            </div>

            {/* Group 3 (3분단: Seats 20~29, 2 columns x 5 rows) */}
            <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-center py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-black text-yellow-400 shadow-sm">
                3 분단
              </div>
              <div className="grid grid-cols-2 gap-2">
                {seats.slice(20, 30).map((seat) => renderSeatCard(seat))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-2">
        <span>💡 자리를 드래그하거나 [수동 자리바꾸기]로 위치를 교환할 수 있습니다.</span>
        <span className="hidden sm:inline">🔒 [자물쇠] 버튼을 누르면 특정 자리를 고정할 수 있습니다.</span>
      </div>
    </div>
  );
};
