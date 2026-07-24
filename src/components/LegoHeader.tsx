import React from 'react';
import { LegoMinifigure } from './LegoMinifigure';
import { Volume2, VolumeX, Sparkles, Film, Grid, ListOrdered } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface LegoHeaderProps {
  studentCount: number;
  layout: '5x6' | '3groups';
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRosterModal: () => void;
}

export const LegoHeader: React.FC<LegoHeaderProps> = ({
  studentCount,
  layout,
  soundEnabled,
  onToggleSound,
  onOpenRosterModal,
}) => {
  return (
    <header className="relative w-full overflow-hidden bg-slate-900 border-b-4 border-yellow-500 shadow-2xl select-none">
      {/* Background Lego Brick Stud Texture Layer */}
      <div className="absolute inset-0 bg-lego-studs opacity-40 pointer-events-none" />

      {/* Dramatic Cinematic Lighting Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -top-12 left-1/4 w-64 h-64 bg-red-600/20 blur-2xl rounded-full pointer-events-none" />
      <div className="absolute -top-12 right-1/4 w-64 h-64 bg-blue-600/20 blur-2xl rounded-full pointer-events-none" />

      {/* Glossy Plastic Bevel Frame & Header Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Cinematic Title Banner */}
        <div className="flex items-center space-x-3">
          {/* Lego Red Brick Badge Icon */}
          <div className="relative group flex items-center justify-center p-2 bg-red-600 border-2 border-red-400 rounded-xl shadow-lg lego-brick-shadow transform transition hover:scale-105">
            {/* 3D Top Studs on Icon */}
            <div className="absolute -top-2 left-3 w-3 h-2 bg-red-500 rounded-t border-t border-red-300" />
            <div className="absolute -top-2 right-3 w-3 h-2 bg-red-500 rounded-t border-t border-red-300" />
            <LegoMinifigure size={38} expression="excited" color="#FFD500" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-yellow-400 text-slate-950 uppercase shadow-sm">
                <Film className="w-3 h-3 mr-1" /> LEGO CINEMATIC
              </span>
              <span className="text-xs text-yellow-300 font-semibold tracking-wide hidden sm:inline-block">
                스톱모션 클래스 시네마
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white lego-title-glow flex items-center gap-1.5">
              두근두근 자리바꾸기
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </h1>
          </div>
        </div>

        {/* Center/Right Status Badges & Quick Stats */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Student Count Badge */}
          <button
            onClick={onOpenRosterModal}
            className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-md group"
            title="학생 명단 편집 / 인원 설정"
          >
            <ListOrdered className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span>학생 수:</span>
            <span className="text-yellow-400 font-black text-sm">{studentCount}명</span>
          </button>

          {/* Current Layout Badge */}
          <div className="hidden md:flex items-center space-x-1.5 bg-slate-800/90 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md">
            <Grid className="w-4 h-4 text-blue-400" />
            <span>배치:</span>
            <span className="text-blue-300 font-bold">
              {layout === '5x6' ? '5열 6석 (1줄)' : '3분단 (2줄씩)'}
            </span>
          </div>

          {/* Sound Effect Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
              soundFx.playLegoClick();
            }}
            className={`p-2 rounded-lg border text-xs font-bold flex items-center space-x-1 transition shadow-md ${
              soundEnabled
                ? 'bg-yellow-500 text-slate-950 border-yellow-300 hover:bg-yellow-400'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? '사운드 ON' : '사운드 OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
