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

export type BookFormData = Omit<Book, 'id' | 'createdAt'>;