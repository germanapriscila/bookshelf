'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../types/book';
import { initialBooks } from '../data/initialBooks';

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks(prev => 
      prev.map(book => 
        book.id === id ? { ...book, ...bookData } : book
      )
    );
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  return (
    <BookContext.Provider value={{
      books,
      addBook,
      updateBook,
      deleteBook,
      getBookById
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within BookProvider');
  }
  return context;
};