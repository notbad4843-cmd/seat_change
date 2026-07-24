export type LayoutType = '5x6' | '3groups'; // '5x6' = 5줄 6석, '3groups' = 2줄씩 3분단

export interface Student {
  id: number; // 1~30 (번호)
  name: string; // 이름 (e.g. "홍길동")
  gender?: 'M' | 'F' | 'none';
  note?: string;
  avatarColor?: string;
}

export interface Seat {
  seatIndex: number; // 0~29 (30좌석)
  studentId: number | null; // 배정된 학생 번호 (1~30) 또는 null
  isLocked?: boolean; // 수동 고정 여부
}

export type ShuffleMode = 'instant' | 'dramatic'; // 즉시 바꾸기 | 두근두근 순차 공개
