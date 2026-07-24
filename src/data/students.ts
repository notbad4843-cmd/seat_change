import { Student } from '../types';

export const DEFAULT_STUDENT_NAMES = [
  '강하준', '김민준', '김서윤', '김도윤', '김지우',
  '박서준', '박하은', '박도현', '성지민', '손유찬',
  '신아인', '윤서진', '이서연', '이준서', '이지호',
  '이하율', '임지안', '장예준', '전수아', '정하윤',
  '정우주', '조은우', '최민서', '최시아', '한주원',
  '한은서', '황건우', '황지유', '송태양', '백다은'
];

export function createInitialStudents(count: number = 30): Student[] {
  const colors = [
    '#E3000B', // Lego Red
    '#006CB7', // Lego Blue
    '#FFD500', // Lego Yellow
    '#00852B', // Lego Green
    '#FF7E00', // Lego Orange
    '#9B00E8', // Lego Purple
    '#00A3DA', // Lego Cyan
    '#68C322', // Lego Lime
  ];

  return Array.from({ length: count }, (_, idx) => {
    const num = idx + 1;
    const name = DEFAULT_STUDENT_NAMES[idx] || `학생${num}`;
    return {
      id: num,
      name: name,
      avatarColor: colors[idx % colors.length],
    };
  });
}
