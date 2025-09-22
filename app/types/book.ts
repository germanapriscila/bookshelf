export type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

export type Genre =
  | 'Literatura Brasileira'
  | 'Ficção Científica'
  | 'Realismo Mágico'
  | 'Ficção'
  | 'Fantasia'
  | 'Romance'
  | 'Biografia'
  | 'História'
  | 'Autoajuda'
  | 'Tecnologia'
  | 'Programação'
  | 'Negócios'
  | 'Psicologia'
  | 'Filosofia'
  | 'Poesia';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  pages?: number;
  currentPage?: number;
  totalPages?: number;
  status: 'to-read' | 'reading' | 'finished';
  rating?: number;
  coverUrl?: string;
  synopsis?: string;
  createdAt: Date;
  isbn?: string;
  notes?: string;
}


