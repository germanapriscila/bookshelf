import { getBooks } from "@/app/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import BookSearch from "@/components/BookSearch";
import { ClientBookCard } from "@/components/BookCard";
import type { Book } from "@/app/types/book"; // Add this import if Book is defined in types

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const books = await getBooks();

  const filteredBooks = books.filter((book: Book) => {
    if (!searchParams.q) return true;

    const searchTerms = searchParams.q.toLowerCase().split(" ");

    return searchTerms.every(
      (term) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.genres &&
          book.genres.some((genre) =>
            genre.title.toLowerCase().includes(term)
          )) ||
        (book.synopsis && book.synopsis.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Livros</h1>
        <Link
          href="/books/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Adicionar Livro
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Livros</CardTitle>
        </CardHeader>
        <CardContent>
          <BookSearch />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book: Book) => (
          <ClientBookCard key={book.id} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum livro encontrado</p>
          <Link
            href="/books/add"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Adicionar seu primeiro livro
          </Link>
        </div>
      )}

      {books.length > 0 && filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Nenhum livro encontrado para &quot;{searchParams.q}&quot;
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Tente pesquisar por outro título, autor ou gênero
          </p>
        </div>
      )}
    </div>
  );
}
