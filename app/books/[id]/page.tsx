'use client';

import { useState } from 'react';
import { useBooks } from '@/contexts/BookContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DeleteBookModal from '../../components/DeleteBookModal';

const statusLabels = {
  'to-read': 'Para Ler',
  'reading': 'Lendo',
  'finished': 'Finalizado'
};

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getBookById, deleteBook } = useBooks();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const book = getBookById(params.id as string);

  const handleDelete = () => {
    if (book) {
      deleteBook(book.id);
      router.push('/books');
    }
  };

  if (!book) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Livro não encontrado</h1>
        <Link href="/books" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  const progress = book.totalPages 
    ? Math.round(((book.currentPage || 0) / book.totalPages) * 100)
    : 0;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header com botões */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            ← Voltar
          </button>
          <div className="flex gap-2">
            <Link href={`/books/${book.id}/edit`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                ✏️ Editar
              </button>
            </Link>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🗑️ Excluir
            </button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Capa do livro */}
              {book.coverUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-48 h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* Informações principais */}
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                <p className="text-xl text-gray-600 mb-4">por {book.author}</p>
                
                {/* Badge de Status */}
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  book.status === 'finished' ? 'bg-green-100 text-green-800' :
                  book.status === 'reading' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {statusLabels[book.status]}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Grid de Informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {book.genre && (
                <div>
                  <h3 className="font-medium text-gray-700">Gênero</h3>
                  <p className="text-gray-900">{book.genre}</p>
                </div>
              )}

              {book.totalPages && (
                <div>
                  <h3 className="font-medium text-gray-700">Total de Páginas</h3>
                  <p className="text-gray-900">{book.totalPages}</p>
                </div>
              )}

              {book.currentPage !== undefined && (
                <div>
                  <h3 className="font-medium text-gray-700">Página Atual</h3>
                  <p className="text-gray-900">{book.currentPage}</p>
                </div>
              )}

              {book.isbn && (
                <div>
                  <h3 className="font-medium text-gray-700">ISBN</h3>
                  <p className="text-gray-900">{book.isbn}</p>
                </div>
              )}

              {book.rating && (
                <div>
                  <h3 className="font-medium text-gray-700">Avaliação</h3>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < book.rating! ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-600">({book.rating}/5)</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-700">Adicionado em</h3>
                <p className="text-gray-900">
                  {book.createdAt.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Barra de Progresso */}
            {book.totalPages && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Progresso de Leitura</h3>
                  <span className="text-sm text-gray-600">
                    {book.currentPage || 0}/{book.totalPages} ({progress}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Sinopse */}
            {book.synopsis && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Sinopse</h3>
                <p className="text-gray-900 leading-relaxed">{book.synopsis}</p>
              </div>
            )}

            {/* Notas */}
            {book.notes && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Minhas Notas</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{book.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteBookModal
        isOpen={isDeleteModalOpen}
        bookTitle={book.title}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}