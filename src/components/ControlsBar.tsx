import React from 'react';
import { LayoutType, ShuffleMode } from '../types';
import { Sparkles, Shuffle, ArrowLeftRight, Download, Users, RotateCcw, Play, FileCode } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface ControlsBarProps {
  layout: LayoutType;
  onChangeLayout: (newLayout: LayoutType) => void;
  shuffleMode: ShuffleMode;
  onChangeShuffleMode: (mode: ShuffleMode) => void;
  onShuffle: () => void;
  isShuffling: boolean;
  manualSwapMode: boolean;
  onToggleManualSwap: () => void;
  onOpenRosterModal: () => void;
  onDownloadImage: () => void;
  onDownloadHtml?: () => void;
  onResetSeats: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  layout,
  onChangeLayout,
  shuffleMode,
  onChangeShuffleMode,
  onShuffle,
  isShuffling,
  manualSwapMode,
  onToggleManualSwap,
  onOpenRosterModal,
  onDownloadImage,
  onDownloadHtml,
  onResetSeats,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-900 border-2 border-slate-700 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-slate-100 select-none">
      {/* Left Section: Layout & Shuffle Mode Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Layout Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-extrabold">
          <button
            onClick={() => {
              onChangeLayout('5x6');
              soundFx.playLegoClick();
            }}
            className={`px-3 py-1.5 rounded-lg transition ${
              layout === '5x6'
                ? 'bg-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5열 6석 (1줄)
          </button>
          <button
            onClick={() => {
              onChangeLayout('3groups');
              soundFx.playLegoClick();
            }}
            className={`px-3 py-1.5 rounded-lg transition ${
              layout === '3groups'
                ? 'bg-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3분단 (2줄씩)
          </button>
        </div>

        {/* Shuffle Mode Toggle */}
        <div className="hidden sm:flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              onChangeShuffleMode('instant');
              soundFx.playLegoClick();
            }}
            className={`px-2.5 py-1.5 rounded-lg transition ${
              shuffleMode === 'instant'
                ? 'bg-blue-600 text-white font-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            즉시 섞기
          </button>
          <button
            onClick={() => {
              onChangeShuffleMode('dramatic');
              soundFx.playLegoClick();
            }}
            className={`px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1 ${
              shuffleMode === 'dramatic'
                ? 'bg-red-600 text-white font-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>두근두근 순차 공개</span>
          </button>
        </div>
      </div>

      {/* Center Section: Main Action Button (두근두근 자리 섞기) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onShuffle}
          disabled={isShuffling}
          className={`relative group flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all transform active:scale-95 shadow-xl lego-brick-shadow overflow-hidden ${
            isShuffling
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-500 text-white hover:shadow-red-500/40 hover:-translate-y-0.5'
          }`}
        >
          {/* Top Studs Decorator on Button */}
          <div className="absolute -top-1 left-4 w-3 h-1.5 bg-red-400 rounded-t" />
          <div className="absolute -top-1 right-4 w-3 h-1.5 bg-red-400 rounded-t" />

          {isShuffling ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>두근두근 섞는 중...</span>
            </div>
          ) : (
            <>
              <Shuffle className="w-4 h-4 text-yellow-300 group-hover:rotate-180 transition-transform duration-500" />
              <span className="tracking-wide">두근두근 자리 섞기</span>
              <Play className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            </>
          )}
        </button>

        {/* Manual Swap Toggle Button */}
        <button
          onClick={() => {
            onToggleManualSwap();
            soundFx.playLegoClick();
          }}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition shadow-md ${
            manualSwapMode
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-black animate-pulse'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
          }`}
          title="수동 교환 모드 (클릭하여 2개 자리 교환)"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span className="hidden md:inline">수동 자리 바꾸기</span>
          <span className="md:hidden">수동</span>
        </button>
      </div>

      {/* Right Section: Roster & Download PNG & Download HTML */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            onOpenRosterModal();
            soundFx.playLegoClick();
          }}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition shadow-md"
        >
          <Users className="w-4 h-4 text-yellow-400" />
          <span>명단 설정</span>
        </button>

        <button
          onClick={() => {
            onResetSeats();
            soundFx.playLegoClick();
          }}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs transition shadow-md"
          title="번호 순서대로 초기화 (#1, #2...)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onDownloadImage}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-2 rounded-xl text-xs transition shadow-md lego-brick-shadow"
          title="결정된 자리표를 이미지(PNG)로 다운로드"
        >
          <Download className="w-4 h-4" />
          <span>이미지 저장</span>
        </button>

        {onDownloadHtml && (
          <button
            onClick={onDownloadHtml}
            className="flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-3 py-2 rounded-xl text-xs transition shadow-md lego-brick-shadow"
            title="단일 HTML 파일(index.html)로 저장 및 게시"
          >
            <FileCode className="w-4 h-4" />
            <span>index.html 저장</span>
          </button>
        )}
      </div>
    </div>
  );
};
