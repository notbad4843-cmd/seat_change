import React, { useState } from 'react';
import { Student } from '../types';
import { DEFAULT_STUDENT_NAMES } from '../data/students';
import { X, Upload, RefreshCw, FileText, Check, Users } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onUpdateStudents: (updated: Student[]) => void;
  maxCapacity?: number;
}

export const StudentListModal: React.FC<StudentListModalProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStudents,
  maxCapacity = 30,
}) => {
  const [rawText, setRawText] = useState<string>(() =>
    students.map((s) => s.name).join('\n')
  );
  const [count, setCount] = useState<number>(students.length || 30);

  if (!isOpen) return null;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Split by lines or commas
        const names = content
          .split(/[\n,]/)
          .map((n) => n.trim())
          .filter((n) => n.length > 0)
          .slice(0, maxCapacity);

        setRawText(names.join('\n'));
        setCount(Math.min(names.length, maxCapacity));
        soundFx.playLegoClick();
      }
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const targetCount = Math.min(Math.max(1, count), maxCapacity);
    const colors = ['#E3000B', '#006CB7', '#FFD500', '#00852B', '#FF7E00', '#9B00E8', '#00A3DA'];

    const newStudents: Student[] = Array.from({ length: targetCount }, (_, i) => {
      const num = i + 1;
      const name = lines[i] || `학생${num}`;
      return {
        id: num,
        name,
        avatarColor: colors[i % colors.length],
      };
    });

    onUpdateStudents(newStudents);
    soundFx.playLegoClick();
    onClose();
  };

  const handleLoadSample = () => {
    const sample = DEFAULT_STUDENT_NAMES.slice(0, count);
    setRawText(sample.join('\n'));
    soundFx.playLegoClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      {/* Lego Card Container */}
      <div className="relative w-full max-w-xl bg-slate-900 border-4 border-yellow-500 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Lego Stud Decoration Bar */}
        <div className="bg-lego-yellow-studs h-5 w-full border-b-2 border-yellow-600 flex justify-around px-4">
          <div className="w-4 h-2 bg-yellow-400 rounded-t -mt-1 shadow-sm" />
          <div className="w-4 h-2 bg-yellow-400 rounded-t -mt-1 shadow-sm" />
          <div className="w-4 h-2 bg-yellow-400 rounded-t -mt-1 shadow-sm" />
          <div className="w-4 h-2 bg-yellow-400 rounded-t -mt-1 shadow-sm" />
        </div>

        {/* Modal Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-extrabold text-white">학생 명단 및 인원 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Student Count Range Stepper */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <label htmlFor="student-count-slider" className="text-slate-200">배정 인원 설정 (최대 30명)</label>
              <span className="text-yellow-400 text-base font-black px-2.5 py-0.5 bg-yellow-400/20 rounded-md border border-yellow-500/30">
                {count}명
              </span>
            </div>
            <input
              id="student-count-slider"
              type="range"
              min="1"
              max={maxCapacity}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>1명</span>
              <span>10명</span>
              <span>20명</span>
              <span className="text-yellow-400 font-bold">30명 (기본)</span>
            </div>
          </div>

          {/* Roster Input Method Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-lg font-semibold cursor-pointer text-xs transition">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>파일 업로드 (.txt, .csv)</span>
              <input
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleLoadSample}
              type="button"
              className="flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>30명 예시 명단 자동 채우기</span>
            </button>
          </div>

          {/* Roster Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="student-roster-textarea" className="block text-xs font-bold text-slate-300">
              학생 이름 입력 (줄바꿈으로 구분, 순서대로 #1~#{count} 번호 부여)
            </label>
            <textarea
              id="student-roster-textarea"
              rows={8}
              value={rawText}
              onChange={handleTextChange}
              placeholder="1번 이름&#10;2번 이름&#10;3번 이름..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none leading-relaxed"
            />
          </div>

          {/* Preview Format Note */}
          <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-start space-x-2 text-xs text-blue-200">
            <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">표시 형식 안내:</p>
              <p className="text-slate-300">
                자리표에는 <span className="text-yellow-300 font-bold">#번호 이름</span> (예: #1 강하준) 형식으로 깔끔하게 표시됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-5 py-2 rounded-xl text-xs font-extrabold transition shadow-lg lego-brick-shadow"
          >
            <Check className="w-4 h-4" />
            <span>명단 적용하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
