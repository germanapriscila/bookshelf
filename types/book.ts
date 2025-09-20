export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  pages?: number;
  currentPage?: number;
  status: 'to-read' | 'reading' | 'finished';
  rating?: number;
  coverUrl?: string;
  synopsis?: string;
  createdAt: Date;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt'>;