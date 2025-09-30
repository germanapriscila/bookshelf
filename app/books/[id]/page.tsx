"use client";

import { useBooks } from "../../../contexts/BookContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const statusLabels = {
  "to-read": "Para Ler",
  reading: "Lendo",
  finished: "Finalizado",
};

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getBookById } = useBooks();

  const book = getBookById(params.id as string);

  if (!book) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Livro não encontrado</h1>
        <Link
          href="/books"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voltar para a lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          ← Voltar
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{book.title}</CardTitle>
          <p className="text-xl text-gray-500">por {book.author}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna da Imagem */}
            <div className="md:col-span-1">
              {book.coverUrl && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={book.coverUrl}
                    alt={`Capa do livro ${book.title}`}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Coluna de Detalhes */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700">Status</h3>
                  <p className="text-lg text-gray-900">
                    {statusLabels[book.status]}
                  </p>
                </div>

                {book.genre && (
                  <div>
                    <h3 className="font-medium text-gray-700">Gênero</h3>
                    <p className="text-lg text-gray-900">{book.genre}</p>
                  </div>
                )}

                {book.pages && (
                  <div>
                    <h3 className="font-medium text-gray-700">Páginas</h3>
                    <p className="text-lg text-gray-900">{book.pages}</p>
                  </div>
                )}

                {book.currentPage && (
                  <div>
                    <h3 className="font-medium text-gray-700">Página atual</h3>
                    <p className="text-lg text-gray-900">{book.currentPage}</p>
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
                            i < book.rating!
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-gray-600">
                        ({book.rating}/5)
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-700">Adicionado em</h3>
                  <p className="text-lg text-gray-900">
                    {book.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {book.synopsis && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Sinopse</h3>
                  <p className="text-gray-900 leading-relaxed">
                    {book.synopsis}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
