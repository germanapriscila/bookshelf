'use client';

import { useBooks } from '../contexts/BookContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Link from 'next/link';

export default function Home() {
  const { books } = useBooks();

  const stats = {
    total: books.length,
    reading: books.filter(book => book.status === 'reading').length,
    finished: books.filter(book => book.status === 'finished').length,
    toRead: books.filter(book => book.status === 'to-read').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo à sua biblioteca pessoal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Livros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lendo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reading}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Finalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.finished}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Para Ler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.toRead}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Link href="/books" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Ver Todos os Livros
        </Link>
        <Link href="/books/add" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Adicionar Novo Livro
        </Link>
      </div>
    </div>
  );
}