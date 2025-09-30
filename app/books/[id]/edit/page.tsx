"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooks } from "@/contexts/BookContext";
import { Book } from "@/types/book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusOptions = [
  { value: 'to-read', label: 'Para Ler' },
  { value: 'reading', label: 'Lendo' },
  { value: 'finished', label: 'Finalizado' }
];

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? "";
  const { getBookById, updateBook } = useBooks();
  
  const [formData, setFormData] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push("/books");
      return;
    }
    const bookData = getBookById(id);
    if (bookData) {
      setFormData(bookData);
    } else {
      router.push("/books");
    }
  }, [id, getBookById, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      
      // Converter para número se for campo numérico
      if (name === 'pages' || name === 'currentPage' || name === 'totalPages' || name === 'rating') {
        return { ...prev, [name]: value ? parseInt(value) : undefined };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => prev && { ...prev, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!formData.title.trim() || !formData.author.trim()) {
      alert('Título e autor são obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      updateBook(formData.id, formData);
      router.push(`/books/${formData.id}`);
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      alert('Erro ao atualizar livro');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  const progress = formData.totalPages 
    ? Math.round(((formData.currentPage || 0) / formData.totalPages) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        ← Voltar
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Editar Livro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview da Capa */}
            {formData.coverUrl && (
              <div className="flex justify-center mb-6">
                <img
                  src={formData.coverUrl}
                  alt={formData.title}
                  className="w-48 h-auto rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Grid de Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Autor */}
              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gênero */}
              <div className="space-y-2">
                <Label htmlFor="genre">Gênero</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre || ''}
                  onChange={handleChange}
                  placeholder="Ex: Romance, Ficção..."
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total de Páginas */}
              <div className="space-y-2">
                <Label htmlFor="totalPages">Total de Páginas</Label>
                <Input
                  id="totalPages"
                  name="totalPages"
                  type="number"
                  value={formData.totalPages || ''}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* Página Atual */}
              <div className="space-y-2">
                <Label htmlFor="currentPage">Página Atual</Label>
                <Input
                  id="currentPage"
                  name="currentPage"
                  type="number"
                  value={formData.currentPage || ''}
                  onChange={handleChange}
                  min="0"
                  max={formData.totalPages || undefined}
                />
              </div>

              {/* ISBN */}
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn || ''}
                  onChange={handleChange}
                  placeholder="Opcional"
                />
              </div>

              {/* URL da Capa */}
              <div className="space-y-2">
                <Label htmlFor="coverUrl">URL da Capa</Label>
                <Input
                  id="coverUrl"
                  name="coverUrl"
                  type="url"
                  value={formData.coverUrl || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Avaliação */}
            <div className="space-y-2">
              <Label>Avaliação</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`text-3xl transition-colors ${
                      formData.rating && star <= formData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } hover:text-yellow-500`}
                  >
                    ★
                  </button>
                ))}
                {formData.rating && (
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.rating}/5 estrelas
                  </span>
                )}
              </div>
            </div>

            {/* Sinopse */}
            <div className="space-y-2">
              <Label htmlFor="synopsis">Sinopse</Label>
              <textarea
                id="synopsis"
                name="synopsis"
                value={formData.synopsis || ''}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Resumo do livro..."
              />
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Pessoais</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Suas anotações sobre o livro..."
              />
            </div>

            {/* Barra de Progresso */}
            {formData.totalPages && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Progresso de Leitura</Label>
                  <span className="text-sm text-gray-600">
                    {formData.currentPage || 0}/{formData.totalPages} ({progress}%)
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

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/books/${formData.id}`)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
