"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooks } from "@/contexts/BookContext";
import { Book } from "@/types/book";

export default function EditBookClient() {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? "";
  const { getBookById } = useBooks();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    console.log("ID recebido:", id);
    if (!id) {
      router.push("/books");
      return;
    }
    const bookData = getBookById(id);
    if (bookData) {
      setBook(bookData);
    } else {
      router.push("/books");
    }
  }, [id, getBookById, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBook((prev) => prev && { ...prev, [name]: value });
  };

  const handleRatingChange = (rating: number) => {
    setBook((prev) => prev && { ...prev, rating });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    console.log("📘 Livro atualizado:", book);
    router.push(`/books/${book.id}`);
  };

  if (!book) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          ← Voltar aos Detalhes
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Editar livro</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview da capa
              </label>
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full max-w-48 h-auto rounded shadow-md"
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="title"
                value={book.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <input
                type="text"
                name="author"
                value={book.author}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total de páginas
              </label>
              <input
                type="number"
                name="totalPages"
                value={book.totalPages ?? 0}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Página atual
              </label>
              <input
                type="number"
                name="currentPage"
                value={book.currentPage ?? 0}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={book.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Quero ler">QUERO LER</option>
                <option value="Lendo">LENDO</option>
                <option value="Lido">LIDO</option>
                <option value="Pausado">PAUSADO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={book.isbn || ""}
                onChange={handleChange}
                placeholder="Opcional"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da capa
              </label>
              <input
                type="url"
                name="coverUrl"
                value={book.coverUrl || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gênero
              </label>
              <input
                type="text"
                name="genre"
                value={book.genre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avaliação
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`text-2xl ${
                      book.rating && star <= book.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } hover:text-yellow-500 transition-colors`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {book.rating},5 estrelas
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            name="notes"
            value={book.notes || ""}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Adicione suas notas sobre o livro..."
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Progresso
            </label>
            <span className="text-sm text-gray-600">
              {book.currentPage ?? 0}/{book.totalPages ?? 0} (
              {book.totalPages
                ? Math.round(((book.currentPage ?? 0) / book.totalPages) * 100)
                : 0}
              %)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  ((book.currentPage ?? 0) / (book.totalPages ?? 1)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Todos os campos obrigatórios estão preenchidos
          </p>
        </div>

        <div className="flex justify-end mt-8 space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/books/${book.id}`)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
