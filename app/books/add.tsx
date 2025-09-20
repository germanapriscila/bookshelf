'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '../../contexts/BookContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function AddBookPage() {
  const router = useRouter();
  const { addBook } = useBooks();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim()) {
      alert('Por favor, preencha título e autor');
      return;
    }

    setIsSubmitting(true);

    try {
      addBook({
        title: title.trim(),
        author: author.trim(),
        status: 'to-read',
      });

      router.push('/books');
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      alert('Erro ao adicionar livro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Livro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do livro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Digite o nome do autor"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar Livro'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}