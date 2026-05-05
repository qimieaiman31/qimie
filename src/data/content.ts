export interface Flashcard {
  id: string;
  word: string;
  type: 'Am' | 'Khas';
  meaning: string;
  example: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'matching' | 'fill' | 'category';
  question: string;
  options?: string[];
  answer: any;
  explanation: string;
  audioUrl?: string;
}

export const FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    word: 'Guru',
    type: 'Am',
    meaning: 'Orang yang mengajar di sekolah.',
    example: 'Guru itu sedang mengajar di kelas.',
    imageUrl: 'https://images.unsplash.com/photo-1544717297-fa154da09f9b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    word: 'Cikgu Ahmad',
    type: 'Khas',
    meaning: 'Nama panggilan untuk seorang guru lelaki bernama Ahmad.',
    example: 'Cikgu Ahmad sangat rajin mengajar.',
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    word: 'Sungai',
    type: 'Am',
    meaning: 'Aliran air yang besar.',
    example: 'Air sungai itu sangat jernih.',
    imageUrl: 'https://images.unsplash.com/photo-1437482012494-097fabc73087?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    word: 'Sungai Rajang',
    type: 'Khas',
    meaning: 'Sungai terpanjang di Malaysia.',
    example: 'Sungai Rajang terletak di Sarawak.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '5',
    word: 'Kucing',
    type: 'Am',
    meaning: 'Haiwan peliharaan yang comel.',
    example: 'Kucing itu sedang tidur.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '6',
    word: 'Si Belang',
    type: 'Khas',
    meaning: 'Nama khas untuk seekor kucing.',
    example: 'Si Belang suka makan ikan.',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400',
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'mcq',
    question: 'Pilih kata nama Am yang betul.',
    options: ['Proton', 'Sekolah', 'Ahmad', 'Kuala Lumpur'],
    answer: 'Sekolah',
    explanation: 'Sekolah adalah tempat umum, manakala yang lain adalah nama khas.',
  },
  {
    id: 'q2',
    type: 'mcq',
    question: 'Siapakah nama khas untuk rakan anda?',
    options: ['Murid', 'Kawan', 'Siti', 'Budak'],
    answer: 'Siti',
    explanation: 'Siti adalah nama individu yang khusus.',
  },
  {
    id: 'q3',
    type: 'category',
    question: 'Asingkan perkataan berikut.',
    answer: {
      Am: ['buku', 'meja', 'kerusi'],
      Khas: ['Malaysia', 'Mei', 'Sang Kancil'],
    },
    explanation: 'Perkataan kecil untuk kategori umum, perkataan bermula huruf besar untuk kategori khas.',
  },
];
